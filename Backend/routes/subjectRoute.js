const express = require('express');
const { getAllSubjects } = require('../controllers/subjectController');
const router = express.Router();

router.post('/add', getAllSubjects);

export default router;