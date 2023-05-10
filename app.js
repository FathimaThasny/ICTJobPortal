const express = require('express')
const cors = require('cors')
const nodemailer = require("nodemailer");
const bodyparser = require('body-parser')
const { employeeModel } = require('./model/employee')
const { jobModel } = require('./model/jobpost')
const {alumniAddModel} = require('./model/alumniAddModel');
const { alumniResponseModel } = require('./model/alumniResponseForm');
const jwt = require("jsonwebtoken")
const app = express()

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
const path = require('path');
app.use(express.static(path.join(__dirname,'/build')));

require('./database/connection.js') //database connection





//===========================================================ADMIN SIDE CODES==============================================================


//---------add employee----------(modify)
app.post('/api/addemployee', async(req,res)=>{
    
    let data = new employeeModel(req.body)
    data.save()
    res.json({status : "Registration Successfull. Please wait for the Conformation From Admin"})
    
})


//---------view employee---------
app.post('/api/viewemployee', async(req,res)=>{

    let data = await employeeModel.find()
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
            res.json(data)

        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )

})

//---------view Single employee---------
app.post('/api/viewaemployer', async(req,res)=>{

    let data = await employeeModel.findById(req.body)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
            res.json(data)

        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )

})


//---------edit employee----------
app.post('/api/editemployee', async (req,res)=>{
    console.log(req.body._id)
    let data = await employeeModel.findOneAndUpdate({"_id":req.body._id},req.body)
    console.log(data)

    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {

            res.json({status : 'Data Updated'})

        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )

})


//---------delete employee---------
app.post('/api/deleteemployee', async(req,res)=>{

    let data = await employeeModel.findByIdAndDelete(req.body)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            res.json({status : 'Data Deleted'})

        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )

})


//----------view employer conformation--------
app.post('/api/pendingemployer',async(req, res)=>{

    let data = await employeeModel.find()
    console.log("first")
    let newarray = data.filter(item=> item.confirmed===false)

    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            res.json(newarray)
        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
    
})

//----------view alumni conformation--------
app.post('/api/pendingalumni',async(req, res)=>{

    let data = await alumniAddModel.find()
    console.log("first")
    let newarray = data.filter(item=>item.confirmed===false)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            res.json(newarray)
        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
})

//-----------verifying employer----------
app.post('/api/verifyemployer', async(req,res)=>{
    console.log(req.body)
    let data = await employeeModel.findOneAndUpdate({"_id":req.body._id},req.body)
    console.log("data in server")
    console.log(data)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            sendConfirmationEmail(
                data.personname,
        data.personalmail,
        data.password
         );
         res.json({status : 'Account Verified'})        
        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
    

})

//------------verifying alumni------------
app.post('/api/verifyalumni', async(req,res)=>{
    console.log(req.body)
    let data = await alumniAddModel.findOneAndUpdate({"_id":req.body._id},req.body)
    console.log("data in server")
    console.log(data)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            sendConfirmationEmail(
                data.name,
                data.email,
                data.password
         );
         res.json({status : 'Account Verified'})        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
    
})

//----------------mail using nodemailer------------------
const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "fathimathasny4@gmail.com",
      pass: "eesmmebkmejafbud"
    },
  });
  const sendConfirmationEmail = (name, email, password) => {
    console.log("Check");
    transport.sendMail({
      from: "fathimathasny4@gmail.com",
      to: email,
      subject: "Account Verified!",
      html: `<h1>Welcome!</h1>
          <h2>Hello ${name}</h2>
          <p>Your Account has been Verified by Admin.</p>
          <p> You can Sign In using following Credentials...</p>
          <p>Username: ${email}</p>
          <p>password: ${password}</p>
          </div>`,
    }).catch(err => console.log(err));
  };


//========================================================EMPLOYER SIDE CODES================================================================

//-------employer login------------
app.post('/api/employlogin',async(req,res)=>{
   
    let mail=req.body.personalmail
    let password=req.body.password

    if(mail === "ictakadmin@gmail.com"){
        if(password === "ICT@admin2023"){
            jwt.sign({email:mail,id:"admin"},"ictakjob",{expiresIn:"1d"},
            (err,token)=>{
                console.log("token generating")
                if(err){
                    res.json({status:"Token not generated"})
                }
                else{
                     res.json({status : 'Login Successful as ADMIN',token:token,data:mail})
                     console.log(token)
            console.log("inside admin")
                }
        })
            
        }
        else{
            res.json({status:"Password Incorrect"})
        }
    }
    else{

    let user = await employeeModel.findOne({personalmail : mail})
    console.log(user)
    // console.log(user.password)
    console.log(password)
    
    if((!user)){
        res.json({msg: "User not found"})  
    }
    try{
        if (user.confirmed === false) {
            
             res.json({ msg : "Pending Account. Please Wait for Admin conformation"})
           
          }
        else if(user.password===password){
            jwt.sign({email:mail,id:user._id},"ictakjob",{expiresIn:"1d"},
            (err,token)=>{
                console.log("token generating")
                if(err){
                    res.json({msg:"Token not generated"})
                }
                else{
            res.json({msg:"login successful",token:token,data:user})
            console.log(token)
                }
            })            
        }else{
            res.json({msg:"login failed"})
        }}catch(error){
            res.status(400).json({
                message:"An error occured",
                error: error.message
            })
        }
    }
    }
    
)  


//posting job psoting into db
app.post('/api/newjobpost',async(req,res)=>{
    let data =new jobModel(req.body)
    console.log(data)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {   
            data.save()
            res.json({status:"Success"})
        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
   
})


//getting job posting from db
app.post('/api/viewalljobs', async(req,res)=>{
    let data=await jobModel.find()
    res.json(data)
})

//--------getting single job post-----------
app.post('/api/viewsinglejob', async(req,res)=>{
    let data=await jobModel.findOne(req.body)
    res.json(data)
})


//----------------------delete a job-------------
app.post('/api/deletejob', async (req,response)=>{
    let data=await jobModel.findByIdAndDelete(req.body)
    console.log(data)
    console.log("entering delete")
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {   
            response.json({status:"Job Deleted"})
        }
        else{
            response.json({status : "Unauthorized User"})
        }
    }
    )
})

//--------------search a job-----------
app.post('/api/searchjobfield', async(req,res)=>{
    // const filters = req.body;
    console.log(req.body)
    let data = await jobModel.find(req.body)
    console.log(data)
//   const filteredUsers = data.filter(user => user.field === req.body )
  res.send(data);
})


//update job posting
app.post('/api/updatejob',async (req,res)=>{
    let data=await jobModel.findOneAndUpdate({"id":req.body.id}, req.body)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            res.json(data)
        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
})

//----------------employer password Update-------------
app.post('/api/employupdatepassword', async(req,res)=>{
    console.log("inside password Update")
    console.log(req.body)
    let data=await employeeModel.findOneAndUpdate({"id":req.body._id}, req.body)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            // res.json(data)
            res.json({status : "Password Updated"})

        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )

})

//------------employers job post--------)(modify)
app.post('/api/employersjobs', async(req,res)=>{
    let usermail = req.body
    console.log(usermail)
    let data = await jobModel.find(usermail)
    console.log(data)
    res.json(data)
})


//============================ALUMINI SIDE CODE=================================================================================
//  Register Alumni----(modify)
app.post('/api/alumniregister',async(req,res)=>{
    
    let data =await new alumniAddModel(req.body)
    data.save()
    res.json({msg : 'Registration Successfull. Please wait for the Conformation From Admin'})
    console.log(data)
    console.log("Alumni registration Success")
    
})


//view Alumni
app.post('/api/viewalumni', async(req,res)=>{
try{
    let data = await alumniAddModel.find()
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           console.log("inside viewalumni")
            res.json(data)
        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
}
catch(err){
}

})

//----------delete alumni----------
app.post('/api/deletealumni', async(req,res)=>{

    let data = await alumniAddModel.findByIdAndDelete(req.body)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            res.json({status : 'Data Deleted'})
        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
})

//----------edit alumni--------
app.post('/api/editalumni', async(req,res)=>{
    console.log(req.body)
    let data = await alumniAddModel.findOneAndUpdate(req.body)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {

            res.json({status : 'Data Updated'})
            console.log(data)

        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )

})
// <<<<<<< HEAD
//--------------selecting one alumni----------
app.post('/api/selectAlumni',async(req,res)=>{
    let data = await alumniAddModel.findById(req.body)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            res.json(data)
        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
})

//-------------- alumni login----------
app.post('/api/alumnilogin',async(req,res)=>{
    console.log("hai")
    let email=req.body.email
    let password=req.body.password

    let data = await alumniAddModel.findOne({email : email})
    console.log(data)
    // console.log(user.password)
    console.log(password)

    if((!data)){
        res.json({msg: "Data not found"})  
    }
    try{
        if (data.confirmed === false) {
            
             res.json({ msg : "Pending Account. Please Wait for Admin conformation"})
           
          }
        else if(data.password===password){
            jwt.sign({email:email,id:data._id},"ictakjob",{expiresIn:"1d"},
            (error,token)=>{
                console.log("token generating")
                if(error){
                    res.json({msg:"Token not generated"})
                }
                else{
            res.json({msg:"login successful",token:token,data:data})
            console.log(token)
                }
            }
            )
            
        }else{
            res.json({msg:"login failed"})
        }}catch(error){
            res.status(400).json({
                message:"An error occured",
                error: error.message
            })
        }
    }
    
)  

// ------------alumni update password-------------------

app.post('/api/alumniupdatepassword', async(req,res)=>{
    console.log("inside password Update")
    console.log(req.body)

    let data=await alumniAddModel.findOneAndUpdate({"id":req.body._id}, req.body)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            // res.json(data)
            res.json({status : "Password Updated"})

        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )

})

// ----------------------alumniResponseModel-------------------
app.post('/api/alumniresponseform',async(req,res)=>{
    let data =await new alumniResponseModel(req.body)
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            data.save()
            res.json({status : 'response Added '})
            console.log(data)
            console.log("Alumni Response Added")        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
    

})
// ----------------------------view alumniResponseModel---------
app.post('/api/viewalumniresponseform', async(req,res)=>{

    let data = await alumniResponseModel.find()
    jwt.verify(req.body.token,"ictakjob",
    (error,decoded)=>{
        if(decoded && decoded.email) {
           
            res.json(data)
        }
        else{
            res.json({status : "Unauthorized User"})
        }
    }
    )
    // res.json(data)

})

//---------Server port-----------
app.listen(3256,()=>{

    console.log("Server Running at 3256")
})

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname,'/build/index.html')
    ); 
});

