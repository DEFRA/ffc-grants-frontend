module.exports = {
  desirabilityQuestions: require('./desirability-questions'),
  desirabilityInputQuestionMapping: {
    'irrigated-crops': 'irrigatedCrops',
    'irrigated-land-a': 'irrigatedLandCurrent',
    'irrigated-land-b': 'irrigatedLandTarget',
    'water-source-a': 'waterSourceCurrent',
    'water-source-b': 'waterSourcePlanned',
    'irrigation-system-a': 'irrigationCurrent',
    'irrigation-system-b': 'irrigationPlanned',
    productivity: 'productivity',
    collaboration: 'collaboration'
  }
}
