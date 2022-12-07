const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const { SELECT_VARIABLE_TO_REPLACE, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex')
const { getUrl } = require('../helpers/urls')
const { guardPage } = require('../helpers/page-guard')
const { notUniqueSelection, uniqueSelection } = require('../helpers/utils')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const emailFormatting = require('./../messaging/email/process-submission')
const gapiService = require('../services/gapi-service')
const { startPageUrl } = require('../config/server')

const {
  getConfirmationId,
  handleConditinalHtmlData,
  getCheckDetailsModel,
  getEvidenceSummaryModel,
  getDataFromYarValue,
  getConsentOptionalData,
  saveValuesToArray,
} = require('./pageHelpers')

const getPage = async (question, request, h) => {
  const { url, backUrl, nextUrlObject, type, title, yarKey, preValidationKeys, preValidationKeysRule } = question
  const nextUrl = getUrl(nextUrlObject, question.nextUrl, request)
  const isRedirect = guardPage(request, preValidationKeys, preValidationKeysRule)
  if (isRedirect) {
    return h.redirect(startPageUrl)
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
        const emailData = await emailFormatting({ body: createMsg.getAllDetails(request, confirmationId) }, request.yar.id)
        await senders.sendDesirabilitySubmitted(emailData, request.yar.id) // replace with sendDesirabilitySubmitted, and replace first param with call to function in process-submission
        await gapiService.sendDimensionOrMetrics(request, [ {
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
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
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
  // if (question.ga) {
  //   await gapiService.processGA(request, question.ga, confirmationId)
  // }

  switch (url) {
    case 'check-details': {
      return h.view('check-details', getCheckDetailsModel(request, question, backUrl, nextUrl))
    }
    case 'planning-permission-summary': { // double check this
      const evidenceSummaryModel = getEvidenceSummaryModel(request, question, backUrl, nextUrl)
      if (evidenceSummaryModel.redirect) {
        return h.redirect(startPageUrl)
      }
      return h.view('evidence-summary', evidenceSummaryModel)
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
  if (url === 'check-details') {
    setYarValue(request, 'reachedCheckDetails', true)

    const applying = getYarValue(request, 'applying')
    const businessDetails = getYarValue(request, 'businessDetails')
    const agentDetails = getYarValue(request, 'agentsDetails')
    const farmerDetails = getYarValue(request, 'farmerDetails')

    const agentContact = saveValuesToArray(agentDetails, [ 'emailAddress', 'mobileNumber', 'landlineNumber' ])
    const agentAddress = saveValuesToArray(agentDetails, [ 'address1', 'address2', 'town', 'county', 'postcode' ])

    const farmerContact = saveValuesToArray(farmerDetails, [ 'emailAddress', 'mobileNumber', 'landlineNumber' ])
    const farmerAddress = saveValuesToArray(farmerDetails, [ 'address1', 'address2', 'town', 'county', 'postcode' ])

    const MODEL = {
      ...question.pageData,
      backUrl,
      nextUrl,
      applying,
      businessDetails,
      farmerDetails: {
        ...farmerDetails,
        ...(farmerDetails
          ? {
            name: `${farmerDetails.firstName} ${farmerDetails.lastName}`,
            contact: farmerContact.join('<br/>'),
            address: farmerAddress.join('<br/>')
          }
          : {}
        )
      },
      agentDetails: {
        ...agentDetails,
        ...(agentDetails
          ? {
            name: `${agentDetails.firstName} ${agentDetails.lastName}`,
            contact: agentContact.join('<br/>'),
            address: agentAddress.join('<br/>')
          }
          : {}
        )
      }

    }

    return h.view('check-details', MODEL)
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
  for (const [ key, value ] of Object.entries(payload)) {
    thisAnswer = answers?.find(answer => (answer.value === value))

    if (type !== 'multi-input' && key !== 'secBtn') {
      setYarValue(request, key, key === 'projectPostcode' ? value.replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase() : value)
    }
  }
  if (type === 'multi-input') {
    let allFields = currentQuestion.allFields

    allFields.forEach(field => {
      const payloadYarVal = payload[ field.yarKey ]
        ? payload[ field.yarKey ].replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase()
        : ''
      dataObject = {
        ...dataObject,
        [ field.yarKey ]: (
          (field.yarKey === 'postcode' || field.yarKey === 'projectPostcode')
            ? payloadYarVal
            : payload[ field.yarKey ] || ''
        ),
        ...field.conditionalKey ? { [ field.conditionalKey ]: payload[ field.conditionalKey ] } : {}
      }
    })
    setYarValue(request, yarKey, dataObject)
  }

  if (title) {
    currentQuestion = {
      ...currentQuestion,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
  }

  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    gapiService.sendValidationDimension(request)
    return errors
  }

  if (thisAnswer?.notEligible || (yarKey === 'projectCost' ? !getGrantValues(payload[ Object.keys(payload)[ 0 ] ], currentQuestion.grantInfo).isEligible : null)) {
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
    const { calculatedGrant, remainingCost, projectCost } = getGrantValues(payload[ Object.keys(payload)[ 0 ] ], currentQuestion.grantInfo)
    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
    setYarValue(request, 'projectCost', projectCost)
  }
  return h.redirect(getUrl(nextUrlObject, nextUrl, request, payload.secBtn, currentQuestion.url))
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
