const Joi = require('joi')

function createModel(errorMessage, data) {
    return {
        backLink: '/project',
        radios: {
            classes: '',
            idPrefix: 'mainCrops',
            name: 'mainCrops',
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
                    text: 'Protected cropping (e.g glass house or poly tunnel)',
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
        path: '/main-crops',
        handler: (request, h) => {
            const mainCrops = request.yar.get('mainCrops');
            const data = !!mainCrops ? mainCrops : null
            return h.view('main-crops', createModel(null, data))
        }
    },
    {
        method: 'POST',
        path: '/main-crops',
        options: {
            validate: {
                payload: Joi.object({
                    mainCrops: Joi.string().required()
                }),
                failAction: (request, h) => h.view('main-crops', createModel('Please select an option')).takeover()
            },
            handler: (request, h) => { 
                request.yar.set('mainCrops', request.payload.mainCrops)
                return h.redirect('./legal-status')
            }
        }
    }
]
