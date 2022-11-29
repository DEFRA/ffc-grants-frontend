const { getQuestionAnswer } = require('../helpers/utils')

const validateAnswerField = (value, validationType, details, payload) => {
  switch (validationType) {
    case 'NOT_EMPTY': {
      return (!!value)
    }

    case 'NOT_EMPTY_EXTRA': {
      if (value) {
        return true
      }

      const { extraFieldsToCheck } = details
      return extraFieldsToCheck.some(extraField => (
        !!payload[extraField]
      ))
    }

    case 'STANDALONE_ANSWER': {
      const selectedAnswer = [value].flat()
      const {
        standaloneObject: {
          questionKey: standaloneQuestionKey,
          answerKey: standaloneAnswerKey
        }
      } = details
      const standAloneAnswer = getQuestionAnswer(standaloneQuestionKey, standaloneAnswerKey)

      if (selectedAnswer.includes(standAloneAnswer)) {
        return selectedAnswer.length === 1
      }
      return true
    }

    case 'CONFIRMATION_ANSWER': {
      const { fieldsToCampare } = details
      return payload[fieldsToCampare[0]] === payload[fieldsToCampare[1]]
    }

    case 'COMBINATION_ANSWER': {
      const selectedAnswer = [value].flat()
      const {
        combinationObject: {
          questionKey: combinationQuestionKey,
          combinationAnswerKeys
        }
      } = details
      const combinationanswers = combinationAnswerKeys.map(answerKey => getQuestionAnswer(combinationQuestionKey, answerKey))

      if (selectedAnswer.includes(combinationanswers[0]) && selectedAnswer.length > 1) {
        return selectedAnswer.every((answer, index) => answer === combinationanswers[index])
      }

      return true
    }

    case 'REGEX': {
      const { regex } = details
      return (!value || regex.test(value))
    }

    case 'MIN_MAX_CHARS': {
      const { min, max } = details
      return (value.length >= min && value.length <= max)
    }

    case 'MIN_MAX': {
      const { min, max } = details
      return (value >= min && value <= max)
    }

    case 'MAX_SELECT': {
      const { max } = details
      return ([value].flat().length <= max)
    }
    default:
      return false
  }
}

const checkInputError = (validate, isconditionalAnswer, payload, yarKey) => {
  return validate.find(
    ({ type, dependentKey, ...details }) => (isconditionalAnswer && dependentKey)
      ? (validateAnswerField(payload[dependentKey], type, details, payload) === false)
      : !dependentKey && (validateAnswerField(payload[yarKey], type, details, payload) === false)
  )
}

module.exports = {
  validateAnswerField,
  checkInputError
}
