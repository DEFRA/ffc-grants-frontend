const {
  MIN_GRANT,
  MAX_GRANT,
  GRANT_PERCENTAGE,
  NAME_ONLY_REGEX
} = require('../helpers/grant-details')
const {
  PROJECT_COST_REGEX,
  NUMBER_REGEX,
  SBI_REGEX,
  BUSINESSNAME_REGEX,
  NAME_REGEX,
  EMAIL_REGEX,
  POSTCODE_REGEX,
  ONLY_TEXT_REGEX,
  CHARS_MIN_10,
  PHONE_REGEX,
  ADDRESS_REGEX
} = require('../helpers/regex-validation')
const {
  LICENSE_NOT_NEEDED,
  LICENSE_SECURED,
  LICENSE_EXPECTED,
  LICENSE_WILL_NOT_HAVE
} = require('../helpers/license-dates')

const { LIST_COUNTIES } = require('../helpers/all-counties')

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
          'This grant is only available to:<ul class=\'govuk-list govuk-list--bullet\'><li> arable and horticultural farming businesses that supply the food industry</li><li>nurseries growing ornamentals</li><li>forestry nurseries</li></ul><p class=\'govuk-body\'> <a class=\'govuk-link\' href=\'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments\'>See other grants you may be eligible for.</a></p>'
      },
      fundingPriorities: '',
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
                  'arable and horticultural farming businesses supplying the food industry',
                  'nurseries growing ornamentals',
                  'forestry nurseries'
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
        { key: 'farming-type-A1', value: 'Crops for the food industry' },
        {
          key: 'farming-type-A2',
          value: 'Horticulture (including ornamentals)'
        },
        { key: 'farming-type-A3', value: 'Something else', notEligible: true }
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
      preValidationKeys: ['farmingType'],
      ineligibleContent: {
        messageContent:
          'This is only open to a business with a different legal status.',
        details: {
          summaryText: 'Who is eligible',
          html: "<ul class='govuk-list govuk-list--bullet'><li>Sole trader</li><li>Partnership</li><li>Limited company</li><li>Charity</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Limited partnership</li><li>Industrial and provident society</li><li>Co-operative society (Co-Op)</li><li>Community benefit society (BenCom)</li></ul>"
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
      fundingPriorities: '',
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
          error: 'Select the legal status of the business'
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
        {
          key: 'legal-status-A11',
          value: 'Community benefit society (BenCom)'
        },
        {
          value: 'divider'
        },
        {
          key: 'legal-status-A13',
          value: 'None of the above',
          notEligible: true
        }
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
      preValidationKeys: ['legalStatus'],
      ineligibleContent: {
        messageContent:
          'This grant is only for projects in England.<br/>Scotland, Wales and Northern Ireland have other grants available.'
      },
      fundingPriorities: '',
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
          error: 'Select yes if the project is in England'
        }
      ],
      answers: [
        { key: 'country-A1', value: 'Yes' },
        { key: 'country-A2', value: 'No', notEligible: true }
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
      preValidationKeys: ['inEngland'],
      ineligibleContent: {
        messageContent:
          'You must have secured planning permission before you submit a full application.',
        messageLink: {
          url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
          title: 'See other grants you may be eligible for.'
        }
      },
      fundingPriorities: '',
      type: 'single-answer',
      minAnswerCount: 1,
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: `You must have secured planning permission before you submit a full application.
                \n\nAny planning permission must be in place by 31 October 2024.`,
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
        {
          key: 'planning-permission-A3',
          value: 'Should be in place by 31 October 2024',
          redirectUrl: 'planning-permission-condition'
        },
        {
          key: 'planning-permission-A4',
          value: 'Will not be in place by 31 October 2024',
          notEligible: true
        }
      ],
      yarKey: 'planningPermission'
    },
    {
      key: 'planning-permission-condition',
      order: 4.1,
      url: 'planning-permission-condition',
      backUrl: 'planning-permission',
      nextUrl: 'project-start',
      maybeEligible: true,
      preValidationKeys: ['planningPermission'],
      maybeEligibleContent: {
        messageHeader: 'You may be able to apply for a grant from this scheme',
        messageContent:
          'You must have secured planning permission before you submit a full application.'
      },
      yarKey: 'PlanningPermissionCondition'
    },
    {
      key: 'project-start',
      order: 5,
      title: 'Have you already started work on the project?',
      pageTitle: '',
      url: 'project-start',
      baseUrl: 'project-start',
      backUrl: 'planning-permission',
      preValidationKeys: ['planningPermission'],
      backUrlObject: {
        dependentQuestionYarKey: 'planningPermission',
        dependentAnswerKeysArray: [
          'planning-permission-A1',
          'planning-permission-A2'
        ],
        urlOptions: {
          thenUrl: 'planning-permission',
          elseUrl: 'planning-permission-condition'
        }
      },
      nextUrl: 'tenancy',
      ineligibleContent: {
        messageHeader: 'You cannot apply for a grant from this scheme',
        messageContent:
          'You cannot apply for a grant if you have already started work on the project.',
        insertText: {
          text: 'Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement invalidates your application.'
        },
        messageLink: {
          url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
          title: 'See other grants you may be eligible for.'
        }
      },
      fundingPriorities: '',
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
                  'get quotes from suppliers',
                  'apply for planning permission or an abstraction licence (these can take a long time)'
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
          value: 'No, we have not done any work on this project yet'
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
      fundingPriorities: '',
      type: 'single-answer',
      preValidationKeys: ['projectStarted'],
      minAnswerCount: 1,
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: 'You must own the land or have a tenancy in place for 5 years after the final grant payment.',
                items: []
              }
            ]
          }
        ]
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error:
            'Select yes if the planned project is on land the business owns'
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
      title:
        'Do you have a tenancy agreement for 5 years after the final grant payment?',
      hint: {
        text: 'The location of the project'
      },
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      pageTitle: '',
      url: 'tenancy-length',
      baseUrl: 'tenancy-length',
      backUrl: 'tenancy',
      nextUrl: 'project-items',
      fundingPriorities: '',
      type: 'single-answer',
      preValidationKeys: ['landOwnership'],
      minAnswerCount: 1,
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: 'You must own the land or have a tenancy in place for 5 years after the final grant payment.',
                items: []
              }
            ]
          }
        ]
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error:
            'Select yes if the land will have a tenancy agreement in place for 5 years after the final grant payment.'
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
              messageHeader:
                'You may be able to apply for a grant from this scheme',
              messageContent:
                'You will need to extend your tenancy agreement for 5 years after the final grant payment.'
            }
          }
        }
      ],
      yarKey: 'tenancyLength'
    },
    // Goes to the project items page
    {
      key: 'project-cost',
      order: 8,
      title: 'What is the total estimated cost of the items?',
      pageTitle: '',
      classes: 'govuk-input--width-10',
      url: 'project-cost',
      baseUrl: 'project-cost',
      backUrl: 'project-items',
      nextUrl: 'potential-amount',
      fundingPriorities: '',
      preValidationKeys: ['landOwnership'],
      type: 'input',
      prefix: {
        text: '£'
      },
      label: {
        text: 'What is the total estimated cost of the items?',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        html: `
          <p>You can only apply for a grant of up to 40% of the estimated costs. The minimum grant you can apply for this project is £35,000 (40% of £87,500). The maximum grant is £500,000.<p/>
          <p>Do not include VAT.<p/>
          <p>Enter amount, for example 95,000<p/>
          `
      },
      grantInfo: {
        minGrant: MIN_GRANT,
        maxGrant: MAX_GRANT,
        grantPercentage: GRANT_PERCENTAGE,
        cappedGrant: true
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Enter the estimated cost for the items'
        },
        {
          type: 'REGEX',
          regex: PROJECT_COST_REGEX,
          error: 'Enter a whole number with a maximum of 7 digits'
        },
        {
          type: 'MIN_MAX_CHARS',
          min: 1,
          max: 7,
          error: 'Enter a whole number with a maximum of 7 digits'
        }
      ],
      ineligibleContent: {
        messageContent:
          'You can only apply for a grant of up to 40% of the estimated costs. ',
        insertText: {
          text: 'The minimum grant you can apply for is £35,000 (40% of £87,500). The maximum grant is £500,000.'
        },
        messageLink: {
          url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
          title: 'See other grants you may be eligible for.'
        }
      },
      sidebar: {
        values: [
          {
            heading: 'Items selected',
            content: [
              {
                para: '',
                items: []
              }
            ]
          }
        ],
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
      nextUrl: 'remaining-costs',
      preValidationKeys: ['projectCost', 'calculatedGrant'],
      maybeEligible: true,
      maybeEligibleContent: {
        messageHeader: 'Potential grant funding',
        messageContent: `You may be able to apply for a grant of up to £{{_calculatedGrant_}},
        based on the estimated cost of £{{_projectCost_}}.`,
        warning: {
          text: 'There’s no guarantee the project will receive a grant.',
          iconFallbackText: 'Warning'
        }
      },
      yarKey: 'potentialAmount'
    },
    {
      key: 'remaining-costs',
      order: 10,
      title: 'Can you pay the remaining costs of £{{_remainingCost_}}?',
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      pageTitle: '',
      url: 'remaining-costs',
      baseUrl: 'remaining-costs',
      backUrl: 'potential-amount',
      nextUrl: 'abstraction-licence',
      preValidationKeys: ['projectCost', 'remainingCost'],
      fundingPriorities: '',
      type: 'single-answer',
      minAnswerCount: 1,
      ineligibleContent: {
        messageContent: `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.
            <div class='govuk-inset-text'>
              You can use:
              <ul class='govuk-list govuk-list--bullet'>
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
          error:
            'Select yes if you can pay the remaining costs without using any other grant money'
        }
      ],
      answers: [
        {
          key: 'remaining-costs-A1',
          value: 'Yes'
        },
        {
          key: 'remaining-costs-A2',
          value: 'No',
          notEligible: true
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
                  'loans',
                  'overdrafts',
                  'the Basic Payment Scheme',
                  'agri-environment schemes such as the Countryside Stewardship Scheme'
                ]
              }
            ]
          }
        ]
      },
      yarKey: 'payRemainingCosts'
    },
    {
      key: 'abstraction-licence',
      order: 12,
      title:
        'Does the project need an abstraction licence or a variation of one?',
      pageTitle: '',
      url: 'abstraction-licence',
      baseUrl: 'abstraction-licence',
      backUrl: 'remaining-costs',
      nextUrl: 'irrigation-status',
      fundingPriorities: '',
      type: 'single-answer',
      preValidationKeys: ['payRemainingCosts'],
      minAnswerCount: 1,
      ineligibleContent: {
        messageContent: 'You must have secured abstraction licences or variations before you submit a full application.',
        messageLink: {
          url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
          title: 'See other grants you may be eligible for.'
        }
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error:
            'Select when the project will have an abstraction licence or variation'
        }
      ],
      answers: [
        {
          key: 'abstraction-licence-A1',
          value: LICENSE_NOT_NEEDED
        },
        {
          key: 'abstraction-licence-A2',
          value: LICENSE_SECURED
        },
        {
          key: 'abstraction-licence-A3',
          value: LICENSE_EXPECTED,
          redirectUrl: 'abstraction-required-condition'
        },
        {
          key: 'abstraction-licence-A4',
          value: LICENSE_WILL_NOT_HAVE,
          notEligible: true
        }
      ],
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: `You must have secured abstraction licences or variations before you submit a full application.\n
                              Any abstraction licences or variations must be in place by 31 October 2024.`,
                items: []
              }
            ]
          }
        ]
      },
      yarKey: 'abstractionLicence'
    },
    {
      key: 'irrigation-status',
      order: 15,
      title: 'Are you currently irrigating?',
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      pageTitle: '',
      url: 'irrigation-status',
      baseUrl: 'irrigation-status',
      backUrl: 'abstraction-licence',
      backUrlObject: {
        dependentQuestionYarKey: 'abstractionLicence',
        dependentAnswerKeysArray: ['abstraction-licence-A3'],
        urlOptions: {
          thenUrl: 'abstraction-required-condition',
          elseUrl: 'abstraction-licence'
        }
      },
      nextUrl: 'summer-abstraction-mains',
      fundingPriorities: '',
      type: 'single-answer',
      preValidationKeys: ['abstractionLicence'],
      minAnswerCount: 1,
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select yes if you are currently irrigating'
        }
      ],
      answers: [
        {
          key: 'currentlyIrrigating-A1',
          value: 'Yes'
        },
        {
          key: 'currentlyIrrigating-A2',
          value: 'No'
        }
      ],
      yarKey: 'currentlyIrrigating'
    },
    {
      key: 'summer-abstraction-mains',
      order: 16,
      title: 'Will you {{_currentlyIrrigating_}} summer water surface abstraction or mains?',
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      pageTitle: '',
      url: 'summer-abstraction-mains',
      baseUrl: 'summer-abstraction-mains',
      backUrl: 'irrigation-status',
      nextUrl: 'water-source',
      preValidationKeys: '',
      fundingPriorities: '',
      type: 'single-answer',
      minAnswerCount: 1,
      ineligibleContent: {
        messageContent: `Your project cannot introduce or increase water use from summer abstraction or mains 
                          <div class='govuk-inset-text'>
                          RPA wants to fund projects that use more sustainable water sources, such as:</br></br>
                            <ul class='govuk-list govuk-list--bullet'>
                              <li>water peak-flow abstraction</li>
                              <li>rain water harvesting</li>
                              <li>bore hole/aquifer</li>
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
          dependentYarKey: 'currentlyIrrigating',
          error: 'Select yes if you’re increasing use of water from summer abstraction or mains',
          dependantError: 'Select yes if you’re going to use summer abstraction or mains'

        }
      ],
      answers: [
        {
          key: 'summer-abstraction-mains-A1',
          value: 'Yes',
          notEligible: true
        },
        {
          key: 'summer-abstraction-mains-A2',
          value: 'No'
        }
      ],
      sidebar: {
        values: [
          {
            heading: 'Eligibility',
            content: [
              {
                para: `Your project cannot increase water use from summer abstraction or mains.\n\n
                  RPA wants to fund projects that use more sustainable water sources, such as: `,
                items: [
                  'winter peak-flow abstraction',
                  'rain water harvesting',
                  'bore hole/aquifer'
                ]
              }
            ]
          }
        ]
      },
      yarKey: 'summerAbstractionMains'
    },

    // next page is water-source, then irrigation-systems
    {
      key: 'irrigated-crops',
      order: 19,
      title: 'What main crops will be irrigated?',
      pageTitle: 'Main crop',
      url: 'irrigated-crops',
      nextUrl: 'irrigated-land',
      baseUrl: 'irrigated-crops',
      backUrl: 'irrigation-system',
      type: 'single-answer',
      score: {
        isScore: true,
        isDisplay: true
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select the main crop you will be irrigating'
        }
      ],
      answers: [
        {
          key: 'irrigated-crops-A3',
          value: 'Field-scale crops',
          text: 'Field-scale crops (for example, potatoes, onions, carrots)',
          desc: 'Field-scale crops (for example, potatoes, onions, carrots)'
        },
        {
          key: 'irrigated-crops-A1',
          value: 'Protected cropping',
          text: 'Protected cropping (for example, glasshouse or poly tunnel)',
          desc: 'Protected cropping (for example, glasshouse or poly tunnel)'
        },
        {
          key: 'irrigated-crops-A2',
          value: 'Fruit',
          text: 'Fruit (for example, top fruit, bush fruit)',
          desc: 'Fruit'
        }
      ],
      sidebar: {
        values: [
          {
            heading: 'Funding priorities',
            content: [
              {
                para: 'RPA wants to fund projects that:',
                items: ['improve productivity']
              }
            ]
          }
        ]
      },
      yarKey: 'irrigatedCrops'
    },
    // next page is irrigated-land
    {
      key: 'productivity',
      order: 19,
      title: 'How will the project improve productivity?',
      hint: {
        html: 'Select up to 2 options'
      },
      pageTitle: '',
      url: 'productivity',
      baseUrl: 'productivity',
      backUrl: 'irrigated-land',
      nextUrl: 'collaboration',
      type: 'multi-answer',
      preValidationKeys: ['irrigatedLandTarget'],
      score: {
        isScore: true,
        isDisplay: true
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error:
            'Select up to 2 options to describe how your project will improve productivity'
        },
        {
          type: 'MAX_SELECT',
          error:
            'Select up to 2 options to describe how your project will improve productivity',
          max: 2
        }
      ],
      answers: [
        {
          key: 'productivity-A1',
          value: 'Introduce or expand high-value crops',
          desc: 'Introduce or expand high-value crops',
          weight: 3
        },
        {
          key: 'productivity-A2',
          value: 'Introduce or expand protected crops',
          desc: 'Introduce or expand protected crops',
          weight: 3
        },
        {
          key: 'productivity-A3',
          value: 'Increase yield per hectare',
          desc: 'Increase yield per hectare',
          weight: 1
        },
        {
          key: 'productivity-A4',
          value: 'Improve quality',
          desc: 'Improve quality',
          weight: 1
        },
        {
          key: 'productivity-A5',
          value: 'Maintain productivity',
          desc: 'Maintain productivity',
          weight: 0
        }
      ],
      sidebar: {
        values: [
          {
            heading: 'Funding priorities',
            content: [
              {
                para: 'RPA wants to fund projects that:',
                items: ['improve water sustainability']
              }
            ]
          }
        ]
      },
      yarKey: 'productivity'
    },
    {
      key: 'collaboration',
      order: 20,
      title: 'Will water be supplied to other farms?',
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      pageTitle: '',
      url: 'collaboration',
      baseUrl: 'collaboration',
      backUrl: 'productivity',
      nextUrl: 'score',
      preValidationKeys: ['productivity'],
      type: 'single-answer',
      minAnswerCount: 1,
      score: {
        isScore: true,
        isDisplay: true
      },
      hint: {
        text: 'For example, if you intend to supply some of the water via a water sharing agreement as a result of this project'
      },
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select yes if water will be supplied to other farms'
        }
      ],
      answers: [
        {
          key: 'collaboration-A1',
          value: 'Yes'
        },
        {
          key: 'collaboration-A2',
          value: 'No'
        }
      ],
      sidebar: {
        values: [
          {
            heading: 'Funding priorities',
            content: [
              {
                para: 'RPA wants to fund projects that:',
                items: ['improve water sustainability']
              }
            ]
          }
        ]
      },
      yarKey: 'collaboration'
    },
    // Goes to score route
    {
      key: 'business-details',
      order: 21,
      title: 'Business details',
      pageTitle: '',
      url: 'business-details',
      baseUrl: 'business-details',
      backUrl: 'score',
      nextUrl: 'applying',
      preValidationKeys: ['score-calculated'],
      ga: [
        { dimension: 'cd1', value: { type: 'score', value: 'Eligible' } },
        { dimension: 'cm2', value: { type: 'journey-time' } }
      ],
      fundingPriorities: '',
      type: 'multi-input',
      minAnswerCount: '',
      maxAnswerCount: '',
      allFields: [
        {
          yarKey: 'projectName',
          type: 'text',
          classes: 'govuk-input--width-20',
          label: {
            text: 'Project name',
            classes: 'govuk-label'
          },
          hint: {
            text: 'For example, Browns Hill Farm reservoir'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter a project name'
            },
            {
              type: 'MIN_MAX_CHARS',
              min: 0,
              max: 100,
              error: 'Name must be 100 characters or fewer'
            }
          ]
        },
        {
          yarKey: 'businessName',
          type: 'text',
          classes: 'govuk-input--width-20',
          label: {
            text: 'Business name',
            classes: 'govuk-label'
          },
          hint: {
            text: "If you're registered on the Rural Payments system, enter business name as registered"
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter a business name'
            },
            {
              type: 'MIN_MAX_CHARS',
              min: 0,
              max: 100,
              error: 'Name must be 100 characters or fewer'
            },
            {
              type: 'REGEX',
              regex: BUSINESSNAME_REGEX,
              error: 'Name must only include letters, hyphens and apostrophes'
            }
          ]
        },
        {
          yarKey: 'numberEmployees',
          type: 'number',
          classes: 'govuk-input--width-4',
          label: {
            text: 'Number of employees',
            classes: 'govuk-label'
          },
          hint: {
            text: 'Full-time employees, including the owner'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the number of employees'
            },
            {
              type: 'REGEX',
              regex: NUMBER_REGEX,
              error: 'Number of employees must be a whole number, like 305'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 9999,
              error: 'Number must be between 1-9999'
            }
          ]
        },
        {
          yarKey: 'businessTurnover',
          type: 'number',
          classes: 'govuk-input--width-10',
          prefix: {
            text: '£'
          },
          label: {
            text: 'Business turnover',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the business turnover'
            },
            {
              type: 'REGEX',
              regex: NUMBER_REGEX,
              error: 'Business turnover must be a whole number, like 100000'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 999999999,
              error: 'Business turnover must be a whole number, like 100000'
            }
          ]
        },
        {
          yarKey: 'sbi',
          type: 'text',
          title: 'Single Business Identifier (SBI)',
          classes: 'govuk-input govuk-input--width-10',
          label: {
            text: 'Single Business Identifier (SBI) (Optional)',
            classes: 'govuk-label'
          },
          hint: {
            html: 'If you do not have an SBI, you will need to get one for full application'
          },
          validate: [
            {
              type: 'REGEX',
              regex: SBI_REGEX,
              error: 'SBI number must have 9 characters, like 011115678'
            }
          ]
        }
      ],
      yarKey: 'businessDetails'
    },
    {
      key: 'applying',
      order: 22,
      title: 'Who is applying for this grant?',
      pageTitle: '',
      url: 'applying',
      baseUrl: 'applying',
      backUrl: 'business-details',
      preValidationKeys: ['businessDetails'],
      fundingPriorities: '',
      type: 'single-answer',
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      minAnswerCount: 1,
      validate: [
        {
          type: 'NOT_EMPTY',
          error: 'Select who is applying for this grant'
        }
      ],
      answers: [
        {
          key: 'applying-A1',
          value: 'Applicant',
          redirectUrl: 'applicant-details'
        },
        {
          key: 'applying-A2',
          value: 'Agent',
          redirectUrl: 'agent-details'
        }
      ],
      yarKey: 'applying'
    },
    {
      key: 'applicant-details',
      order: 23,
      title: 'Applicant’s details',
      hint: {
        text: 'Enter the farmer and farm business details'
      },
      pageTitle: '',
      url: 'applicant-details',
      baseUrl: 'applicant-details',
      nextUrl: 'check-details',
      preValidationKeys: ['applying'],
      backUrlObject: {
        dependentQuestionYarKey: 'applying',
        dependentAnswerKeysArray: ['applying-A2'],
        urlOptions: {
          thenUrl: 'agent-details',
          elseUrl: 'applying'
        }
      },
      fundingPriorities: '',
      type: 'multi-input',
      minAnswerCount: '',
      maxAnswerCount: '',
      ga: [{ dimension: 'cd3', value: { type: 'yar', key: 'applying' } }],
      allFields: [
        {
          type: 'sub-heading',
          text: 'Name'
        },
        {
          yarKey: 'firstName',
          type: 'text',
          classes: 'govuk-input--width-20',
          label: {
            text: 'First name',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your first name'
            },
            {
              type: 'REGEX',
              regex: NAME_REGEX,
              error: 'Name must only include letters, hyphens and apostrophes'
            }
          ]
        },
        {
          yarKey: 'lastName',
          type: 'text',
          endFieldset: 'true',
          classes: 'govuk-input--width-20',
          label: {
            text: 'Last name',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your last name'
            },
            {
              type: 'REGEX',
              regex: NAME_REGEX,
              error: 'Name must only include letters, hyphens and apostrophes'
            }
          ]
        },
        {
          type: 'sub-heading',
          text: 'Contact details'
        },
        {
          yarKey: 'emailAddress',
          type: 'email',
          classes: 'govuk-input--width-20',
          label: {
            text: 'Email address',
            classes: 'govuk-label'
          },
          hint: {
            text: 'We will only use this to send you confirmation'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your email address'
            },
            {
              type: 'REGEX',
              regex: EMAIL_REGEX,
              error:
                'Enter an email address in the correct format, like name@example.com'
            }
          ]
        },
        {
          yarKey: 'emailConfirm',
          type: 'email',
          classes: 'govuk-input--width-20',
          label: {
            text: 'Confirm email',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Confirm your email address'
            },
            {
              type: 'REGEX',
              regex: EMAIL_REGEX,
              error:
                'Enter an email address in the correct format, like name@example.com'
            },
            {
              type: 'CONFIRMATION_ANSWER',
              fieldsToCampare: ['emailAddress', 'emailConfirm'],
              error: 'Enter an email address that matches'
            }
          ]
        },
        {
          yarKey: 'mobile',
          type: 'tel',
          classes: 'govuk-input--width-10',
          label: {
            text: 'Mobile number',
            classes: 'govuk-label'
          },
          hint: {
            text: 'We will only use this to contact you about your application'
          },
          validate: [
            {
              type: 'NOT_EMPTY_EXTRA',
              error:
                'Enter a mobile number (if you do not have a mobile, enter your landline number)',
              extraFieldsToCheck: ['landline']
            },
            {
              type: 'REGEX',
              regex: CHARS_MIN_10,
              error: 'Your mobile number must have at least 10 characters'
            },
            {
              type: 'REGEX',
              regex: PHONE_REGEX,
              error:
                'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
            }
          ]
        },
        {
          yarKey: 'landline',
          endFieldset: 'true',
          type: 'tel',
          classes: 'govuk-input--width-10',
          label: {
            text: 'Landline number',
            classes: 'govuk-label'
          },
          hint: {
            text: 'We will only use this to contact you about your application'
          },
          validate: [
            {
              type: 'NOT_EMPTY_EXTRA',
              error:
                'Enter a landline number (if you do not have a landline, enter your mobile number)',
              extraFieldsToCheck: ['mobile']
            },
            {
              type: 'REGEX',
              regex: CHARS_MIN_10,
              error: 'Your landline number must have at least 10 characters'
            },
            {
              type: 'REGEX',
              regex: PHONE_REGEX,
              error:
                'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
            }
          ]
        },
        {
          type: 'sub-heading',
          text: 'Business address'
        },
        {
          yarKey: 'address1',
          type: 'text',
          classes: 'govuk-input--width-20',
          label: {
            html: 'Address line 1',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your building and street details'
            },
            {
              type: 'REGEX',
              regex: ADDRESS_REGEX,
              error: 'Address must only include letters, hyphens and spaces'
            }
          ]
        },
        {
          yarKey: 'address2',
          type: 'text',
          classes: 'govuk-input--width-20',
          label: {
            html: 'Address line 2 (optional)',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'REGEX',
              regex: ADDRESS_REGEX,
              error: 'Address must only include letters, hyphens and spaces'
            }
          ]
        },
        {
          yarKey: 'town',
          type: 'text',
          classes: 'govuk-input--width-10',
          label: {
            text: 'Town',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your town'
            },
            {
              type: 'REGEX',
              regex: ONLY_TEXT_REGEX,
              error: 'Town must only include letters, hyphens and spaces'
            }
          ]
        },
        {
          yarKey: 'county',
          type: 'select',
          classes: 'govuk-input--width-10',
          label: {
            text: 'County',
            classes: 'govuk-label'
          },
          answers: [...LIST_COUNTIES],
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select your county'
            }
          ]
        },
        {
          yarKey: 'businessPostcode',
          type: 'text',
          classes: 'govuk-input--width-5',
          label: {
            text: 'Business postcode',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your business postcode, like AA1 1AA'
            },
            {
              type: 'REGEX',
              regex: POSTCODE_REGEX,
              error: 'Enter a business postcode, like AA1 1AA'
            }
          ]
        },
        {
          yarKey: 'projectPostcode',
          type: 'text',
          endFieldset: 'true',
          classes: 'govuk-input--width-5',
          label: {
            text: 'Project postcode',
            classes: 'govuk-label'
          },
          hint: {
            text: 'The site postcode where the work will happen'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter a project postcode, like AA1 1AA'
            },
            {
              type: 'REGEX',
              regex: POSTCODE_REGEX,
              error: 'Enter a project postcode, like AA1 1AA'
            }
          ]
        }
      ],
      yarKey: 'farmerDetails'
    },
    {
      key: 'agent-details',
      order: 24,
      title: 'Agent’s details',
      hint: {
        text: 'Enter the agent and agent business details'
      },
      pageTitle: '',
      url: 'agent-details',
      baseUrl: 'agent-details',
      backUrl: 'applying',
      nextUrl: 'applicant-details',
      preValidationKeys: ['applying'],

      type: 'multi-input',
      minAnswerCount: '',
      maxAnswerCount: '',
      allFields: [
        {
          type: 'sub-heading',
          text: 'Name'
        },
        {
          yarKey: 'firstName',
          type: 'text',
          classes: 'govuk-input--width-20',
          label: {
            text: 'First name',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your first name'
            },
            {
              type: 'REGEX',
              regex: NAME_REGEX,
              error: 'Name must only include letters, hyphens and apostrophes'
            }
          ]
        },
        {
          yarKey: 'lastName',
          type: 'text',
          classes: 'govuk-input--width-20',
          label: {
            text: 'Last name',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your last name'
            },
            {
              type: 'REGEX',
              regex: NAME_REGEX,
              error: 'Name must only include letters, hyphens and apostrophes'
            }
          ]
        },
        {
          yarKey: 'businessName',
          type: 'text',
          endFieldset: 'true',
          classes: 'govuk-input--width-20',
          label: {
            text: 'Business name',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your business name'
            },
            {
              type: 'MIN_MAX_CHARS',
              min: 0,
              max: 100,
              error: 'Name must be 100 characters or fewer'
            },
            {
              type: 'REGEX',
              regex: NAME_ONLY_REGEX,
              error: 'Name must only include letters, hyphens and apostrophes'
            }
          ]
        },
        {
          type: 'sub-heading',
          text: 'Contact details'
        },
        {
          yarKey: 'emailAddress',
          type: 'email',
          classes: 'govuk-input--width-20',
          label: {
            text: 'Email address',
            classes: 'govuk-label'
          },
          hint: {
            text: 'We will only use this to send you confirmation'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your email address'
            },
            {
              type: 'REGEX',
              regex: EMAIL_REGEX,
              error:
                'Enter an email address in the correct format, like name@example.com'
            }
          ]
        },
        {
          yarKey: 'emailConfirm',
          type: 'email',
          classes: 'govuk-input--width-20',
          label: {
            text: 'Confirm email address',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Confirm your email address'
            },
            {
              type: 'REGEX',
              regex: EMAIL_REGEX,
              error:
                'Enter an email address in the correct format, like name@example.com'
            },
            {
              type: 'CONFIRMATION_ANSWER',
              fieldsToCampare: ['emailAddress', 'emailConfirm'],
              error: 'Enter an email address that matches'
            }
          ]
        },
        {
          yarKey: 'mobile',
          type: 'tel',
          classes: 'govuk-input--width-10',
          label: {
            text: 'Mobile number',
            classes: 'govuk-label'
          },
          hint: {
            text: 'We will only use this to contact you about your application'
          },
          validate: [
            {
              type: 'NOT_EMPTY_EXTRA',
              error:
                'Enter a mobile number (if you do not have a mobile, enter your landline number)',
              extraFieldsToCheck: ['landline']
            },
            {
              type: 'REGEX',
              regex: CHARS_MIN_10,
              error: 'Your mobile number must have at least 10 characters'
            },
            {
              type: 'REGEX',
              regex: PHONE_REGEX,
              error:
                'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
            }
          ]
        },
        {
          yarKey: 'landline',
          endFieldset: 'true',
          type: 'tel',
          classes: 'govuk-input--width-10',
          label: {
            text: 'Landline number',
            classes: 'govuk-label'
          },
          hint: {
            text: 'We will only use this to contact you about your application'
          },
          validate: [
            {
              type: 'NOT_EMPTY_EXTRA',
              error:
                'Enter a landline number (if you do not have a landline, enter your mobile number)',
              extraFieldsToCheck: ['mobile']
            },
            {
              type: 'REGEX',
              regex: CHARS_MIN_10,
              error: 'Your landline number must have at least 10 characters'
            },
            {
              type: 'REGEX',
              regex: PHONE_REGEX,
              error:
                'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
            }
          ]
        },
        {
          type: 'sub-heading',
          text: 'Business address'
        },
        {
          yarKey: 'address1',
          type: 'text',
          classes: 'govuk-input--width-20',
          label: {
            html: 'Address line 1',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your building and street details'
            },
            {
              type: 'REGEX',
              regex: ADDRESS_REGEX,
              error: 'Address must only include letters, hyphens and spaces'
            }
          ]
        },
        {
          yarKey: 'address2',
          type: 'text',
          classes: 'govuk-input--width-20',
          label: {
            html: 'Address line 2 (optional)',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'REGEX',
              regex: ADDRESS_REGEX,
              error: 'Address must only include letters, hyphens and spaces'
            }
          ]
        },
        {
          yarKey: 'town',
          type: 'text',
          classes: 'govuk-input--width-10',
          label: {
            text: 'Town',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your town'
            },
            {
              type: 'REGEX',
              regex: ONLY_TEXT_REGEX,
              error: 'Town must only include letters, hyphens and spaces'
            }
          ]
        },
        {
          yarKey: 'county',
          type: 'select',
          classes: 'govuk-input--width-10',
          label: {
            text: 'County',
            classes: 'govuk-label'
          },
          answers: [...LIST_COUNTIES],
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select your county'
            }
          ]
        },
        {
          yarKey: 'postcode',
          type: 'text',
          endFieldset: 'true',
          classes: 'govuk-input--width-5',
          label: {
            text: 'Postcode',
            classes: 'govuk-label'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter your postcode, like AA1 1AA'
            },
            {
              type: 'REGEX',
              regex: POSTCODE_REGEX,
              error: 'Enter a postcode, like AA1 1AA'
            }
          ]
        }
      ],
      yarKey: 'agentDetails'
    },
    {
      key: 'check-details',
      order: 25,
      title: 'Check your details',
      pageTitle: 'Check details',
      url: 'check-details',
      backUrl: 'applicant-details',
      nextUrl: 'confirm',
      preValidationKeys: ['applying'],
      eliminationAnswerKeys: '',
      ineligibleContent: {},
      pageData: {
        businessDetailsLink: 'business-details',
        agentDetailsLink: 'agent-details',
        farmerDetailsLink: 'applicant-details'
      },
      fundingPriorities: '',
      type: '',
      minAnswerCount: 1,
      answers: []
    },
    {
      key: 'confirm',
      title: 'Confirm and send',
      order: 26,
      url: 'confirm',
      backUrl: 'check-details',
      nextUrl: 'confirmation',
      preValidationKeys: ['farmerDetails'],
      maybeEligible: true,
      maybeEligibleContent: {
        messageHeader: 'Confirm and send',
        messageContent: `I confirm that, to the best of my knowledge, the details I have provided are correct.</br></br>
            I understand the project’s eligibility and score is based on the answers I provided.</br></br>
            I am aware that the information I submit will be:</br>
            <ul>
              <li>checked by the RPA</li>
              <li>shared with the Environment Agency so that they can check the details of my planned project</li>
            </ul></br>
            I am happy to be contacted by Defra and RPA (or a third-party on their behalf) about my application.</br></br>
            So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third-party working for us, to contact you.`
      },
      answers: [
        {
          key: 'consentOptional',
          value: 'CONSENT_OPTIONAL'
        }
      ],
      yarKey: 'consentOptional'
    },
    {
      key: 'confirmation',
      order: 27,
      title: 'Details submitted',
      pageTitle: '',
      url: 'confirmation',
      baseUrl: 'confirmation',
      preValidationKeys: ['farmerDetails'],
      ga: [
        { dimension: 'cd2', value: { type: 'score' } },
        { dimension: 'cd5', value: { type: 'confirmationId' } },
        { dimension: 'cm1', value: { type: 'journey-time' } }
      ],
      maybeEligible: true,
      maybeEligibleContent: {
        reference: {
          titleText: 'Details submitted',
          html: 'Your reference number<br><strong>{{_confirmationId_}}</strong>',
          surveyLink: process.env.SURVEY_LINK
        },
        messageContent: `We have sent you a confirmation email with a record of your answers.<br/><br/>
            If you do not get an email within 72 hours, please contact RPA helpline and follow the options for Farming Transformation Fund scheme:<br/>
            <h1 class='govuk-heading-m'>RPA helpline</h1>
            <h2 class='govuk-heading-s'>Telephone</h2>
            Telephone: 0300 0200 301<br/>
            Monday to Friday, 9am to 5pm (except public holidays)<br/>
            <p><a class='govuk-link' target='_blank' href='https://www.gov.uk/call-charges' rel='noopener noreferrer'>Find out about call charges (opens in a new tab)</a></p>
            <h2 class='govuk-heading-s'>Email</h2>
            <a class='govuk-link' title='Send email to RPA' target='_blank' rel='noopener noreferrer' href='mailto:ftf@rpa.gov.uk'>FTF@rpa.gov.uk</a><br/><br/>
            
            <h2 class='govuk-heading-m'>What happens next</h2>
            <ol>
              <li>RPA will be in touch when the full application period opens. They will tell you if your project scored well enough to get the full application form.</li>
              <br/>
              <li>If you submit an application, RPA will assess it against other projects and value for money. You will not automatically get a grant. The grant is expected to be highly competitive and you are competing against other projects.</li>
              <br/>
              <li>If your application is successful, you'll be sent a funding agreement and can begin work on the project.</li>
            </ol>
            `,
        warning: {
          text: 'You must not start the project'
        },
        extraMessageContent: `<p>Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.</p> 
            <p>Before you start the project, you can:</p>
            <ul>
              <li>get quotes from suppliers</li>
              <li>apply for planning permission or an abstraction licence</li>
            </ul>
            <p class='govuk-body'><a class='govuk-link' href='${process.env.SURVEY_LINK}' target='_blank' rel='noopener noreferrer'>What do you think of this service? (opens in a new tab)</a></p>
            `
      },
      fundingPriorities: '',
      type: '',
      minAnswerCount: 1,
      answers: []
    }
  ]
}

const ALL_QUESTIONS = []

questionBank.questions.forEach((question) => {
  ALL_QUESTIONS.push(question)
})
const ALL_URLS = []
ALL_QUESTIONS.forEach((item) => ALL_URLS.push(item.url))

const YAR_KEYS = ['calculatedGrant', 'remainingCost', 'projectItemsList']
ALL_QUESTIONS.forEach((item) => YAR_KEYS.push(item.yarKey))

module.exports = {
  questionBank,
  ALL_QUESTIONS,
  ALL_URLS,
  YAR_KEYS
}
