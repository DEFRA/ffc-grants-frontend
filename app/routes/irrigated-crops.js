const Joi = require('joi')

function createModel(errorMessage, data) {
    return {
        backLink: '/project-details',
        radios: {
            classes: '',
            idPrefix: 'irrigatedCrops',
            name: 'irrigatedCrops',
            fieldset: {
                legend: {
                    text: 'What main crops will be irrigated?',
                    isPageHeading: true,
                    classes: 'govuk-fieldset__legend--l'
                }
            },
            items: [

                {
                    value: 'Field-scale crops',
                    text: 'Field-scale crops (e.g potatoes, onions, carrots)',
                    checked: !!data && (data.includes('Field-scale crops'))
                },
                {
                    value: 'Protected cropping',
                    text: 'Protected cropping (e.g glass house or polly tunnel)',
                    checked: !!data && (data.includes('Protected cropping'))
                },
                {
                    value: 'Fruit',
                    text: 'Fruit (e.g top fruit, bush fruit)',
                    checked: !!data && (data.includes('Fruit'))
                }
            ],
            ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
        }
    }
}

module.exports = [
    {
        method: 'GET',
        path: '/irrigated-crops',
        handler: (request, h) => {
            const irrigatedCrops = request.yar.get('irrigatedCrops');
            const data = !!irrigatedCrops ? irrigatedCrops : null
            return h.view('irrigated-crops', createModel(null, data))
        }
    },
    {
        method: 'POST',
        path: '/irrigated-crops',
        options: {
            validate: {
                payload: Joi.object({
                    irrigatedCrops: Joi.string().required()
                }),
                failAction: (request, h) => h.view('irrigated-crops', createModel('Please select an option')).takeover()
            },
            handler: (request, h) => { 
                request.yar.set('irrigatedCrops', request.payload.irrigatedCrops)
                return h.redirect('./irrigated-land')
            }
        }
    }
]
