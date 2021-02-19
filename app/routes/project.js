const Joi = require('joi')

function createModel(errorMessage,errorSummary) {
    return {
        backLink: '/farming-type',
        ...(errorSummary ? { errorText: errorSummary }  : {}),
        checkboxes: {
            idPrefix: "project",
            name: "project",
            fieldset: {
                legend: {
                    text: "The project will:",
                    isPageHeading: false,
                    classes: "govuk-fieldset__legend--m"
                }
            },
            items: [
                {
                    value: "Change water source",
                    text: "Change water source "
                },
                {
                    value: "Improve irrigation efficiency",
                    text: "Improve irrigation efficiency "
                },
                {
                    value: "Increase irrigation",
                    text: "Increase irrigation "
                },
                {
                    value: "Introduce irrigation",
                    text: "Introduce irrigation "
                }
            ],
            ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
        }
    }
}

function createModelNotEligible() {
    return {
        backLink: '/project',
        sentences: [
            'This is only available to arable and horticultural farming businesses that supply the food industry, nurseries growing flowers or forestry nurseries.'
        ]
    }
}

module.exports = [
    {
        method: 'GET',
        path: '/project',
        handler: (request, h) => h.view('project', createModel(null))
    },
    {
        method: 'POST',
        path: '/project',
        options: {
            validate: {
                payload: Joi.object({
                    project: Joi.array().required()
                }),
                failAction: (request, h) =>
                    h
                        .view('project', createModel('Please select an option'))
                        .takeover()
            },
            handler: (request, h) => {
                if (request.payload.project.length <=2) {
                    request.yar.set('project', request.payload.project)
                    return h.redirect('./legal-status')
                }

                return h
                .view('project', createModel('Only one or two selections are allowed','Only one or two selections are allowed'))
                .takeover()
            }
        }
    }
]
