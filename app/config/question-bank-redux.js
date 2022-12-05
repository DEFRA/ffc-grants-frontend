const { MIN_GRANT, MAX_GRANT, GRANT_PERCENTAGE } = require('../helpers/grant-details')
const { PROJECT_COST_REGEX } = require('../helpers/regex-validation')
const { LICENSE_NOT_NEEDED, LICENSE_SECURED, LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE } = require('../helpers/license-dates')


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
          redirectUrl: 'project-items'
        },
        {
          key: 'tenancy-A2',
          value: 'No',
          redirectUrl: 'tenancy-length'
        }
      ],
      yarKey: 'landOwnership'
    },
    {
      key: 'tenancy-length',
      order: 7,
      title: 'Do you a tenancy agreement for 5 years after the final grant payment?',
      hint: {
        text: 'The location of the project'
      },
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      pageTitle: '',
      url: 'tenancy-length',
      baseUrl: 'tenancy-length',
      backUrl: 'tenancy',
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
          error: 'Select yes if the land will have a tenancy agreement in place for 5 years after the final grant payment.',
        }
      ],
      answers: [
        {
          key: 'tenancy-length-A1',
          value: 'Yes',
          redirectUrl: 'project-items'
        },
        {
          key: 'tenancy-length-A2',
          value: 'No',
          notEligible: true,
          alsoMaybeEligible: {
            maybeEligibleContent: {
              messageHeader: 'You may be able to apply for a grant from this scheme',
              messageContent: 'You will need to extend your tenancy agreement before you can complete a full application.'
            },
          }
        }
      ],
      yarKey: 'tenancyLength'
    },
    // Goes to the project items page
    {
      key: 'project-cost',
      order: 8,
      title: 'What is the estimated cost of the items?',
      pageTitle: '',
      classes: 'govuk-input-width-10', // TODO: input width is not applied
      url: 'project-cost',
      baseUrl: 'project-cost',
      backUrl: 'project-items',
      nextUrl: 'potential-amount',
      fundingPriorities: "",
      type: 'input',
      prefix: {
        text: '£'
      },
      label: {
        text: 'What is the estimated cost of the items?',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        html:
          `
          <p>You can only apply for a grant of up to 40% of the estimated costs. The minimum grant you can apply for this project is £35,000 (40% of £87,500). The maximum grant is £500,000.<p/>
          <p>Do not include VAT.<p/>
          <p>Enter amount, for example 95,000<p/>
          `
      },
      grantInfo: {
        minGrant: MIN_GRANT,
        maxGrant: MAX_GRANT,
        grantPercentage: GRANT_PERCENTAGE,
        cappedGrant: true,
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Enter the estimated cost for the items',
        },
        {
          type: 'REGEX',
          regex: PROJECT_COST_REGEX,
          error: 'Enter a whole number with a maximum of 7 digits'
        },
        {
          type: 'MIN_MAX',
          min: 1,
          max: MAX_GRANT,
          error: 'Enter a whole number with a maximum of 7 digits'
        }
      ],
      ineligibleContent: {
        messageContent: 'You can only apply for a grant of up to 40% of the estimated costs. ',
        insetText:
          { text: 'The minimum grant you can apply for is £35,000 (40% of £87,500). The maximum grant is £500,000.' },
        messageLink: {
          url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
          title: 'See other grants you may be eligible for.'
        }
      },
      sidebar: {
        values: [
          {
            heading: 'Items selected',
            content: [ {
              para: '',
              items: []
            } ]
          } ],
        dependentQuestionKey: 'projectItemsList'
      },
      answers: [],
      yarKey: 'projectCost'
    },
    {
      key: 'potential-amount',
      title: 'Potential grant funding',
      order: 9,
      url: 'potential-amount',
      baseUrl: 'potential-amount',
      backUrl: 'project-cost',
      preValidationKeys: [],
      nextUrl: 'remaining-costs',
      maybeEligible: true,
      maybeEligibleContent: {
        messageHeader: 'You may be able to apply for a grant from this scheme',
        messageContent: `You may be able to apply for a grant of up to £{{_calculatedGrant_}},
        based on the estimated cost of £{{_projectCost_}}.`
      },
      sidebar: {
        values: [
          {
            heading: 'Items selected',
            content: [ {
              para: '',
              items: []
            } ]
          } ],
        dependentQuestionKey: 'projectItemsList'
      },
      yarKey: 'potentialAmount'
    },
    {
      key: 'remaining-costs',
      order: 10,
      title: `Can you pay the remaining costs of £${formattedRemainingCost}?`,
      pageTitle: '',
      url: 'remaining-costs',
      baseUrl: 'remaining-costs',
      backUrl: 'potential-amount',
      nextUrl: 'SSSI',
      fundingPriorities: "",
      type: 'single-answer',
      minAnswerCount: 1,
      ineligibleContent: {
        messageContent:
          `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.
            <div class="govuk-inset-text">
              You can use:
              <ul class="govuk-list govuk-list--bullet">
                <li>loans</li>
                <li>overdrafts</li>
                <li>the Basic Payment Scheme</li>
                <li>agri-environment schemes such as the Countryside Stewardship Scheme</li>
              </ul>
            </div>
            `,
        messageLink: {
          url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
          title: 'See other grants you may be eligible for.'
        }
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select yes if you can pay the remaining costs without using any other grant money',
        }
      ],
      answers: [
        {
          key: 'remaining-costs-A1',
          value: 'Yes',
          redirectUrl: 'SSSI'
        },
        {
          key: 'remaining-costs-A2',
          value: 'No',
          notEligible: true,
        }
      ],
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: `You cannot use public money (for example grant funding from government or local authorities) towards the project costs.\n\n
                          You can use:`,
                items: [
                  "loans",
                  "overdrafts",
                  "the Basic Payment Scheme",
                  "agri-environment schemes such as the Countryside Stewardship Scheme"
                ],
              }
            ]
          },
        ],
      },
      yarKey: 'payRemainingCosts'
    },
    {
      key: 'SSSI',
      order: 11,
      title: 'Does the project directly impact a Site of Special Scientific Interest?',
      classes: 'govuk-radios--inline',
      pageTitle: '',
      url: 'SSSI',
      baseUrl: 'SSSI',
      backUrl: 'remaining-costs',
      nextUrl: 'abstraction-licence',
      fundingPriorities: "",
      type: 'single-answer',
      minAnswerCount: 1,
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select yes if the project directly impacts a Site of Special Scientific Interest',
        }
      ],
      answers: [
        {
          key: 'SSSI-A1',
          value: 'Yes',
          redirectUrl: 'abstraction-licence'
        },
        {
          key: 'SSSI-A2',
          value: 'No',
          redirectUrl: 'abstraction-licence'
        }
      ],
      yarKey: 'sSSI'
    },
    {
      key: 'abstraction-licence',
      order: 12,
      title: 'Does the project need an abstraction licence or a variation of one?',
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      pageTitle: '',
      url: 'abstraction-licence',
      baseUrl: 'abstraction-licence',
      backUrl: 'SSSI',
      nextUrl: 'project-summary',
      fundingPriorities: "",
      type: 'single-answer',
      minAnswerCount: 1,
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select when the project will have an abstraction licence or variation',
        }
      ],
      answers: [
        {
          key: 'abstraction-licence-A1',
          value: LICENSE_NOT_NEEDED,
          redirectUrl: 'project-summary'
        },
        {
          key: 'abstraction-licence-A2',
          value: LICENSE_SECURED,
          redirectUrl: 'project-summary'
        },
        {
          key: 'abstraction-licence-A3',
          value: LICENSE_EXPECTED,
          redirectUrl: 'abstraction-required-condition'
        },
        {
          key: 'abstraction-licence-A4',
          value: LICENSE_WILL_NOT_HAVE,
          redirectUrl: 'abstraction-required-condition'
        }
      ],
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: `You must have secured abstraction licences or variations before you submit a full application.\n
                              Any abstraction licences or variations must be in place by 31 January 2023.`,
                items: [],
              }
            ]
          },
        ],
      },
      yarKey: 'abstractionLicence',
    },
    {
      key: 'project-summary',
      order: 13,
      title: 'What impact will the project have?',
      hint: {
        text: 'Select up to 2 options'
      },
      pageTitle: '',
      url: 'project-summary',
      baseUrl: 'project-summary',
      backUrl: 'abstraction-licence',
      nextUrl: 'irrigated-crops',
      fundingPriorities: "",
      type: 'multiple-answer',
      minAnswerCount: 2,
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select up to 2 options to describe your project’s impact'
        },
        {
          type: 'STANDALONE_ANSWER',
          error: 'If you select \'None of the above\', you cannot select another option',
          standaloneObject: {
            questionKey: 'project-summary',
            answerKey: 'project-summary-A5'
          }
        }
      ],
      answers: [
        {
          key: 'project-summary-A1',
          value: 'Change water source',
          redirectUrl: 'irrigated-crops'
        },
        {
          key: 'project-summary-A2',
          value: 'Improve irrigation efficiency',
          redirectUrl: 'irrigated-crops'
        },
        {
          key: 'project-summary-A3',
          value: 'Increase irrigation',
          redirectUrl: 'irrigated-crops'
        },
        {
          key: 'project-summary-A4',
          value: 'Introduce irrigation',
          redirectUrl: 'irrigated-crops'
        },
        {
          value: 'divider'
        },
        {
          key: 'project-summary-A5',
          value: 'None of the above',
          redirectUrl: 'irrigated-crops'
        },

      ],
      yarKey: 'project',
    },
    // {
    //   key: 'irrigated-crops',
    //   order: 14,
    //   title: 'What main crops will be irrigated?',
    //   pageTitle: 'Main crop',
    //   url: 'irrigated-crops',
    //   baseUrl: 'irrigated-crops',
    //   backUrl: 'project-summary',


    // }
  ]
};

const ALL_QUESTIONS = []

questionBank.questions.forEach((question) => {
  ALL_QUESTIONS.push(question)
})
const ALL_URLS = []
ALL_QUESTIONS.forEach(item => ALL_URLS.push(item.url))

const YAR_KEYS = [ 'calculatedGrant', 'remainingCost', 'projectItemsList' ]
ALL_QUESTIONS.forEach(item => YAR_KEYS.push(item.yarKey))

module.exports = {
  questionBank,
  ALL_QUESTIONS,
  ALL_URLS,
  YAR_KEYS
};
