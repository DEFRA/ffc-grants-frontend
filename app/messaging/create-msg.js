const allYarKeys = require('../helpers/yar-keys')
const Joi = require('joi')

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
  const val = {
    project: request.yar.get('project'),
    irrigatedCrops: request.yar.get('irrigatedCrops'),
    irrigatedLandCurrent: Number(request.yar.get('irrigatedLandCurrent')),
    irrigatedLandTarget: Number(request.yar.get('irrigatedLandTarget')),
    waterSourceCurrent: request.yar.get('waterSourceCurrent'),
    waterSourcePlanned: request.yar.get('waterSourcePlanned'),
    irrigationCurrent: request.yar.get('irrigationCurrent'),
    irrigationPlanned: request.yar.get('irrigationPlanned'),
    productivity: request.yar.get('productivity'),
    collaboration: request.yar.get('collaboration')
  }
  const result = desirabilityAnswersSchema.validate(val, {
    abortEarly: false
  })
  if (result.error) {
    throw new Error(`The scoring data is invalid. ${result.error.message}`)
  }
  return result.value
}

module.exports = {
  getDesirabilityAnswers,
  getAllDetails
}
