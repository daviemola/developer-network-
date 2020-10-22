const express = require('express')
const router = express.Router()

//@route
//@desc
//@access
router.get('/', (req, res) => {
  res.send('user route')
})

module.exports = router
