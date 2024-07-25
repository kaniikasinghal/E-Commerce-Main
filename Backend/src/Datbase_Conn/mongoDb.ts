import mongoose, { ConnectOptions, connect } from "mongoose";
const dbConnect = async () => {
    return await mongoose.connect("mongodb+srv://kanikaSinghal:FKrh23uu4ZO95cyE@cluster0.zhxtyyk.mongodb.net/?retryWrites=true&w=majority", {
   
   useNewUrlParser: true, 
   useUnifiedTopology: true 
    } as ConnectOptions).
        then(() => console.log("Database is connected, Successfully")).
        catch((error: any) => console.log("error-->",error))
}

export default dbConnect;

 