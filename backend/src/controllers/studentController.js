const Student = require('../models/Student');

// 获取学生列表
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('enrolledCourses.courseId');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 创建学生
const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取学生详情
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('enrolledCourses.courseId');
    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新学生信息
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除学生
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, createStudent, getStudentById, updateStudent, deleteStudent };