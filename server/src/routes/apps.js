const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/console/ApplicationController');

router.post('/', ApplicationController.createApp);
router.get('/', ApplicationController.listApps);
router.get('/:id', ApplicationController.getApp);

module.exports = router;
