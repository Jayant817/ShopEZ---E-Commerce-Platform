import mongoose from "mongoose"

const productSchema = new mongoose.Schema({

 title:String,
 description:String,
 mainImg:String,

 carousel:[
  {type:String}
 ],

 sizes:[
  {type:String}
 ],

 category:String,
 gender:String,

 price:Number,
 discount:Number

})

export default mongoose.model("Product",productSchema)