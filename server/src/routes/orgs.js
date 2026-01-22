const express = require('express');
const router = express.Router();
const OrganizationController = require('../controllers/workspace/OrganizationController');
const authenticateUser = require('../middleware/authenticateUser');

router.post('/', OrganizationController.createOrg);
router.get('/', OrganizationController.listOrgs);
router.put('/:id', authenticateUser, OrganizationController.updateOrg);

module.exports = router;
