const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

const router = express.Router();

// routes are protecte to manager
router.use(authController.protect);
router.use(authController.restrictTo('manager'));

router
    .route('/')
    .get(projectController.getAllProjects)
    .post(projectController.createProject);

router
    .route('/:id')
    .get(projectController.getProject)
    .patch(projectController.updateProject)
    .delete(projectController.deleteProject);

module.exports = router;