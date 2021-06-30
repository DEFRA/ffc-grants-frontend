module.exports = {
  grantScheme: {
    key: 'WM001',
    name: 'Water Management'
  },
  questions: [
    {
      key: 'Q1',
      order: 1,
      title: 'What crops are you growing?',
      pageTitle: '',
      url: 'farming-type',
      yarKey: 'farmingType'
    },
    {
      key: 'Q2',
      order: 2,
      title: 'What is the legal status of the business?',
      pageTitle: '',
      url: 'legal-status',
      yarKey: 'legalStatus'
    },
    {
      key: 'Q3',
      order: 3,
      title: 'Is the planned project in England?',
      pageTitle: '',
      url: 'country',
      yarKey: 'inEngland'
    },
    {
      key: 'Q4',
      order: 4,
      title: 'Does the project need planning permission?',
      pageTitle: '',
      url: 'planning-permission',
      yarKey: 'planningPermission'
    },
    {
      key: 'Q5',
      order: 5,
      title: 'Have you already started work on the project?',
      pageTitle: '',
      url: 'project-start',
      yarKey: 'projectStarted'
    },
    {
      key: 'Q6',
      order: 6,
      title: 'Is the planned project on land the farm business owns?',
      pageTitle: '',
      url: 'tenancy',
      yarKey: 'landOwnership'
    },
    {
      key: 'Q7',
      order: 7,
      title: 'Which eligible items does your project need?',
      pageTitle: '',
      url: 'project-items',
      yarKey: 'projectItemsList'
    },
    {
      key: 'Q8',
      order: 8,
      title: 'What is the estimated cost of the items?',
      pageTitle: '',
      url: 'project-cost',
      yarKey: 'projectCost'
    },
    {
      key: 'Q9',
      order: 9,
      title: '',
      pageTitle: 'Can you pay the remaining costs',
      url: 'remaining-costs',
      yarKey: 'payRemainingCosts'
    },
    {
      key: 'Q10',
      order: 10,
      title: 'Does the project directly impact a Site of Special Scientific Interest?',
      pageTitle: '',
      url: 'SSSI',
      yarKey: 'sSSI'
    },
    {
      key: 'Q11',
      order: 11,
      title: 'Does the project need an abstraction licence or a variation of one?',
      pageTitle: '',
      url: 'abstraction-licence',
      yarKey: 'abstractionLicence'
    },
    {
      key: 'Q14',
      order: 14,
      title: 'What impact will the project have?',
      pageTitle: 'Project impact',
      fundingPriorities: 'Improve productivity <br/> Improve the environment <br/> Improving water sustainability',
      type: 'multiple-answer',
      url: 'project-summary',
      yarKey: 'project',
      answerCount: 2,
      answer: [
        {
          key: 'Q14-A1',
          value: 'Change water source'
        },
        {
          key: 'Q14-A2',
          value: 'Improve irrigation efficiency'
        },
        {
          key: 'Q14-A3',
          value: 'Introduce Irrigation'
        },
        {
          key: 'Q14-A4',
          value: 'Increase Irrigation'
        },
        {
          key: 'Q14-A5',
          value: 'None of the above'
        }
      ]
    },
    {
      key: 'Q15',
      order: 15,
      title: 'What main crops will be irrigated?',
      pageTitle: 'Main crop',
      fundingPriorities: 'Improve productivity',
      type: 'single-answer',
      url: 'irrigated-crops',
      yarKey: 'irrigatedCrops',
      answer: [
        {
          key: 'Q15-A1',
          desc: 'Protected cropping (for example glass house or poly tunnel)'
        },
        {
          key: 'Q15-A2',
          desc: 'Fruit (for example top fruit, bush fruit)'
        },
        {
          key: 'Q15-A3',
          desc: 'Field-scale crops (for example potatoes, onions, carrots)'
        }
      ]
    },
    {
      key: 'Q15.1',
      order: 15.1,
      title: 'Are you currently irrigating?',
      pageTitle: 'Irrigation status',
      type: 'single-answer',
      url: 'irrigation-status',
      yarKey: 'currentlyIrrigating',
      answer: [
        {
          key: 'Q15.1-A1',
          desc: 'Yes'
        },
        {
          key: 'Q15.1-A2',
          desc: 'No'
        }
      ]
    },
    {
      key: 'Q16',
      order: 16,
      title: 'How much land is currently irrigated per year?',
      pageTitle: 'Irrigated land',
      desc: 'Enter figure in hectares',
      fundingPriorities: 'Improve productivity',
      group: 'Q16',
      type: 'number',
      unit: 'hectares',
      url: 'irrigated-land',
      yarKey: 'irrigatedLandCurrent'
    },
    {
      key: 'Q16a',
      order: 16.1,
      title: 'How much land will be irrigated after the project?',
      pageTitle: 'Irrigated land',
      desc: 'Enter figure in hectares',
      fundingPriorities: 'Improve productivity',
      group: 'Q16',
      type: 'number',
      unit: 'hectares',
      url: 'irrigated-land',
      yarKey: 'irrigatedLandTarget'
    },
    {
      key: 'Q17',
      order: 17,
      title: 'Where does your current irrigation water come from?',
      pageTitle: 'Irrigation source',
      url: 'irrigation-water-source',
      yarKey: 'waterSourceCurrent',
      fundingPriorities: 'Improve the environment <br/> Improving water sustainability',
      type: 'multiple-answer',
      answerCount: 2,
      group: 'Q17',
      answer: [
        {
          key: 'Q17a-A1',
          desc: 'Peak-flow/winter abstraction'
        },
        {
          key: 'Q17a-A2',
          desc: 'Rain water harvesting'
        },
        {
          key: 'Q17a-A3',
          desc: 'Bore hole / aquifer'
        },
        {
          key: 'Q17a-A4',
          desc: 'Summer water surface abstraction'
        },
        {
          key: 'Q17a-A5',
          desc: 'Mains'
        },
        {
          key: 'Q17a-A6',
          desc: 'Not currently irrigating'
        }
      ]
    },
    {
      key: 'Q17b',
      order: 17.1,
      title: 'Where will your irrigation water come from?',
      pageTitle: 'Irrigation source',
      url: 'irrigation-water-source',
      yarKey: 'waterSourcePlanned',
      fundingPriorities: 'Improve the environment <br/> Improving water sustainability',
      type: 'multiple-answer',
      answerCount: 2,
      group: 'Q17',
      answer: [
        {
          key: 'Q17b-A1',
          desc: 'Peak-flow/winter abstraction'
        },
        {
          key: 'Q17b-A2',
          desc: 'Rain water harvesting'
        },
        {
          key: 'Q17b-A3',
          desc: 'Bore hole / aquifer'
        },
        {
          key: 'Q17b-A4',
          desc: 'Summer water surface abstraction'
        },
        {
          key: 'Q17b-A5',
          desc: 'Mains'
        }
      ]
    },
    {
      key: 'Q18',
      order: 18,
      title: 'What systems are currently used to irrigate?',
      pageTitle: 'Irrigation system',
      fundingPriorities: 'Improve the environment <br/> Improving water sustainability',
      group: 'Q18',
      url: 'irrigation-systems',
      yarKey: 'irrigationCurrent',
      type: 'multiple-answer',
      answerCount: 2,
      answer: [
        {
          key: 'Q18a-A1',
          desc: 'Trickle',
          weight: 6
        },
        {
          key: 'Q18a-A2',
          desc: 'Mist',
          weight: 5
        },
        {
          key: 'Q18a-A3',
          desc: 'Ebb and flow',
          weight: 4
        },
        {
          key: 'Q18a-A4',
          desc: 'Sprinklers',
          weight: 3
        },
        {
          key: 'Q18a-A5',
          desc: 'Capillary Bed',
          weight: 2
        },
        {
          key: 'Q18a-A6',
          desc: 'Boom',
          weight: 1
        },
        {
          key: 'Q18a-A7',
          desc: 'Rain Gun / Not currently irrigating',
          weight: 0
        }
      ]
    },
    {
      key: 'Q18b',
      order: 18.1,
      title: 'What systems will be used to irrigate?',
      pageTitle: 'Irrigation system',
      group: 'Q18',
      url: 'irrigation-systems',
      yarKey: 'irrigationPlanned',
      type: 'multiple-answer',
      fundingPriorities: 'Reducing environmental imapact <br/> Improving water sustainability',
      answerCount: 2,
      answer: [
        {
          key: 'Q18b-A1',
          desc: 'Trickle',
          weight: 6
        },
        {
          key: 'Q18b-A2',
          desc: 'Mist',
          weight: 5
        },
        {
          key: 'Q18b-A3',
          desc: 'Ebb and flow',
          weight: 4
        },
        {
          key: 'Q18b-A4',
          desc: 'Sprinklers',
          weight: 3
        },
        {
          key: 'Q18b-A5',
          desc: 'Capillary Bed',
          weight: 2
        },
        {
          key: 'Q18b-A6',
          desc: 'Boom',
          weight: 1
        },
        {
          key: 'Q18b-A7',
          desc: 'Rain Gun / Not currently irrigating',
          weight: 0
        }
      ]
    },
    {
      key: 'Q19',
      order: 19,
      title: 'How will the project improve productivity',
      pageTitle: 'Productivity',
      fundingPriorities: 'Improve productivity',
      help: '',
      desc: 'Productivity is about how much is produced relative to inputs (for example increased yield for the same inputs or the same yield with lower inputs).',
      url: 'productivity',
      yarKey: 'productivity',
      type: 'multiple-answer',
      answerCount: 2,
      answer: [
        {
          key: 'Q19-A1',
          desc: 'Introduce or expand high Value Crops',
          weight: 3
        },
        {
          key: 'Q19-A2',
          desc: 'Introduce or expand protected Crops',
          weight: 3
        },
        {
          key: 'Q19-A3',
          desc: 'Improved Yield per Ha',
          weight: 1
        },
        {
          key: 'Q19-A4',
          desc: 'Improved Quality',
          weight: 1
        },
        {
          key: 'Q19-A5',
          desc: 'Maintain productivity',
          weight: 0
        }
      ]
    },
    {
      key: 'Q20',
      order: 20,
      title: 'Will water be supplied to other farms?',
      pageTitle: 'Other farms',
      fundingPriorities: 'Improve water sustainability',
      desc: 'If you intend to supply water via a water sharing agreement as a result of this project.',
      url: 'collaboration',
      yarKey: 'collaboration',
      type: 'single-answer',
      answer: [
        {
          key: 'Q20-A1',
          desc: 'Yes'
        },
        {
          key: 'Q20-A2',
          desc: 'No'
        }
      ]
    },
    {
      key: 'Q22',
      order: 22,
      title: 'Business details',
      pageTitle: '',
      url: 'business-details',
      yarKey: 'businessDetails'
    },
    {
      key: 'Q23',
      order: 23,
      title: 'Who is applying for this grant?',
      pageTitle: '',
      url: 'applying',
      yarKey: 'applying'
    },
    {
      key: 'Q24',
      order: 24,
      title: 'Farmers details',
      pageTitle: '',
      url: 'farmer-details',
      yarKey: 'farmerDetails'
    }
  ]
}
