
const mongoose = require("mongoose");
const cities=require('./cities.js')
const {places,descriptors}= require('./seedHelpers.js')
const campgroud = require('../models/campgroud')

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected");
});

const sample=array=>array[Math.floor(Math.random()*array.length)];

const seedDb=async ()=>{
    await campgroud.deleteMany({})
    for(let i=0; i<50;i++){
        const random= Math.floor(Math.random()*1000)+1
       const camp= new campgroud({
            location:`${cities[random].city},${cities[random].state}`,
            title:`${sample(descriptors)},${sample(places)}`
        })
        await camp.save()
    }
}

seedDb().then(()=>{
    mongoose.connection.close()
})