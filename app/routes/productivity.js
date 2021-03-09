const Joi = require('joi')
isChecked = require('../helpers/helper-functions')

function createModel(errorMessage, errorSummary, data) {
    return {
        backLink: '/irrigation-systems',
        ...(errorSummary ? { errorText: errorSummary } : {}),
        checkboxes: {
            idPrefix: "productivity",
            name: "productivity",
            fieldset: {
                legend: {
                    text: "How will the project improve productivity?",
                    isPageHeading: true,
                    classes: "govuk-fieldset__legend--l"
                }
            },
            hint: {
                text: "Productivity is about how much is produced relative to inputs (eg increased yield for the same inputs or the same yield with lower inputs)."
            },
            items: [
                {
                    value: "Introduce or expand high value crops",
                    text: "Introduce or expand high value crops",
                    checked: isChecked(data, 'Introduce or expand high value crops')
                },
                {
                    value: "Introduce or expand protected crops",
                    text: "Introduce or expand protected crops",
                    checked: isChecked(data, 'Introduce or expand protected crops')
                },
                {
                    value: "Increased yield per hectare",
                    text: "Increased yield per hectare",
                    checked: isChecked(data, 'Increased yield per hectare')
                },
                {
                    value: "Improved quality",
                    text: "Improved quality",
                    checked: isChecked(data, 'Improved quality')
                },
                {
                    value: "Maintain productivity",
                    text: "Maintain productivity",
                    checked: isChecked(data, 'Maintain productivity')
                }
            ],
            ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
        }
    }
}

module.exports = [
    {
        method: 'GET',
        path: '/productivity',
        handler: (request, h) => {
            const productivity = request.yar.get('productivity');
            const data = !!productivity ? productivity : null
            return h.view('productivity', createModel(null, null, data))
        }
    },
    {
        method: 'POST',
        path: '/productivity',
        options: {
            validate: {
                payload: Joi.object({
                    productivity: Joi.any().required()
                }),
                failAction: (request, h) =>
                    h
                        .view('productivity', createModel('Please select an option', null, null))
                        .takeover()
            },
            handler: (request, h) => {

                if (Array.isArray(request.payload.productivity) && request.payload.productivity.length > 2) {
                    return h
                        .view(
                            'productivity',
                            createModel(
                                'Only one or two selections are allowed',
                                'Only one or two selections are allowed',
                                null
                            ))
                        .takeover()
                }

                request.yar.set('productivity', request.payload.productivity)
                return h.redirect('./collaboration')

            }
        }
    }
]
