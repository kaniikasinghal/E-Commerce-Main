import { Schema, model } from "mongoose";

interface Payment{
    Transaction_id:string
    Buyer_email:string
    productname:string
    price: number
    desc: string;
}

const paymentSchema=new Schema<Payment>({
    Transaction_id:{
      type:String,
      required: true
    },
    Buyer_email: {
        type: String,
        required: true
    },
    productname: {
        type: String,
        required: true,
      },
    price: {
        type: Number,
        required: true,
    },
    desc:{
        type:String,
        required: true,
    },
})

const paymentModel=model<Payment>("payment",paymentSchema);
export default paymentModel;