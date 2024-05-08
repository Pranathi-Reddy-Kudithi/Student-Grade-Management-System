var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()
const {MongoClient} = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017/student_info');
app.use(bodyParser.json())
app.use(express.static('.'))
app.use(bodyParser.urlencoded({
    extended:true
}))

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
    return res.redirect('/index.html')
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
            res.redirect('/index.html');}
            else{
                res.redirect('./srms_signup.html');
        }
    }
    } catch{
        res.send("wrong details")
    }
});
app.post("/sem1.html",(req,res)=>{
    var lac=req.body.lac;
    var osp=req.body.osp;
    var eng=req.body.eng;
    var oop=req.body.oop;
    var psp=req.body.psp;
    var osplab=req.body.osplab;

    var data={
        "lac":lac,
        "osp":osp,
        "eng":eng,
        "oop":oop,
        "psp":psp,
        "osplab":osplab
    }
    db.collection('marks').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
    console.log(JSON.stringify(db.collection('users').find({},function(result){
        console.log(result);
    })));
        console.log("Record Inserted Successfully");
    });
    return res.redirect('/sem1.html')
})
console.log("Listening to port");