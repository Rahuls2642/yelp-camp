const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const campgroundSchema=new Schema({
    title:String,
    image:String,
    descriptions:String,
    location:String,
    price:Number
})

module.exports=mongoose.model('Campground',campgroundSchema)