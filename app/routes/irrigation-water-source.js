const { any } = require('joi');
const Joi = require('joi')

function createModel(errorMessage, errorSummary, currentData, plannedData) {
    return {
        backLink: '/irrigated-land',
        ...(errorSummary ? { errorText: errorSummary } : {}),
        waterSourceCurrent: {
            idPrefix: "waterSourceCurrent",
            name: "waterSourceCurrent",
            fieldset: {
                legend: {
                    text: "Where does your current irrigation water come from?",
                    isPageHeading: true,
                    classes: "govuk-fieldset__legend--l"
                }
            },
            items: [
                {
                    value: "Peak flow surface water",
                    text: "Peak flow surface water",
                    checked: !!currentData && (currentData.includes('Peak flow surface water'))
                },
                {
                    value: "Bore hole / aquifer",
                    text: "Bore hole / aquifer",
                    checked: !!currentData && (currentData.includes('Bore hole / aquifer'))
                },
                {
                    value: "Rain water harvesting",
                    text: "Rain water harvesting",
                    checked: !!currentData && (currentData.includes('Rain water harvesting'))
                },
                {
                    value: "Summer water surface abstraction",
                    text: "Summer water surface abstraction",
                    checked: !!currentData && (currentData.includes('Summer water surface abstraction'))
                },
                {
                    value: "Mains",
                    text: "Mains",
                    checked: !!currentData && (currentData.includes('Mains'))
                },
                {
                    value: "Not currently irrigating",
                    text: "Not currently irrigating",
                    checked: !!currentData && (currentData.includes('Not currently irrigating'))
                }
            ],
            ...(errorMessage && (!currentData || currentData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
        },
        waterSourcePlanned: {
            idPrefix: "waterSourcePlanned",
            name: "waterSourcePlanned",
            fieldset: {
                legend: {
                    text: "Where will the irrigation water come from?",
                    isPageHeading: true,
                    classes: "govuk-fieldset__legend--l"
                }
            },
            items: [
                {
                    value: "Peak flow surface water",
                    text: "Peak flow surface water",
                    checked: !!plannedData && (plannedData.includes('Peak flow surface water'))
                },
                {
                    value: "Bore hole / aquifer",
                    text: "Bore hole / aquifer",
                    checked: !!plannedData && (plannedData.includes('Bore hole / aquifer'))
                },
                {
                    value: "Rain water harvesting",
                    text: "Rain water harvesting",
                    checked: !!plannedData && (plannedData.includes('Rain water harvesting'))
                },
                {
                    value: "Summer water surface abstraction",
                    text: "Summer water surface abstraction",
                    checked: !!plannedData && (plannedData.includes('Summer water surface abstraction'))
                },
                {
                    value: "Mains",
                    text: "Mains",
                    checked: !!plannedData && (plannedData.includes('Mains'))
                }
            ],
            ...(errorMessage && (!plannedData || plannedData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
        }
    }
}

module.exports = [
    {
        method: 'GET',
        path: '/irrigation-water-source',
        handler: (request, h) => {
            const waterSourceCurrent = request.yar.get('waterSourceCurrent');
            const waterSourcePlanned = request.yar.get('waterSourcePlanned');
            const currentData = !!waterSourceCurrent ? waterSourceCurrent : null
            const plannedData = !!waterSourcePlanned ? waterSourcePlanned : null
            return h.view('irrigation-water-source', createModel(null, null, currentData, plannedData))
        }
    },
    {
        method: 'POST',
        path: '/irrigation-water-source',
        options: {
            validate: {
                payload: Joi.object({
                    waterSourceCurrent: Joi.any().required(),
                    waterSourcePlanned: Joi.any().required()
                }),
                failAction: (request, h) => {
                    let { waterSourceCurrent, waterSourcePlanned } = request.payload
                    return h.view('irrigation-water-source', createModel('Please select an option', null, waterSourceCurrent, waterSourcePlanned)).takeover()
                }
            },
            handler: (request, h) => {
                let waterSourceCurrent = []
                let waterSourcePlanned = []

                if (typeof request.payload.waterSourceCurrent === 'string') {
                    waterSourceCurrent.push(request.payload.waterSourceCurrent)
                } else waterSourceCurrent  = request.payload.waterSourceCurrent
                
                if (typeof request.payload.waterSourcePlanned === 'string') {
                    waterSourcePlanned.push(request.payload.waterSourcePlanned)
                } else   waterSourcePlanned  = request.payload.waterSourcePlanned
                
                if (waterSourceCurrent.length > 2 || waterSourcePlanned.length > 2) {
                    return h.view('irrigation-water-source', createModel('Only one or two selections are allowed', 'Only one or two selections are allowed', waterSourceCurrent, waterSourcePlanned))
                        .takeover()
                }

                request.yar.set('waterSourceCurrent', request.payload.waterSourceCurrent)
                request.yar.set('waterSourcePlanned', request.payload.waterSourceCurrent)
                return h.redirect('./irrigation-systems')

            }
        }
    }
]
