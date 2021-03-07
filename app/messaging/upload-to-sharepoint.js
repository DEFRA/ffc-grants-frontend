module.exports = async function (msg, fileCreatedReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(body)
    await fileCreatedReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await fileCreatedReceiver.abandonMessage(msg)
  }
}
