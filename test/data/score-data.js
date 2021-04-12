
const msgData = {
  grantScheme: {
    key: 'WM01',
    name: 'Water Management'
  },
  desirability: {
    questions: [
      {
        key: 'Q14',
        answers: [
          {
            key: 'Q14',
            title: 'Project details',
            input: [
              {
                key: 'Q14-A3',
                value: 'Increase irrigation'
              }
            ]
          }
        ],
        rating: {
          score: 1,
          band: 'Low'
        }
      },
      {
        key: 'Q16',
        answers: [
          {
            key: 'Q16a',
            title: 'How much land is currently irrigated per year?',
            input: [
              {
                key: null,
                value: 0
              }
            ]
          },
          {
            key: 'Q16b',
            title: 'How much land will be irrigated in total per year under the grant?',
            input: [
              {
                key: null,
                value: 50
              }
            ]
          }
        ],
        rating: {
          score: 6,
          band: 'Medium'
        }
      },
      {
        key: 'Q17',
        answers: [
          {
            key: 'Q17a',
            title: 'Where does your current irrigation water come from?',
            input: [
              {
                key: 'Q17a-A6',
                value: 'Not currently irrigating'
              }
            ]
          },
          {
            key: 'Q17b',
            title: 'Where will the irrigation water come from?',
            input: [
              {
                key: 'Q17b-A2',
                value: 'Bore hole / aquifer'
              }
            ]
          }
        ],
        rating: {
          score: 40,
          band: 'High'
        }
      },
      {
        key: 'Q18',
        answers: [
          {
            key: 'Q18a',
            title: 'What systems are currently used to irrigate?',
            input: [
              {
                key: 'Q18a-A6',
                value: 'Not currently irrigating'
              }
            ]
          },
          {
            key: 'Q18b',
            title: 'What systems will be used to irrigate?',
            input: [
              {
                key: 'Q18b-A3',
                value: 'Ebb and flood or capillary bed'
              }
            ]
          }
        ],
        rating: {
          score: 25,
          band: 'High'
        }
      },
      {
        key: 'Q19',
        answers: [
          {
            key: 'Q19',
            title: 'How will the project improve productivity?',
            input: [
              {
                key: 'Q19-A5',
                value: 'Maintain productivity'
              },
              {
                key: 'Q19-A3',
                value: 'Increased yield per hectare'
              }
            ]
          }
        ],
        rating: {
          score: 0.5,
          band: 'Low'
        }
      },
      {
        key: 'Q20',
        answers: [
          {
            key: 'Q20',
            title: 'Will water be supplied to other farms?',
            input: [
              {
                key: 'Q20-A1',
                value: 'Yes'
              }
            ]
          }
        ],
        rating: {
          score: 4,
          band: 'High'
        }
      }
    ],
    overallRating: {
      score: 76.5,
      band: 'High'
    }
  },
  questionMapping: {
    Q14: 'project',
    Q15: 'irrigatedCrops',
    Q16a: 'irrigatedLandCurrent',
    Q16b: 'irrigatedLandTarget',
    Q17a: 'waterSourceCurrent',
    Q17b: 'waterSourcePlanned',
    Q18a: 'irrigationCurrent',
    Q18b: 'irrigationPlanned',
    Q19: 'productivity',
    Q20: 'collaboration'
  }
}
module.exports = msgData
