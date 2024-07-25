import express, { Express } from "express";
import bodyParser from "body-parser";
import rootRouter from "./src/root_router";
import cors from "cors";
import { mysqlConnection } from "./src/Datbase_Conn/sql_db";
import dbConnect from "./src/Datbase_Conn/mongoDb";

const app: Express = express();
const PORT = 3001;

dbConnect();

mysqlConnection.connect((err)=>{
  if(err){
      console.log("Error in db connection: "+JSON.stringify(err,undefined,2));
  }
  else{
      console.log("mysql-db Connected..."); 
  }
})

app.use(cors())

// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());

app.use("/api/v1", rootRouter);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log("Running on Server", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

