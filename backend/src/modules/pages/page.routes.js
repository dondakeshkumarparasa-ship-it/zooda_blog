const express = require('express');
const { getPage, updatePage } = require('./page.controller');

const router = express.Router();

router.get('/pages/:slug', getPage);
router.put('/pages/:slug', updatePage);

module.exports = router;
