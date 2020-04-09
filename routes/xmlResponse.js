const express = require("express");
const router = express.Router();
const {xmlResponse} = require('../controllers/xml')

router.route("/").post(xmlResponse)

module.exports = router;