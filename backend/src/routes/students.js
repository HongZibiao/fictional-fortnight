const express = require('express');
const { getStudents, createStudent, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getStudents);
router.post('/', protect, createStudent);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, deleteStudent);

module.exports = router;