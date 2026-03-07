import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  items: [
    {
      title: String,
      price: Number,
      quantity: Number,
      size: String,
      image: String
    }
  ],

  address: String,
  pincode: String,
  paymentMethod: String,

  orderStatus:{
    type:String,
    default:"Order Placed"
  }

},{timestamps:true});

export default mongoose.model("Order",orderSchema);