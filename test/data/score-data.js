
const msgData = {
  grantScheme: {
    key: 'WM01',
    name: 'Water Management'
  },
  desirability: {
    questions: [
      {
        key: 'irrigated-land',
        answers: [
          {
            key: 'irrigated-land-a',
            title: 'Current land irrigated',
            input: [
              {
                key: null,
                value: 0
              }
            ]
          },
          {
            key: 'irrigated-land-b',
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
        key: 'water-source',
        answers: [
          {
            key: 'water-source-a',
            title: 'Current water source',
            input: [
              {
                key: 'water-source-a-A6',
                value: 'Not currently irrigating'
              }
            ]
          },
          {
            key: 'water-source-b',
            title: 'Future water source',
            input: [
              {
                key: 'water-source-b-A2',
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
        key: 'change-summer-abstraction',
        answers: [
          {
            key: 'change-summer-abstraction-a',
            title: 'Current water source',
            input: [
              {
                key: 'change-summer-abstraction-a-A1',
                value: 'Decrease'
              }
            ]
          },
          {
            key: 'chnage-summer-abstraction-b',
            title: 'Future water source',
            input: [
              {
                key: 'change-summer-abstraction-b-A2',
                value: 'No change'
              }
            ]
          }
        ],
        rating: {
          score: 0,
          band: 'Strong'
        }
      },
      {
        key: 'irrigation-system',
        answers: [
          {
            key: 'irrigation-system-a',
            title: 'Current irrigation systems',
            input: [
              {
                key: 'irrigation-system-a-A6',
                value: 'Not currently irrigating'
              }
            ]
          },
          {
            key: 'irrigation-system-b',
            title: 'Future irrigation systems',
            input: [
              {
                key: 'irrigation-system-b-A3',
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
        key: 'productivity',
        answers: [
          {
            key: 'productivity',
            title: 'Productivity',
            input: [
              {
                key: 'productivity-A5',
                value: 'Maintain productivity'
              },
              {
                key: 'productivity-A3',
                value: 'Increase yield per hectare'
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
        key: 'collaboration',
        answers: [
          {
            key: 'collaboration',
            title: 'Water sharing',
            input: [
              {
                key: 'collaboration-A1',
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
  }
}
module.exports = msgData
