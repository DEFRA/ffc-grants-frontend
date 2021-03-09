const { any } = require('joi');
const Joi = require('joi')

function createModel(errorMessage, errorSummary, currentData, plannedData) {
    return {
        backLink: '/irrigation-water-source',
        ...(errorSummary ? { errorText: errorSummary } : {}),
        irrigationCurrent: {
            idPrefix: "irrigationCurrent",
            name: "irrigationCurrent",
            fieldset: {
                legend: {
                    text: "What systems are currently used to irrigate?",
                    isPageHeading: true,
                    classes: "govuk-fieldset__legend--l"
                }
            },
            items: [

                {
                    value: "Trickle",
                    text: "Trickle",
                    checked: isChecked(currentData,'Trickle')
                },
                {
                    value: "Boom irrigator",
                    text: "Boom irrigator",
                    checked: isChecked(currentData,'Boom irrigator')
                },
                {
                    value: "Ebb and flood or capillary bed",
                    text: "Ebb and flood or capillary bed",
                    checked: isChecked(currentData,'Ebb and flood or capillary bed')
                },
                {
                    value: "Sprinklers or mist",
                    text: "Sprinklers or mist",
                    checked: isChecked(currentData,'Sprinklers or mist')
                },
                {
                    value: "Rain gun",
                    text: "Rain gun",
                    checked: isChecked(currentData,'Rain gun')
                },
                {
                    value: "Not currently irrigating",
                    text: "Not currently irrigating",
                    checked: isChecked(currentData,'Not currently irrigating')
                }
            ],
            ...(errorMessage && !currentData ? { errorMessage: { text: errorMessage } } : {})
        },
        irrigationPlanned: {
            idPrefix: "irrigationPlanned",
            name: "irrigationPlanned",
            fieldset: {
                legend: {
                    text: "What systems will be used to irrigate?",
                    isPageHeading: true,
                    classes: "govuk-fieldset__legend--l"
                }
            },
            items: [

                {
                    value: "Trickle",
                    text: "Trickle",
                    checked: isChecked(plannedData,'Trickle')
                },
                {
                    value: "Boom irrigator",
                    text: "Boom irrigator",
                    checked: isChecked(plannedData,'Boom irrigator')
                },
                {
                    value: "Ebb and flood or capillary bed",
                    text: "Ebb and flood or capillary bed",
                    checked: isChecked(plannedData,'Ebb and flood or capillary bed')
                },
                {
                    value: "Sprinklers or mist",
                    text: "Sprinklers or mist",
                    checked: isChecked(plannedData,'Sprinklers or mist')
                },
                {
                    value: "Rain gun",
                    text: "Rain gun",
                    checked: isChecked(plannedData,'Rain gun')
                }
            ],
            ...(errorMessage && !plannedData ? { errorMessage: { text: errorMessage } } : {})
        }
    }
}

function isChecked(data, option) {
    return !!data && (data.includes(option))
}

module.exports = [
    {
        method: 'GET',
        path: '/irrigation-systems',
        handler: (request, h) => {
            const irrigationCurrent = request.yar.get('irrigationCurrent');
            const irrigationPlanned = request.yar.get('irrigationPlanned');
            const currentData = !!irrigationCurrent ? irrigationCurrent : null
            const plannedData = !!irrigationPlanned ? irrigationPlanned : null
            return h.view('irrigation-systems', createModel(null, null, currentData, plannedData))
        }
    },
    {
        method: 'POST',
        path: '/irrigation-systems',
        options: {
            validate: {
                payload: Joi.object({
                    irrigationCurrent: Joi.any().required(),
                    irrigationPlanned: Joi.any().required()
                }),
                failAction: (request, h) => {
                    let { irrigationCurrent, irrigationPlanned } = request.payload
                    return h.view('irrigation-systems', createModel('Please select an option', null, irrigationCurrent, irrigationPlanned)).takeover()
                }
            },
            handler: (request, h) => {
                let irrigationCurrent = []
                let irrigationPlanned = []

                if (typeof request.payload.irrigationCurrent === 'string') {
                    irrigationCurrent.push(request.payload.irrigationCurrent)
                } else irrigationCurrent = request.payload.irrigationCurrent

                if (typeof request.payload.irrigationPlanned === 'string') {
                    irrigationPlanned.push(request.payload.irrigationPlanned)
                } else irrigationPlanned = request.payload.irrigationPlanned

                if (irrigationCurrent.length > 2 || irrigationPlanned.length > 2) {
                    return h.view('irrigation-systems', createModel('Only one or two selections are allowed', 'Only one or two selections are allowed', irrigationCurrent, irrigationPlanned))
                        .takeover()
                }

                request.yar.set('irrigationCurrent', request.payload.irrigationCurrent)
                request.yar.set('irrigationPlanned', request.payload.irrigationCurrent)
                return h.redirect('./productivity')

            }
        }
    }
]
