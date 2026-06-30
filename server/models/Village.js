const mongoose = require ("mongoose")

const villageSchema = new mongoose.Schema({
    villageName:{
        type: String,
        required: [true, "Village name is required"],
        trim: true
    },
    district:{
        type: String,
        required: [true, "District name is required"],
        trim: true
    },
    state:{
        type: String,
        required: [true, "State is required"],
        trim: true
    },
    population:{
        type: Number,
        default: 0
    },
    latitude:{
        type: Number,
        required: [true, "Latitude is required"]
    },
    longitude:{
        type: Number,
        required: [true, "Longitude is required"]
    }
},{timestamps: true})

module.exports = mongoose.model("Village", villageSchema)