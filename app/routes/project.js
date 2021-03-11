const Joi = require('joi')
let { setLabelData } = require('../helpers/helper-functions')

function createModel(errorMessage, errorSummary, data) {
    return {
        backLink: '/legal-status',
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
            items: setLabelData(data, ["Change water source", "Improve irrigation efficiency", "Increase irrigation", "Introduce irrigation"]),
            ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
        }
    }
}

module.exports = [
    {
        method: 'GET',
        path: '/project-details',
        handler: (request, h) => {
            const project = request.yar.get('project');
            const data = !!project ?
                project : null

            return h.view('project', createModel(null, null, data))
        }
    },
    {
        method: 'POST',
        path: '/project-details',
        options: {
            validate: {
                payload: Joi.object({
                    project: Joi.any().required()
                }),
                failAction: (request, h) =>
                    h
                        .view('project', createModel('Please select an option', null, null))
                        .takeover()
            },
            handler: (request, h) => {

                if (Array.isArray(request.payload.project) && request.payload.project.length > 2) {
                    return h
                        .view(
                            'project',
                            createModel(
                                'Only one or two selections are allowed',
                                'Only one or two selections are allowed',
                                null
                            ))
                        .takeover()
                }

                request.yar.set('project', request.payload.project)
                return h.redirect('./irrigated-crops')

            }
        }
    }
]
