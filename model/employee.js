const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema(
    {
        company : {
            type : String,
            required : true
        },
        companyemail : {
            type : String,
            required : true
        },
        website : {
            type : String,
            required : true
        },
        address : {
            type : String
        },
        district : {
            type : String,
            required : true
        },
        state : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        personname : {
            type : String,
            required : true
        },
        personalmail : {
            type : String,
            // unique: true,
            required : true
        },
        designation : {
            type : String,
            required : true
        },
        personalnumber : {
            type : Number,
            required : true
        },
        password : {
            type : String
        },
        confirmed : {
            type : Boolean,
            default : false
        }
    }
)

const employeeModel = mongoose.model(
    "employeerecords", employeeSchema
)

module.exports = {employeeModel}