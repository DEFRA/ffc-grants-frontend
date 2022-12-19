const allYarKeys = require('../helpers/yar-keys')
const Joi = require('joi')
const { getDataFromYarValue } = require('../helpers/pageHelpers')

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
  const val = {
    project: getDataFromYarValue(request, 'project', 'multi-answer'),
    irrigatedCrops: request.yar.get('irrigatedCrops'),
    irrigatedLandCurrent: Number(request.yar.get('irrigatedLandCurrent')),
    irrigatedLandTarget: Number(request.yar.get('irrigatedLandTarget')),
    waterSourceCurrent: getDataFromYarValue(request, 'waterSourceCurrent', 'multi-answer'),
    waterSourcePlanned: getDataFromYarValue(request, 'waterSourcePlanned', 'multi-answer'),
    irrigationCurrent: getDataFromYarValue(request, 'irrigationCurrent', 'multi-answer'),
    irrigationPlanned: getDataFromYarValue(request, 'irrigationPlanned', 'multi-answer'),
    productivity: getDataFromYarValue(request,'productivity', 'multi-answer'),
    collaboration: request.yar.get('collaboration')
  }
  console.log('val: ', val)
  const result = desirabilityAnswersSchema.validate(val, {
    abortEarly: false
  })
  // console.log('result: ', result);
  if (result.error) {
    throw new Error(`The scoring data is invalid. ${result.error.message}`)
  }
  return result.value
}

module.exports = {
  getDesirabilityAnswers,
  getAllDetails
}
