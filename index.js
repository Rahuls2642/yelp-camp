const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride=require("method-override")

const campgroud = require("./models/campgroud");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected");
});
const app = express();
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('./',(req,res)=>{
  res.render('home')
})
app.get("/campgrounds", async (req, res) => {
  const campgrou=await campgroud.find({})
  res.render('index',{campgrou})
});
app.get("/campgrounds/new",(req,res)=>{
  res.render('new')
})

app.get("/campgrounds/:id",async (req,res)=>{
  const campgro=await campgroud.findById(req.params.id)
  res.render('show',{campgro})

})
app.post("/campgrounds", async (req,res)=>{
  const campgr=new campgroud(req.body)
  await campgr.save()
  res.redirect(`/campgrounds/${campgr._id}`)
})
app.get('/campgrounds/:id/edit',async (req,res)=>{
  const campground=await campgroud.findById(req.params.id)
  res.render('edit',{campground})

})
app.put("/campgrounds/:id",async(req,res)=>{
  const {id}=req.params
  const campground=await campgroud.findByIdAndUpdate(id,{...req.body})
  res.redirect(`/campgrounds/${campground._id}`)
  
})
app.delete('/campgrounds/:id', async (req,res)=>{
  const { id } = req.params;
  await campgroud.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});
app.listen(3000, () => {
  console.log("server statred");
});
