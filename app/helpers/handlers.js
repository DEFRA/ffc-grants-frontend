const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/helper-functions')
const { SELECT_VARIABLE_TO_REPLACE, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex')
const { getUrl } = require('../helpers/urls')
const { guardPage } = require('../helpers/page-guard')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const emailFormatting = require('./../messaging/email/process-submission')
const gapiService = require('../services/gapi-service')
const { startPageUrl, urlPrefix } = require('../config/server')

const {
  getConfirmationId,
  handleConditinalHtmlData,
  getCheckDetailsModel,
  getDataFromYarValue,
  getConsentOptionalData
} = require('./pageHelpers')

const {
  SUMMER_ABSTRACTION_MAINS_YES,
  SUMMER_ABSTRACTION_MAINS_NO,
  SUMMER_ABSTRACTION_MAINS_YES_ERROR,
  SUMMER_ABSTRACTION_MAINS_NO_ERROR
} = require('../helpers/water-source-data')

const getPage = async (question, request, h) => {
  const { url, backUrl, nextUrlObject, type, title, yarKey, preValidationKeys, preValidationKeysRule } = question
  const nextUrl = getUrl(nextUrlObject, question.nextUrl, request)
  const isRedirect = guardPage(request, preValidationKeys, preValidationKeysRule)
  if (isRedirect) {
    return h.redirect(startPageUrl)
  }
  if (getYarValue(request, 'current-score') && question.order < 15) {
    // check if score and if question is before scoring question. If it is, move to score results
    return h.redirect(`${urlPrefix}/summer-abstraction-mains`)
  }
  let confirmationId = ''

  if (question.maybeEligible) {
    let { maybeEligibleContent } = question
    maybeEligibleContent.title = question.title
    let consentOptionalData

    if (maybeEligibleContent.reference) {
      if (!getYarValue(request, 'consentMain')) {
        return h.redirect(startPageUrl)
      }
      confirmationId = getConfirmationId(request.yar.id)
      try {
        const overAllScore = getYarValue(request, 'overAllScore')
        const emailData = await emailFormatting({ body: createMsg.getAllDetails(request, confirmationId), overAllScore, correlationId: request.yar.id })
        await senders.sendDesirabilitySubmitted(emailData, request.yar.id) // replace with sendDesirabilitySubmitted, and replace first param with call to function in process-submission
        await gapiService.sendDimensionOrMetrics(request, [{
          dimensionOrMetric: gapiService.dimensions.CONFIRMATION,
          value: confirmationId
        }, {
          dimensionOrMetric: gapiService.dimensions.FINALSCORE,
          value: 'Eligible'
        },
        {
          dimensionOrMetric: gapiService.metrics.CONFIRMATION,
          value: 'TIME'
        }
        ])
        console.log('Confirmation event sent')
      } catch (err) {
        console.log('ERROR: ', err)
      }
      maybeEligibleContent = {
        ...maybeEligibleContent,
        reference: {
          ...maybeEligibleContent.reference,
          html: maybeEligibleContent.reference.html.replace(
            SELECT_VARIABLE_TO_REPLACE, (_ignore, _confirmatnId) => (
              confirmationId
            )
          )
        }
      }
      request.yar.reset()
    }

    maybeEligibleContent = {
      ...maybeEligibleContent,
      messageContent: maybeEligibleContent.messageContent.replace(
        SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
          formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
        )
      )
    }

    if (url === 'confirm') {
      const consentOptional = getYarValue(request, 'consentOptional')
      consentOptionalData = getConsentOptionalData(consentOptional)
    }

    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, consentOptionalData, url, nextUrl, backLink: backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  if (title) {
    question = {
      ...question,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => {
        if (additionalYarKeyName === 'currentlyIrrigating') {
          return getYarValue(request, additionalYarKeyName) === 'Yes' ? SUMMER_ABSTRACTION_MAINS_YES : SUMMER_ABSTRACTION_MAINS_NO
        }
        return formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      })
    }
  }

  const data = getDataFromYarValue(request, yarKey, type)

  let conditionalHtml
  if (question?.conditionalKey && question?.conditionalLabelData) {
    const conditional = yarKey === 'businessDetails' ? yarKey : question.conditionalKey
    conditionalHtml = handleConditinalHtmlData(
      type,
      question.conditionalLabelData,
      conditional,
      request
    )
  }

  switch (url) {
    case 'check-details': {
      return h.view('check-details', getCheckDetailsModel(request, question, backUrl, nextUrl))
    }
    case 'score':
    case 'business-details':
    case 'agent-details':
    case 'applicant-details': {
      return h.view('page', getModel(data, question, request, conditionalHtml))
    }
    default:
      break
  }

  return h.view('page', getModel(data, question, request, conditionalHtml))
}

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl, nextUrlObject, title, type } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backLink: baseUrl }
  const payload = request.payload

  let thisAnswer
  let dataObject

  if (yarKey === 'consentOptional' && !Object.keys(payload).includes(yarKey)) {
    setYarValue(request, yarKey, '')
  }
  for (const [key, value] of Object.entries(payload)) {
    thisAnswer = answers?.find(answer => (answer.value === value))

    if (type !== 'multi-input' && key !== 'results') {
      setYarValue(request, key, key === 'projectPostcode' ? value.replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase() : value)
    }
  }
  if (type === 'multi-input') {
    const allFields = currentQuestion.allFields

    allFields.forEach(field => {
      const payloadYarVal = payload[field.yarKey]
        ? payload[field.yarKey].replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase()
        : ''
      dataObject = {
        ...dataObject,
        [field.yarKey]: (
          (field.yarKey === 'postcode' || field.yarKey === 'projectPostcode' || field.yarKey === 'businessPostcode')
            ? payloadYarVal
            : payload[field.yarKey] || ''
        ),
        ...field.conditionalKey ? { [field.conditionalKey]: payload[field.conditionalKey] } : {}
      }
    })
    setYarValue(request, yarKey, dataObject)
  }

  if (title === 'Will you {{_currentlyIrrigating_}} summer abstraction or mains?') {
    currentQuestion = {
      ...currentQuestion,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => {
        if (additionalYarKeyName === 'currentlyIrrigating') {
          return getYarValue(request, additionalYarKeyName) === 'Yes' ? SUMMER_ABSTRACTION_MAINS_YES : SUMMER_ABSTRACTION_MAINS_NO
        }
          return formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      }),
      validate: [
        {
          type: 'NOT_EMPTY',
          error:  currentQuestion.validate[0].error.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => {
            console.log("additionalYarKeyName", getYarValue(request, additionalYarKeyName))
          if (additionalYarKeyName === 'currentlyIrrigating') {
            return getYarValue(request, additionalYarKeyName) === 'Yes' ?  SUMMER_ABSTRACTION_MAINS_YES_ERROR: SUMMER_ABSTRACTION_MAINS_NO_ERROR
          }
            return formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
        })
        }
    ]
    }
  }

  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    gapiService.sendValidationDimension(request)
    return errors
  }

  if (thisAnswer?.notEligible || (yarKey === 'projectCost' ? !getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo).isEligible : null)) {
    gapiService.sendEligibilityEvent(request, !!thisAnswer?.notEligible)
    if (thisAnswer?.alsoMaybeEligible) {
      const {
        maybeEligibleContent
      } = thisAnswer.alsoMaybeEligible

      maybeEligibleContent.title = currentQuestion.title
      const { url } = currentQuestion
      const MAYBE_ELIGIBLE = { ...maybeEligibleContent, url, nextUrl, backLink: baseUrl }
      return h.view('maybe-eligible', MAYBE_ELIGIBLE)
    }

    return h.view('not-eligible', NOT_ELIGIBLE)
  } else if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl)
  }
  if (yarKey === 'projectCost') {
    const { calculatedGrant, remainingCost, projectCost } = getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo)
    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
    setYarValue(request, 'projectCost', projectCost)
  }
  return h.redirect(getUrl(nextUrlObject, nextUrl, request, payload.results, currentQuestion.url))
}

const getHandler = (question) => {
  return (request, h) => {
    return getPage(question, request, h)
  }
}

const getPostHandler = (currentQuestion) => {
  return (request, h) => {
    return showPostPage(currentQuestion, request, h)
  }
}

module.exports = {
  getHandler,
  getPostHandler
}
