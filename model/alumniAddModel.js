const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        // unique: true
    },
    phone: {
        type: Number
    },
    
    highestQualification:{ 
        type: String
    },
  
    course:{
        type:String
    },

    batch:{
        type:String
    },
    placementStatus:{
        type:String
    },
    // CompanyName :{
    //     type:String
    // },
    password :{
        type: String
    },
    confirmed:{
        type : Boolean,
        default : false
    }
});

const alumniAddModel = mongoose.model(
    "alumniAddModel", alumniSchema
)

module.exports = {alumniAddModel}