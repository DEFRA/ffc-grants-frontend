const Joi = require('joi')

function createModel(irrigatedLandCurrent, irrigatedLandTarget, errorMessage) {
    return {
        backLink: '/irrigated-crops',
        currentInput: {
            label: {
                text: 'How much land is currently irrigated per year?',
                isPageHeading: true,
                classes: 'govuk-label--l'
            },
            classes: 'govuk-input--width-4',
            id: 'irrigatedLandCurrent',
            name: 'irrigatedLandCurrent',
            hint: {
                text: 'Enter figure in hectares'
            },
            ...(irrigatedLandCurrent ? { value: irrigatedLandCurrent } : {}),
            ...(errorMessage && !irrigatedLandCurrent ? { errorMessage: { text: errorMessage } } : {})
        },
        targetInput: {
            label: {
                text: 'How much land will be irrigated in total per year under the grant?',
                isPageHeading: true,
                classes: 'govuk-label--l'
            },
            classes: 'govuk-input--width-4',
            id: 'irrigatedLandTarget',
            name: 'irrigatedLandTarget',
            hint: {
                text: 'Enter figure in hectares'
            },
            ...(irrigatedLandTarget ? { value: irrigatedLandTarget } : {}),
            ...(errorMessage && !irrigatedLandTarget ? { errorMessage: { text: errorMessage } } : {})
        }
    }
}

module.exports = [
    {
        method: 'GET',
        path: '/irrigated-land',
        handler: (request, h) => {
            const irrigatedLandCurrent = request.yar.get('irrigatedLandCurrent');
            const irrigatedLandTarget = request.yar.get('irrigatedLandTarget');
            const currentData = !!irrigatedLandCurrent ? irrigatedLandCurrent : null
            const TargetData = !!irrigatedLandTarget ? irrigatedLandTarget : null

            return h.view('irrigated-land', createModel(currentData, TargetData, null))
        }
    },
    {
        method: 'POST',
        path: '/irrigated-land',
        options: {
            validate: {
                payload: Joi.object({
                    irrigatedLandCurrent: Joi.string().required(),
                    irrigatedLandTarget: Joi.string().required()
                }),
                failAction: (request, h) => {
                    const { irrigatedLandCurrent, irrigatedLandTarget } = request.payload
                    return h.view('irrigated-land', createModel(irrigatedLandCurrent, irrigatedLandTarget, 'Enter land irrigated')).takeover()
                }
            },
            handler: (request, h) => {
                request.yar.set('irrigatedLandCurrent', request.payload.irrigatedLandCurrent)
                request.yar.set('irrigatedLandTarget', request.payload.irrigatedLandTarget)
                return h.redirect('./contact-details')
            }
        }
    }
]
