module.exports = {
    method: 'GET',
    path: '/answers',
    handler: async (request, h) => {
        return h.view('answers', {
            output: {
                titleText: 'MEDIUM FIT'
            }
        })
    }
}
