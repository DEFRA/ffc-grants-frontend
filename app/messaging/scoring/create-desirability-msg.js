const grantSchemeConfig = require('./config/grant-scheme')
const { desirabilityInputQuestionMapping, desirabilityQuestions: questionContent } = require('./content-mapping')
const desirabilityQuestions = ['irrigated-crops', 'irrigated-land', 'water-source', 'change-summer-abstraction', 'irrigation-system', 'productivity', 'collaboration']

function getUserAnswer(answers, userInput) {
    if (answers) {
        return [userInput].flat().map(answer =>
            ({ key: Object.keys(answers).find(key => answers[key] === answer), value: answer }))
    } else {
        return [{ key: null, value: userInput }]
    }
}

function getDesirabilityDetails(questionKey, userInput) {
    const content = questionContent[questionKey]

    return {
        key: questionKey,
        answers: content.map(({ key, title, answers }) => ({
            key,
            title,
            input: getUserAnswer(answers, userInput[desirabilityInputQuestionMapping[key]])
        })),
        rating: {
            score: null,
            band: null,
            importance: null
        }
    }
}

function desirability(userInput) {
    return {
        grantScheme: {
            key: grantSchemeConfig.key,
            name: grantSchemeConfig.name
        },
        desirability: {
            questions: desirabilityQuestions.map(questionKey => getDesirabilityDetails(questionKey, userInput)),
            overallRating: {
                score: null,
                band: null
            }
        }
    }
}

module.exports = desirability
