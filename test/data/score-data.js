
const msgData = {
  grantScheme: {
    key: 'WM01',
    name: 'Water Management'
  },
  desirability: {
    questions: [
      {
        key: 'Q16',
        answers: [
          {
            key: 'Q16a',
            title: 'Current land irrigated',
            input: [
              {
                key: null,
                value: 0
              }
            ]
          },
          {
            key: 'Q16b',
            title: 'Future land irrigated',
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
          band: 'Average'
        }
      },
      {
        key: 'Q17',
        answers: [
          {
            key: 'Q17a',
            title: 'Current water source',
            input: [
              {
                key: 'Q17a-A6',
                value: 'Not currently irrigating'
              }
            ]
          },
          {
            key: 'Q17b',
            title: 'Future water source',
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
          band: 'Strong'
        }
      },
      {
        key: 'Q18',
        answers: [
          {
            key: 'Q18a',
            title: 'Current irrigation systems',
            input: [
              {
                key: 'Q18a-A6',
                value: 'Not currently irrigating'
              }
            ]
          },
          {
            key: 'Q18b',
            title: 'Future irrigation systems',
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
          band: 'Strong'
        }
      },
      {
        key: 'Q19',
        answers: [
          {
            key: 'Q19',
            title: 'Productivity',
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
          band: 'Weak'
        }
      },
      {
        key: 'Q20',
        answers: [
          {
            key: 'Q20',
            title: 'Water sharing',
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
          band: 'Strong'
        }
      }
    ],
    overallRating: {
      score: 72.5,
      band: 'Strong'
    }
  },
  questionMapping: {
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
