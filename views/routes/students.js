const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const Student = require('../models/student');
const {isLoggedIn} = require('../middleware');

router.get('/', async(req,res)=>{
    const students= await Student.find({});
    // console.log(students);
    res.render('students/index',{ students });
})
router.get('/new',isLoggedIn ,(req,res)=>{
    
    res.render('students/new');
})
router.post('/',isLoggedIn,upload.array('image'),async(req,res)=>{
    const stud=new Student(req.body.student);
    await stud.save();
    // res.send(stud);
    res.redirect(`students/${stud._id}`);
})

router.get('/:id',isLoggedIn , async(req,res)=>{
    const student=await Student.findById(req.params.id);
    res.render('students/show',{ student });
})

router.delete('/:id',isLoggedIn , async(req,res)=>{
    const {id}=req.params;
    await Student.findByIdAndDelete(id);
    res.redirect('/students');
})
module.exports = router;