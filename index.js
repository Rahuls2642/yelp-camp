const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate=require('ejs-mate')
const methodOverride=require("method-override")
const expressError=require('./utils/ExpressError')
const catchAsync=require('./utils/catchAsync')
const campgroundSchema=require('./schemas')

const campgroud = require("./models/campgroud");
const ExpressError = require("./utils/ExpressError");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected");
});
const app = express();
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const validateSchema=(req,res,next)=>{
 
const {error}=campgroundSchema.validate(req.body)
if(error){
 
  const msg=error.details.map(er=>er.message).join(',')
  throw new expressError(msg,403)
}
else{
  next()
}
}

app.get('./',(req,res)=>{
  res.render('home')
})
app.get("/campgrounds", catchAsync(async (req, res) => {
  const campgrou=await campgroud.find({})
  res.render('index',{campgrou})
}));
app.get("/campgrounds/new",(req,res)=>{
  res.render('new')
})

app.get("/campgrounds/:id",catchAsync(async (req,res)=>{
  const campgro=await campgroud.findById(req.params.id)
  res.render('show',{campgro})

}))
app.post("/campgrounds", validateSchema,catchAsync(async (req,res,next)=>{


  const campgr=new campgroud(req.body)
  await campgr.save()
  res.redirect(`/campgrounds/${campgr._id}`)
  }
))
app.get('/campgrounds/:id/edit',catchAsync(async (req,res)=>{
  const campground=await campgroud.findById(req.params.id)
  res.render('edit',{campground})

}))
app.put("/campgrounds/:id",validateSchema,catchAsync(async(req,res)=>{
  const {id}=req.params
  const campground=await campgroud.findByIdAndUpdate(id,{...req.body})
  res.redirect(`/campgrounds/${campground._id}`)
  
}))
app.delete('/campgrounds/:id', catchAsync(async (req,res)=>{
  const { id } = req.params;
  await campgroud.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));
app.all('/',(req,res,next)=>{
  next(new ExpressError('page not found',404))
})
app.use((err,req,res,next)=>{
  const {statusCode=500,message='something went wrong'}=err
  res.status(statusCode).render('error',{err})
})
app.listen(3000, () => {
  console.log("server statred");
});
