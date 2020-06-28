const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('server is up and running')
})

// router.get('*', (req, res) => {
//     res.send('server is up and about')
// })

module.exports = router
