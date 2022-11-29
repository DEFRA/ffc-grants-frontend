const questionBank = {
  grantScheme: {
    key: 'WM001',
    name: 'Water Management'
  },
  questions: [
    {
      key: 'farming-type',
      order: 1,
      title: 'What crops are you growing?',
      pageTitle: '',
      url: 'farming-type',
      baseUrl: 'farming-type',
      backUrl: 'start',
      nextUrl: 'legal-status',
      ineligibleContent: {
        messageContent:
          'This grant is only available to:<ul class="govuk-list govuk-list--bullet"><li> arable and horticultural farming businesses that supply the food industry</li><li>nurseries growing ornamentals</li><li>forestry nurseries</li></ul><p class="govuk-body"> <a class="govuk-link" href=\'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments\'>See other grants you may be eligible for.</a></p>'
      },
      fundingPriorities: "",
      type: 'single-answer',
      minAnswerCount: 1,
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: 'This grant is for:',
                items: [
                  "arable and horticultural farming businesses supplying the food industry",
                  "nurseries growing ornamentals",
                  "forestry nurseries"
                ]
              }
            ]
          }
        ]
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select the crops you are growing'
        }
      ],
      answers: [
        { key: "farming-type-A1", value: 'Crops for the food industry' },
        { key: "farming-type-A2", value: 'Horticulture (including ornamentals)' },
        { key: "farming-type-A3", value: 'Something else', notEligible: true }
      ],
      yarKey: 'farmingType'
    },
    {
      key: 'legal-status',
      order: 2,
      title: 'What is the legal status of the business?',
      pageTitle: '',
      url: 'legal-status',
      baseUrl: 'legal-status',
      backUrl: 'farming-type',
      nextUrl: 'country',
      ineligibleContent: {
        messageContent:
          'This is only open to a business with a different legal status.',
        details: {
          summaryText: 'Who is eligible',
          html: '<ul class="govuk-list govuk-list--bullet"><li>Sole trader</li><li>Partnership</li><li>Limited company</li><li>Charity</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Limited partnership</li><li>Industrial and provident society</li><li>Co-operative society (Co-Op)</li><li>Community benefit society (BenCom)</li></ul>'
        },
        messageLink: {
          url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
          title: 'See other grants you may be eligible for.'
        },
        warning: {
          text: 'Other types of business may be supported in future schemes',
          iconFallbackText: 'Warning'
        }
      },
      fundingPriorities: "",
      type: 'single-answer',
      minAnswerCount: 1,
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: 'Public organisations and local authorities cannot apply for this grant.',
                items: []
              }
            ]
          }
        ]
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select the legal status of the farm business'
        }
      ],
      answers: [
        { key: 'legal-status-A1', value: 'Sole Trader' },
        { key: 'legal-status-A2', value: 'Partnership' },
        { key: 'legal-status-A3', value: 'Limited Company' },
        { key: 'legal-status-A4', value: 'Charity' },
        { key: 'legal-status-A5', value: 'Trust' },
        { key: 'legal-status-A6', value: 'Limited liability partnership' },
        { key: 'legal-status-A7', value: 'Community interest company' },
        { key: 'legal-status-A8', value: 'Limited partnership' },
        { key: 'legal-status-A9', value: 'Industrial and provident society' },
        { key: 'legal-status-A10', value: 'Co-operative society (Co-Op)' },
        { key: 'legal-status-A11', value: 'Community benefit society (BenCom)' },
        { key: 'legal-status-A12', value: 'Industrial and provident society' },
        {
          value: 'divider'
        },
        { key: 'legal-status-A13', value: 'None of the above', notEligible: true },
      ],
      yarKey: 'legalStatus'
    },
    {
      key: 'country',
      order: 3,
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      hint: {
        text: 'The location of the project'
      },
      title: 'Is the planned project in England?',
      pageTitle: '',
      url: 'country',
      baseUrl: 'country',
      backUrl: 'legal-status',
      nextUrl: 'planning-permission',
      ineligibleContent: {
        insetText: {
          text: 'Scotland, Wales and Northern Ireland have other grants available.'
        },
        messageContent: 'This grant is only for projects in England.'
      },
      fundingPriorities: "",
      type: 'single-answer',
      minAnswerCount: 1,
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: 'This grant is only for projects in England. Scotland, Wales and Northern Ireland have other grants available.',
                items: []
              }
            ]
          }
        ]
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select your county'
        }
      ],
      answers: [
        { key: 'country-A1', value: 'Yes' },
        { key: 'country-A2', value: 'No', notEligible: true },
      ],
      yarKey: 'inEngland'
    },
    {
      key: 'planning-permission',
      order: 4,
      title: 'Does the project have planning permission?',
      pageTitle: '',
      url: 'planning-permission',
      baseUrl: 'planning-permission',
      backUrl: 'country',
      nextUrl: 'project-start',
      ineligibleContent: {
        messageContent: 'Any planning permission must be in place by 31 January 2023 (the end of the application window).',
        messageLink: {
          url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
          title: 'See other grants you may be eligible for.'
        }
      },
      fundingPriorities: "",
      type: 'single-answer',
      minAnswerCount: 1,
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: `You must have secured planning permission before you submit a full application.
                \n\nAny planning permission must be in place by 31 January 2023.`,
                items: []
              }
            ]
          }
        ]
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select when the project will have planning permission'
        }
      ],
      answers: [
        { key: 'planning-permission-A1', value: 'Not needed' },
        { key: 'planning-permission-A2', value: 'Secured' },
        { key: 'planning-permission-A3', value: 'Should be in place by 31 January 2023' },
        { key: 'planning-permission-A4', value: 'Will not be in place by 31 January 2023' },
      ],
      yarKey: 'planningPermission'
    },
    {
      key: 'project-start',
      order: 5,
      title: 'Have you already started work on the project?',
      pageTitle: '',
      url: 'project-start',
      baseUrl: 'project-start',
      backUrl: 'planning-permission',
      nextUrl: 'tenancy',
      ineligibleContent: {
        messageContent:
          'You cannot apply for a grant if you have already started work on the project.',
        insetText: {
          text: 'Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement invalidates your application.'
        },
        messageLink: {
          url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
          title: 'See other grants you may be eligible for.'
        }
      },
      fundingPriorities: "",
      type: 'single-answer',
      minAnswerCount: 1,
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: `You will invalidate your application if you start the project or commit to any costs (such as placing orders) before you receive a funding agreement.
                      \nBefore you start the project, you can:`,
                items: [
                  "get quotes from suppliers",
                  "apply for planning permission or an abstraction licence (these can take a long time)"
                ]
              }
            ]
          }
        ]
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select whether you have started work on the project'
        }
      ],
      answers: [
        {
          key: 'project-start-A1',
          value: 'Yes, preparatory work',
          hint: {
            text: 'For example, quotes from suppliers, applying for planning permission'
          }
        },
        {
          key: 'project-start-A2',
          value: 'Yes, we have begun project work',
          hint: {
            text: 'For example, digging, signing contracts, placing orders'
          },
          notEligible: true
        },
        {
          key: 'project-start-A3',
          value: 'No, we have not started work on the project'
        }
      ],
      yarKey: 'projectStarted'
    },
    {
      key: 'tenancy',
      order: 6,
      title: 'Is the planned project on land the farm business owns?',
      hint: {
        text: 'The location of the project'
      },
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      pageTitle: '',
      url: 'tenancy',
      baseUrl: 'tenancy',
      backUrl: 'project-start',
      nextUrl: 'project-items',
      fundingPriorities: "",
      type: 'single-answer',
      minAnswerCount: 1,
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: `You must own the land or have a tenancy in place for 5 years after the final grant payment.`,
                items: []
              }
            ]
          }
        ]
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select yes if the land will have a tenancy agreement in place for 5 years after the final grant payment',
        }
      ],
      answers: [
        {
          key: 'tenancy-A1',
          value: 'Yes',
          redirectUrl: 'tenancy-length'
        },
        {
          key: 'tenancy-A2',
          value: 'No',
          redirectUrl: 'project-items'
        }
      ],
      yarKey: 'tenancy'
    },
    {
      key: 'project-items',
      order: 7,
      title: 'Which eligible items do you need for your project?',
      hint: {
        text: 'Select all that items your project needs'
      },
      pageTitle: '',
      url: 'project-items',
      baseUrl: 'project-items',
      backUrl: 'tenancy',
      nextUrl: 'project-costs',
      fundingPriorities: "",
      type: 'multi-answer',
      minAnswerCount: 1,
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select all the items your project needs'
        }
      ],
      answers: [
        {
          type: 'sub-heading',
          text: 'Reservoir construction and infrastructure'
        },
        {
          key: 'project-items-A1',
          text: 'Construction of reservoir walls'
        },
        {
          key: 'project-items-A2',
          text: 'Overflow/spillway'
        },
        {
          key: 'project-items-A3',
          text: 'Synthetic liner'
        },
        {
          key: 'project-items-A4',
          text: 'Abstraction point including pump'
        },
        {
          key: 'project-items-A5',
          text: 'Fencing for synthetically lined reservoir'
        },
        {
          key: 'project-items-A6',
          text: 'Filtration equipment'
        },
        {
          key: 'project-items-A7',
          text: 'Irrigation pumps and controls'
        },
        {
          key: 'project-items-A8',
          text: 'Pipework to fill the reservoir'
        },
        {
          key: 'project-items-A9',
          text: 'Pumphouse'
        },
        {
          key: 'project-items-A10',
          text: 'Underground water distribution main and hydrants'
        },
        {
          key: 'project-items-A11',
          text: 'Electricity installation for pumphouse'
        },
        {
          key: 'project-items-A12',
          text: 'Water meter'
        },
        {
          type: 'sub-heading',
          text: 'Irrigation equipment'
        },
        {
          key: 'project-items-A13',
          text: 'Boom'
        },
        {
          key: 'project-items-A14',
          text: 'Trickle'
        },
        {
          key: 'project-items-A15',
          text: 'Ebb and flow'
        },
        {
          key: 'project-items-A16',
          text: 'Capillary bed'
        },
        {
          key: 'project-items-A17',
          text: 'Sprinkler'
        },
        {
          key: 'project-items-A18',
          text: 'Mist'
        },
        {
          type: 'sub-heading',
          text: 'Technology'
        },
        {
          key: 'project-items-A19',
          text: 'Equipment to monitor soil moisture levels and schedule irrigation'
        },
        {
          key: 'project-items-A20',
          text: 'Equipment to control and optimise water application'
        }
      ],
      yarKey: 'projectItemsList'
    },
    {
      key: 'project-cost',
      order: 8,
      title: 'What is the estimated cost of the items?',
      pageTitle: '',
      url: 'project-cost',
      baseUrl: 'project-cost',
      backUrl: 'project-items',
      nextUrl: 'potential-amount',
      fundingPriorities: "",
      type: 'single-answer',
      minAnswerCount: 1,
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select yes if the land will have a tenancy agreement in place for 5 years after the final grant payment.'
        }
      ],
      answers: [
        {
          key: 'project-cost-A1',
          value: 'Yes',
        },
        {
          key: 'project-cost-A2',
          value: 'No',
        }
      ],
      yarKey: 'projectCost'
    },
  ]
}

const ALL_QUESTIONS = []

questionBank.questions.forEach((question) => {
  ALL_QUESTIONS.push(question)
})
const ALL_URLS = []
ALL_QUESTIONS.forEach(item => ALL_URLS.push(item.url))

const YAR_KEYS = []
ALL_QUESTIONS.forEach(item => YAR_KEYS.push(item.yarKey))

module.exports = {
  questionBank,
  ALL_QUESTIONS,
  ALL_URLS,
  YAR_KEYS
};
