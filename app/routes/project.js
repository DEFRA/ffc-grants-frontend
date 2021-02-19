const Joi = require('joi')

function createModel(errorMessage, errorSummary) {
    return {
        backLink: '/farming-type',
        ...(errorSummary ? { errorText: errorSummary } : {}),
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
                    value: "Introduce irrigation",
                    text: "Introduce irrigation "
                },
                {
                    value: "Increase irrigation",
                    text: "Increase irrigation "
                },
                {
                    value: "Improve irrigation efficiency",
                    text: "Improve irrigation efficiency "
                },
                {
                    value: "Change water source",
                    text: "Change water source "
                }
            ],
            ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
        }
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
                if (request.payload.project.length <= 2) {
                    request.yar.set('project', request.payload.project)
                    return h.redirect('./legal-status')
                }

                return h
                    .view('project', createModel('Only one or two selections are allowed', 'Only one or two selections are allowed'))
                    .takeover()
            }
        }
    }
]
