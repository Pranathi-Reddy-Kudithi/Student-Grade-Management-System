const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/student_management_system")
.then(()=>{
    console.log('mongodb connected');
})
.catch(()=>{
    console.log('error')
})
const signupSchema=new mongoose.Schema({
    
})