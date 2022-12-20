const { sendDesirabilitySubmitted } = require('../../../../../app/messaging/senders')
jest.mock('../../../../../app/messaging/senders')

const createMessageMock = require('../../../../../app/messaging/email/create-submission-msg')
jest.mock('../../../../../app/messaging/email/create-submission-msg')

const processSubmission = require('../../../../../app/messaging/email/process-submission')

const contactDetailsReceiver = jest.mock()

const appInsightsMock = require('../../../../../app/services/app-insights')
jest.mock('../../../../../app/services/app-insights')

describe('Process submission', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const msg = {
    body: {
      submissionDetails: 'lorem ipsum'
    },
    correlationId: 7357
  }

  test('Successful path', async () => {

    contactDetailsReceiver.completeMessage = jest.fn()

    createMessageMock.mockReturnValue(true)

    sendDesirabilitySubmitted.mockResolvedValue(true)

    processSubmission(msg)

    expect(createMessageMock).toHaveBeenCalledTimes(1)

    expect(sendDesirabilitySubmitted).toHaveBeenCalledTimes(1)

    // expect used to be related to index.js
    
  })

  test('Error path', async () => {
    processSubmission.completeMessage = jest.fn()

    createMessageMock.mockReturnValue(true)

    sendDesirabilitySubmitted.mockImplementation(() => {
      throw new Error();
    });

    appInsightsMock.logException = jest.fn()

    processSubmission(msg)
        // expect used to be related to index.js

    expect(appInsightsMock.logException).toHaveBeenCalledTimes(1)


  })
})
