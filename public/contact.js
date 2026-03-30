const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/",(req,res)=>{

const {name,email,message}=req.body;

const sql="INSERT INTO messages(name,email,message) VALUES (?,?,?)";

db.query(sql,[name,email,message],(err,result)=>{

if(err){
res.status(500).send(err);
}else{
res.send("Message Sent Successfully");
}

});

});

router.get("/", (req,res)=>{

const sql="SELECT * FROM messages ORDER BY id DESC";

db.query(sql,(err,result)=>{

if(err){
res.status(500).send(err);
}else{
res.json(result);
}

});

});

module.exports=router;