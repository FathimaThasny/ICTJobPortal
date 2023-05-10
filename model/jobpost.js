const Mongoose = require("mongoose")
const jobSchema  =new Mongoose.Schema(
    {
        titleofrole:{
            type:String,
            required:true
        },
        company:{
            type:String,
            required:true
        },
        place:{
            type:String,
            required:true
        },
        jobtype:{
            type:String,
            required:true
        },
        field:{
            type:String,
            required:true
        },
        email:{
            type : String,
            required: true
        },
        experience:{
            type:String
            // required:true
        },
        salary:{
            type:Number
            // required:true
        },
        description:{
            type:String
            // required:true
        },
        usermail:{
            type:String
        },
        // userId:{
        //     type : Mongoose.Schema.pers, 
        //     ref : 'employeerecords'
        // },
        createdAt : {type: Date, default: Date.now}

    }
)
//model for jobpost
const jobModel = Mongoose.model(
    "jobvacancy", jobSchema
);
module.exports = {jobModel}