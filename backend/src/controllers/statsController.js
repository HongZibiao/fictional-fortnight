const Student = require('../models/Student');
const Course = require('../models/Course');
const Class = require('../models/Class');

// 学生统计
const getStudentStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const studentsByGender = await Student.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);
    const studentsByAge = await Student.aggregate([
      { $group: { _id: '$age', count: { $sum: 1 } } }
    ]);
    const studentsByGrade = await Student.aggregate([
      { $group: { _id: '$grade', count: { $sum: 1 } } }
    ]);

    res.json({
      totalStudents,
      studentsByGender,
      studentsByAge,
      studentsByGrade
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 课程统计
const getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const coursesByLevel = await Course.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);
    const coursesByCategory = await Course.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const averageCoursePrice = await Course.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);

    res.json({
      totalCourses,
      coursesByLevel,
      coursesByCategory,
      averageCoursePrice: averageCoursePrice[0]?.avgPrice || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 班级统计
const getClassStats = async (req, res) => {
  try {
    const totalClasses = await Class.countDocuments();
    const classesByCourse = await Class.aggregate([
      { $group: { _id: '$courseId', count: { $sum: 1 } } }
    ]);
    const averageClassSize = await Class.aggregate([
      { $project: { studentCount: { $size: '$studentIds' } } },
      { $group: { _id: null, avgSize: { $avg: '$studentCount' } } }
    ]);

    res.json({
      totalClasses,
      classesByCourse,
      averageClassSize: averageClassSize[0]?.avgSize || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 财务统计
const getFinanceStats = async (req, res) => {
  try {
    const courses = await Course.find();
    const students = await Student.find();

    let totalRevenue = 0;
    students.forEach(student => {
      student.enrolledCourses.forEach(enrollment => {
        const course = courses.find(c => c._id.toString() === enrollment.courseId.toString());
        if (course) {
          totalRevenue += course.price;
        }
      });
    });

    res.json({
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudentStats, getCourseStats, getClassStats, getFinanceStats };