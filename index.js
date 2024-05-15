
var express = require("express")
require('dotenv').config();
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const nodemailer = require('nodemailer');
const path = require('path');
const app = express()
app.set('view engine','ejs');
app.set('views', path.join(__dirname, '/public/views'));
const {MongoClient} = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017/student_info');
app.use(bodyParser.json())
app.use(express.static('.'))
app.use(bodyParser.urlencoded({
    extended:true
}))

const UserSchema = new mongoose.Schema({
    email: String,
  });

const forgot_pass = mongoose.model('users', UserSchema);
const Schema = mongoose.Schema;

const transporter = nodemailer.createTransport({
    port: 587,
    secure: false,
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
    logger: true,
  });
app.post('/forgot', async (req, res) => {
    const  email = req.body.email;
    try {
      const user = await forgot_pass.findOne({"email":email});
      if (!user) {
        return res.status(404).send('No account found with that email.');
      }
      const token = require("crypto").randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
               http://localhost:3000/reset/${token}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
      await transporter.sendMail(mailOptions);
      res.send('An email has been sent to ' + email + ' with further instructions.');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
const userSchema = new Schema({
    roll:{type:Number,required:true},
    name:{type:String,required:true},
    class:{type:String,required:true},
    section:{type:Number,required:true},
    lac: { type: Number, required: true },
    osp: { type: Number, required: true },
    psp: { type: Number, required: true },
    oop: { type: Number, required: true },
    eng: { type: Number, required: true },
    osplab: { type: Number, required: true }
});

const User = mongoose.model('marks', userSchema);

const userSchema_sem2 = new Schema({
    roll:{type:Number,required:true},
    name:{type:String,required:true},
    class:{type:String,required:true},
    section:{type:Number,required:true},
    denm: { type: Number, required: true },
    chem: { type: Number, required: true },
    bes: { type: Number, required: true },
    oop: { type: Number, required: true },
    chemlab: { type: Number, required: true },
    ce: { type: Number, required: true }
});

const User_sem2 = mongoose.model('marks-sem2', userSchema_sem2);

const userSchema_sem3 = new Schema({
    roll:{type:Number,required:true},
    name:{type:String,required:true},
    class:{type:String,required:true},
    section:{type:Number,required:true},
    dsa: { type: Number, required: true },
    dld: { type: Number, required: true },
    dis: { type: Number, required: true },
    bes: { type: Number, required: true },
    dsalab: { type: Number, required: true },
    icfp: { type: Number, required: true }
});

const User_sem3 = mongoose.model('marks_sem3',userSchema_sem3);

const userSchema_sem4 = new Schema({
    roll:{type:Number,required:true},
    name:{type:String,required:true},
    class:{type:String,required:true},
    section:{type:Number,required:true},
    coa: { type: Number, required: true },
    dbms: { type: Number, required: true },
    flat: { type: Number, required: true },
    ps: { type: Number, required: true },
    wt: { type: Number, required: true },
    ssp: { type: Number, required: true }
});

const User_sem4 = mongoose.model('marks_sem4',userSchema_sem4);

const event_schema=new Schema({
    event_name:{type:String,required:true},
    event_time_from: {type:Date,required:true},
    event_time_to: {type:Date,required:true}
})

const event_mod=mongoose.model('events',event_schema);

const attendance_schema=new Schema({
    student_name:{type:String,required:true},
    student_rollno:{type:String,required:true}
})

const attendance_mod=mongoose.model('attendance',attendance_schema)

mongoose.connect('mongodb://localhost:27017/student_info',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db=mongoose.connection;
db.on('error',()=>console.log('Error in connecting to database'));
db.once('open',()=>console.log("Connected to Database"))
app.get("/",(req,res)=>{
    res.set({
        "Allow-Control-Allow-Origin": '*'
})
return res.redirect('./srms_signup.html');
}).listen(3000);
app.post("/srms_signup",(req,res)=>{
    var user=req.body.user;
    var pass=req.body.pass;
    var repeat_pass=req.body.repeat_pass;
    var email=req.body.email;

    var data={
        "username":user,
        "pass":pass,
        "email":email
    }
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
    console.log(JSON.stringify(db.collection('users').find({},function(result){
        console.log(result);
    })));
        console.log("Record Inserted Successfully");
    });
    return res.redirect('./notindex.html')
})
app.get("/srms_signup.html",async(req,res) =>{
    res.set({
        "Allow-Control-Allow-Origin": '*'
})})
app.post("/srms_signin", async (req, res) => {
    const user_name = req.body.sign_user;
    const user_pass = req.body.sign_pass;
    const userSchema = new mongoose.Schema({
        sign_user: String,
        sign_pass: String
    });
    try {
        const user = await db.collection('users').findOne({ username:req.body.sign_user });
        if(user){
            const result=req.body.sign_pass===user.pass;
            if(result){
            res.redirect('./notindex.html');}
            else{
                res.redirect('./srms_signup.html');
        }
    }
    } catch{
        res.send("wrong details")
    }
});
app.get("/attendance",async(req,res) =>{
    res.set({
        "Allow-Control-Allow-Origin": '*'
})})
app.post("/attendance",(req,res)=>{
    var student_name=req.body.newStudentName;
    var student_rollno=req.body.newStudentRoll;
    console.log(student_name);
    var data={
        "student_name":student_name,
        "student_rollno":student_rollno
    }
    console.log(data);
    db.collection('attendance').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
    console.log(JSON.stringify(db.collection('attendance').find({},function(result){
        console.log(result);
    })));
        console.log("Record Inserted Successfully");
    });
    return res.redirect('/attendance')
})

app.get("/events",async(req,res) =>{
    res.set({
        "Allow-Control-Allow-Origin": '*'
})})
app.post("/events",(req,res)=>{
    var event_name=req.body.event_name;
    var event_time_from=req.body.event_time_from;
    var event_time_to=req.body.event_time_to;

    var data={
        "event_name":event_name,
        "event_time_from":event_time_from,
        "event_time_to":event_time_to
    }
    console.log(data);
    db.collection('events').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
    console.log(JSON.stringify(db.collection('events').find({},function(result){
        console.log(result);
    })));
        console.log("Record Inserted Successfully");
    });
    return res.redirect('/events')
})

app.post("/sem1",(req,res)=>{
    var lac=req.body.lac;
    var osp=req.body.osp;
    var eng=req.body.eng;
    var oop=req.body.oop;
    var psp=req.body.psp;
    var osplab=req.body.osplab;
    var name=req.body.name;
    var roll=req.body.roll;
    var section=req.body.section;
    var class1=req.body.class;

    var data={
        "roll":roll,
        "class":class1,
        "section":section,
        "name":name,
        "lac":lac,
        "osp":osp,
        "eng":eng,
        "oop":oop,
        "psp":psp,
        "osplab":osplab
    }
    console.log(data)
    db.collection('marks').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
    console.log(JSON.stringify(db.collection('users').find({},function(result){
        console.log(result);
    })));
        console.log("Record Inserted Successfully");
    });
    
    return res.redirect('/sem1')
})
app.get('/sem1',async (req,res)=>{
    try {
        const marks = await User.find({}); 
        console.log(marks);
        res.render('sem1', { students: marks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})
app.post("/sem2",(req,res)=>{
    var denm=req.body.denm;
    var chem=req.body.chem;
    var bes=req.body.bes;
    var oop=req.body.oop;
    var chemlab=req.body.chemlab;
    var ce=req.body.ce;
    var name=req.body.name;
    var roll=req.body.roll;
    var section=req.body.section;
    var class1=req.body.class;

    var data={
        "roll":roll,
        "class":class1,
        "section":section,
        "name":name,
        "denm":denm,
        "chem":chem,
        "bes":bes,
        "oop":oop,
        "chemlab":chemlab,
        "ce":ce
    }
    db.collection('marks-sem2').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
    console.log(JSON.stringify(db.collection('marks-sem2').find({},function(result){
        console.log(result);
    })));
        console.log("Record Inserted Successfully");
    });
    
    return res.redirect('/sem2')
})
app.get('/sem2',async (req,res)=>{
    try {
        const marks = await User_sem2.find({}); 
        res.render('sem2', { students: marks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})
app.post("/sem3",(req,res)=>{
    var dis=req.body.dis;
    var dld=req.body.dld;
    var bes=req.body.bes;
    var dsa=req.body.dsa;
    var icfp=req.body.icfp;
    var dsalab=req.body.dsalab;
    var name=req.body.name;
    var roll=req.body.roll;
    var section=req.body.section;
    var class1=req.body.class;

    var data={
        "roll":roll,
        "class":class1,
        "section":section,
        "name":name,
        "dsa":dsa,
        "dis":dis,
        "dld":dld,
        "bes":bes,
        "dsalab":dsalab,
        "icfp":icfp
    }
    db.collection('marks_sem3').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
    console.log(JSON.stringify(db.collection('marks_sem3').find({},function(result){
        console.log(result);
    })));
        console.log("Record Inserted Successfully");
    });
    
    return res.redirect('/sem3')
})
app.get('/sem3',async (req,res)=>{
    try {
        const marks = await User_sem3.find({}); 
        res.render('sem3', { students: marks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})
app.post("/sem4",(req,res)=>{
    var coa=req.body.coa;
    var dbms=req.body.dbms;
    var flat=req.body.flat;
    var wt=req.body.wt;
    var ssp=req.body.ssp;
    var ps=req.body.ps;
    var name=req.body.name;
    var roll=req.body.roll;
    var section=req.body.section;
    var class1=req.body.class;

    var data={
        "roll":roll,
        "class":class1,
        "section":section,
        "name":name,
        "coa":coa,
        "dbms":dbms,
        "ps":ps,
        "wt":wt,
        "flat":flat,
        "ssp":ssp
    }
    db.collection('marks_sem4').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
    console.log(JSON.stringify(db.collection('marks_sem4').find({},function(result){
        console.log(result);
    })));
        console.log("Record Inserted Successfully");
    });
    return res.redirect('/sem4')
})
app.get('/sem4',async (req,res)=>{
    try {
        const marks = await User_sem4.find({}); 
        res.render('sem4', { students: marks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})
// app.listen(5000);
console.log("Listening to port 5000");