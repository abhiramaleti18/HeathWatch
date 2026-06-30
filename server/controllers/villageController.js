const Village = require("../models/Village")

exports.getVillages = async (req, res) =>{
    try{
        const villages = await Village.find()
        res.status(200).json({success: true, count: villages.length, villages})
    }
    catch(error){
        res.status(500).json({message: "Server error", error : error.message})
    }
}

exports.createVillage = async (req,res) =>{
    try{
        const village = await Village.create(req.body)
        res.status(201).json({succes: true, village})
    }
    catch(error){
        res.status(500).json({message: "Server error", error : error.message})
    }
}

exports.updateVillage = async (req, res) =>{
    try{
        const village = await Village.findByIdAndUpdate(req.params.Id, req.body,{
            new: true,
            runValidators: true
        })
        if(!village)    res.status(404).json({message: "Village not found"})
        res.status(200).json({success: true, village})
    }
    catch(error){
        res.status(500).json({message: "Server error", error : error.message})
    }
}

exports.getVillage = async (req,res)=>{
    try{
        const village = Village.findById(req.params.Id)
        if(!village)    res.status(404).json({messgae: "Village not found"})
        res.status(200).json({success: true, village})
    }
    catch(error){
        res.status(500).json({message: "Server error", error : error.message})
    }
}