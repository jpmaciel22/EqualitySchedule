const express = require('express');
const router = express.Router();

const loginRoutes = require('./routes/loginRoutes')
const medRoutes = require('./routes/medRoutes')

router.use('/login',loginRoutes)
router.use('/med',medRoutes)

module.exports = router;