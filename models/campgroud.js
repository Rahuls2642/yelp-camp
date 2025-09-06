const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const campgroundSchema=new Schema({
    title:String,
    price:String,
    descriptions:String,
    location:String
})

module.exports=mongoose.model('Campground',campgroundSchema)