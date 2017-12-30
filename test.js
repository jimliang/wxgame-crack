
const C = require('./')

const sessionId = ''

const c = new C(sessionId)

// c.post('wxagame_getfriendsscore')
//     .then(console.log)

c.settlement({
    score: 10086,
    times: 666,
    game_data: "{}"
})
    .then(console.log)
    .catch(console.warn)