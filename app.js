if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

const express=require('express');
const mongoose=require('mongoose');
const session= require('express-session');
const flash= require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const multer = require('multer');
const { storage } = require('./cloudinary');
const upload = multer({ storage });
const passport = require('passport');
const LocalStrategy = require('passport-local'); 
const User=require('./models/user');

const app=express();
const path =require('path');

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs',ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); 


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/HoMan');
  console.log("connected");

}

const userRoutes=require('./routes/users');
const studentRoutes=require('./routes/students');
const Student=require('./models/student');

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true, 
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7 
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/', userRoutes);
app.use('/students',studentRoutes)

app.get('/',(req,res)=>{
    res.render('home');
})
// app.get('/students',async(req,res)=>{
//     const students= await Student.find({});
//     // console.log(students);
//     res.render('students/index',{ students });
    
// })
// app.post('/students',upload.array('image'),async(req,res)=>{
//     res.send(req.body)
// })
 
// app.use((err,req,res) =>{
//     res.send("error");
// })
app.post('/students', async(req,res)=>{
    res.send(req.body);
})
// app.get("/mk",async(req,res)=>{
//     const std=new Student({name:'pk',admno:'12we01',phone:123456});
//     await std.save();
//     res.send(std);
// })


app.listen(1000, ()=>{
    console.log('Serving on port 1000');
})