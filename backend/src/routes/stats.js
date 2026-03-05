const express = require('express');
const { getStudentStats, getCourseStats, getClassStats, getFinanceStats } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/students', protect, getStudentStats);
router.get('/courses', protect, getCourseStats);
router.get('/classes', protect, getClassStats);
router.get('/finance', protect, getFinanceStats);

module.exports = router;