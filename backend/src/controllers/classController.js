const Class = require('../models/Class');

// 获取班级列表
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('courseId').populate('teacherId').populate('studentIds');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 创建班级
const createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取班级详情
const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate('courseId').populate('teacherId').populate('studentIds');
    if (!classData) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新班级信息
const updateClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除班级
const deleteClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getClasses, createClass, getClassById, updateClass, deleteClass };