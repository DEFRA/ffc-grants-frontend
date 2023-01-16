const noMainsA1 = {
    key: 'water-source',
    order: 17,
    title: 'Water Source',
    pageTitle: '',
    url: 'water-source',
    baseUrl: 'water-source',
    backUrl: 'mains',
    nextUrl: 'irrigation-systems',
    type: 'multi-input',

    allFields: [
        {
            type: 'sub-heading',
            text: 'What is your main water source?'
           
        },
        {
            yarKey: 'mainWaterSource',
            type: 'multi-answer',
            hint: {
                text: 'Select up to 2 options'
            },
            validate: [
                {
                    type: 'NOT_EMPTY',
                    error: 'Select the options that apply to you'
                },
                {
                    type: 'MAX_SELECT',
                    error: 'Select the options that apply to you',
                    max: 2
                }
                
            ],
            answers: [
                {
                    key: 'main-water-source-A1',
                    value: 'Winter peak-flow abstraction'
                },
                {
                    key: 'main-water-source-A2',
                    value: 'Rain water harvesting'
                },
                {
                    key: 'main-water-source-A3',
                    value: 'Bore hole/aquifier'
                }
            ]
        },
        {
            type: 'sub-heading',
            text: 'What will be the new water source?'
            
        },
        {
            yarKey: 'newWaterSource',
            type: 'multi-answer',
            hint: {
                text: 'Select all that apply'
            },
            validate: [
                {
                    type: 'NOT_EMPTY',
                    error: 'Select the options that apply to you'
                }

            ],
            answers: [
                {
                    key: 'new-water-source-A1',
                    value: 'Winter peak-flow abstraction'
                },
                {
                    key: 'new-water-source-A2',
                    value: 'Rain water harvesting'
                },
                {
                    key: 'new-water-source-A3',
                    value: 'Bore hole/aquifier'
                }
            ]
        },

    ],
    sidebar: {
        values: [
            {
                heading: 'Funding Priorities',
                content: [
                    {
                        para: 'RPA wants to fund projects that use more sustainable water sources, such as:',
                        items: ['winter peak-flow abstraction', 'rain water harvesting', 'bore hole/aquifer']
                    },
                    {
                        para: 'RPA will not fund projects that increase water usage from:',
                        items: ['summer water surface abstraction', 'mains']

                    }
                ]
            }
        ]
    },
    yarKey: 'waterSource'
}

const noMainsA2 = {
    key: 'water-source',
    order: 17,
    title: 'Water Source',
    pageTitle: '',
    url: 'water-source',
    baseUrl: 'water-source',
    backUrl: 'mains',
    nextUrl: 'irrigation-systems',
    type: 'multi-input',

    allFields: [
        {
            type: 'sub-heading',
            text: 'What is your main water source?'

        },
        {
            yarKey: 'mainWaterSource',
            type: 'multi-answer',
            hint: {
                text: 'Select up to 2 options'
            },
            validate: [
                {
                    type: 'NOT_EMPTY',
                    error: 'Select the options that apply to you'
                },
                {
                    type: 'MAX_SELECT',
                    error: 'Select the options that apply to you',
                    max: 2
                }

            ],
            answers: [
                {
                    key: 'main-water-source-A1',
                    value: 'Summer abstraction'
                },
                {
                    key: 'main-water-source-A2',
                    value: 'Mains'
                },
                {
                    key: 'main-water-source-A3',
                    value: 'Winter peak-flow abstraction'
                },
                {
                    key: 'main-water-source-A4',
                    value: 'Rain water harvesting'
                },
                {
                    key: 'main-water-source-A5',
                    value: 'Bore hole/aquifer'
                }
            ]
        },
        {
            type: 'sub-heading',
            text: 'What will be the new water source?'

        },
        {
            yarKey: 'newWaterSource',
            type: 'multi-answer',
            hint: {
                text: 'Select all that apply'
            },
            validate: [
                {
                    type: 'NOT_EMPTY',
                    error: 'Select the options that apply to you'
                }

            ],
            answers: [
                {
                    key: 'new-water-source-A1',
                    value: 'Summer abstraction'
                },
                {
                    key: 'new-water-source-A2',
                    value: 'Mains'
                },
                {
                    key: 'new-water-source-A3',
                    value: 'Winter peak-flow abstraction'
                },
                {
                    key: 'new-water-source-A4',
                    value: 'Rain water harvesting'
                },
                {
                    key: 'new-water-source-A5',
                    value: 'Bore hole/aquifer'
                }
            ]
        },

    ],
    sidebar: {
        values: [
            {
                heading: 'Funding Priorities',
                content: [
                    {
                        para: 'RPA wants to fund projects that use more sustainable water sources, such as:',
                        items: ['winter peak-flow abstraction', 'rain water harvesting', 'bore hole/aquifer']
                    },
                    {
                        para: 'RPA will not fund projects that increase water usage from:',
                        items: ['summer water surface abstraction', 'mains']

                    }
                ]
            }
        ]
    },
    yarKey: 'waterSource'
}


module.exports = {
    noMainsA1,
    noMainsA2
}
