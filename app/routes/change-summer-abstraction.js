const Joi = require('joi')
const { findErrorList, setLabelData } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')
const { guardPage } = require('../helpers/page-guard')
const { startPageUrl } = require('../config/server')

const viewTemplate = 'change-summer-abstraction'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/water-source`
const nextPath = `${urlPrefix}/irrigation-system`
const scorePath = `${urlPrefix}/score`

function createModel(pageType, decreaseSummerAbstract, decreaseMains, errorList, hasScore) {
    let pageTitle

    // update options accordingly, based on page swap requirements

    switch (pageType) {
        case 'summerOnly': 
            pageTitle = 'How will your use of summer abstraction change?'
        case 'mainsOnly': 
            pagetitle = 'How will your use of mains change?'
        default:
            pageTitle = 'How will your use of summer abstraction and mains change?'
    }

    console.log('page loading, njk issue')
    
    return {
        backLink: hasScore ? `${urlPrefix}/water-source` : previousPath,
        formActionPage: currentPath,
        hasScore: hasScore,
        ...errorList ? { errorList } : {},
        pageTitle: pageTitle,
        pageType: pageType,
        summerOnly: pageType === 'summerOnly',
        mainsOnly: pageType === 'mainsOnly',
        hiddenInputSummer: {
            id: 'decreaseSummerAbstract',
            name: 'decreaseSummerAbstract',
            value: 'Not summer abstraction',
            type: 'hidden'
        },
        hiddenInputMains: {
            id: 'decreaseMains',
            name: 'decreaseMains',
            value: 'Not mains',
            type: 'hidden',
        },
        summerInput: {
            idPrefix: 'decreaseSummerAbstract',
            name: 'decreaseSummerAbstract',
            fieldset: {
                legend: {
                    html: pageType === 'SummerOnly' ? '' : '<h2 class="govuk-heading-m">Summer water surface abstraction</h2>'
                }
            },
            items: setLabelData(decreaseSummerAbstract, ['Decrease', 'No change']),
            ...(errorList && errorList[0].href === '#decreaseSummerAbstract' ? { errorMessage: { text: errorList[0].text } } : {})
        },
        mainsInput: {
            idPrefix: 'decreaseMains',
            name: 'decreaseMains',
            fieldset: {
                legend: {
                    html: pageType === 'mainsOnly' ? '' : '<h2 class="govuk-heading-m">Mains</h2>'
                }
            },
            items: setLabelData(decreaseMains, ['Decrease', 'No change']),
            ...(errorList && errorList[errorList.length - 1].href === '#decreaseMains' ? { errorMessage: { text: errorList[errorList.length - 1].text } } : {})
        }
    }
}

module.exports = [
    {
        method: 'GET',
        path: currentPath,
        handler: (request, h) => {
            // make water source planned?
            // const isRedirect = guardPage(request, ['currentlyIrrigating'],)
            // if (isRedirect) {
            //     return h.redirect(startPageUrl)
            // }

            const decreaseSummerAbstract = getYarValue(request, 'decreaseSummerAbstract')
            const decreaseMains = getYarValue(request, 'decreaseMains')
            
            const summerData = decreaseSummerAbstract || null
            const mainsData = decreaseMains || null

            // temp var for development, will replace with page switching from water source
            const pageType = ''

            return h.view(viewTemplate, createModel(pageType, summerData, mainsData, null, getYarValue(request, 'current-score')))
        }
    },
    {
        method: 'POST',
        path: currentPath,
        options: {
            validate: {
                options: { abortEarly: false },
                payload: Joi.object({
                    decreaseSummerAbstract: Joi.any(),
                    decreaseMains: Joi.any(),
                    results: Joi.any()
                }),
                failAction: (request, h, err) => {
                    gapiService.sendValidationDimension(request)
                    let { decreaseSummerAbstract, decreaseMains } = request.payload
                    const errorList = []
                    let [
                        decreaseSummerAbstractError, decreaseMainsError
                    ] = findErrorList(err, ['decreaseSummerAbstract', 'decreaseMains'])

                    if (decreaseSummerAbstractError) {
                        errorList.push({
                            text: decreaseSummerAbstractError,
                            href: '#decreaseSummerAbstract'
                        })
                    }

                    if (decreaseMainsError) {
                        errorList.push({
                            text: decreaseMainsError,
                            href: '#decreaseMains'
                        })
                    }

                    decreaseSummerAbstract = decreaseSummerAbstract ? [decreaseSummerAbstract].flat() : decreaseSummerAbstract
                    decreaseMains = decreaseMains ? [decreaseMains].flat() : decreaseMains

                    // const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating')

                    // will be getYarValue from water source?
                    let pageType = ''

                    return h.view(viewTemplate, createModel(pageType, decreaseSummerAbstract, decreaseMains, errorList, getYarValue(request, 'current-score'))).takeover()
                }
            },
            handler: (request, h) => {
                let { decreaseSummerAbstract, decreaseMains, results } = request.payload
                // const hasScore = getYarValue(request, 'current-score')
                // const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating')

                decreaseSummerAbstract = [decreaseSummerAbstract].flat()
                decreaseMains = [decreaseMains].flat()

                setYarValue(request, 'decreaseSummerAbstract', decreaseSummerAbstract)
                setYarValue(request, 'decreaseMains', decreaseMains)

                return results ? h.redirect(scorePath) : h.redirect(nextPath)
            }
        }
    }
]
