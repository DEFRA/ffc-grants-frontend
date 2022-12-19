const allYarKeys = require('../helpers/yar-keys')
const Joi = require('joi')
const { getDataFromYarValue } = require('../helpers/pageHelpers')
const { getYarValue } = require('../helpers/session')

function getAllDetails (request, confirmationId) {
  return allYarKeys.reduce(
    (allDetails, key) => {
      allDetails[key] = request.yar.get(key)
      return allDetails
    },
    { confirmationId }
  )
}

const desirabilityAnswersSchema = Joi.object({
  project: Joi.array().items(Joi.string()),
  irrigatedCrops: Joi.string(),
  irrigatedLandCurrent: Joi.number(),
  irrigatedLandTarget: Joi.number(),
  waterSourceCurrent: Joi.array().items(Joi.string()),
  waterSourcePlanned: Joi.array().items(Joi.string()),
  irrigationCurrent: Joi.array().items(Joi.string()),
  irrigationPlanned: Joi.array().items(Joi.string()),
  productivity: Joi.array().items(Joi.string()),
  collaboration: Joi.string()
})

function getDesirabilityAnswers (request) {
  console.log('getDesirabilityAnswers: ', 2)
  try {
    const val = {
      project: getDataFromYarValue(request, 'project', 'multi-answer'),
      irrigatedCrops: getYarValue(request, 'irrigatedCrops'),
      irrigatedLandCurrent: getYarValue(request, 'irrigatedLandCurrent'),
      irrigatedLandTarget: getYarValue(request, 'irrigatedLandTarget'),
      waterSourceCurrent: getDataFromYarValue(request, 'waterSourceCurrent', 'multi-answer'),
      waterSourcePlanned: getDataFromYarValue(request, 'waterSourcePlanned', 'multi-answer'),
      irrigationCurrent: getDataFromYarValue(request, 'irrigationCurrent', 'multi-answer'),
      irrigationPlanned: getDataFromYarValue(request, 'irrigationPlanned', 'multi-answer'),
      productivity: getDataFromYarValue(request,'productivity', 'multi-answer'),
      collaboration: getYarValue(request, 'collaboration'),
    }
    console.log('val: ', val);
    const result = desirabilityAnswersSchema.validate(val, {
      abortEarly: false
    })
    // console.log('result: ', result);
    if (result.error) {
      throw new Error(`The scoring data is invalid. ${result.error.message}`)
    }
    return result.value
  } catch (ex) {
    console.log(ex, 'error')
    return null
  }
}

module.exports = {
  getDesirabilityAnswers,
  getAllDetails
}
