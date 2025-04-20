const mongoose=require('mongoose')

 async function ConnectToDb(){
    await mongoose.connect(process.env.MONGO_URL)
    .then(console.log("Connected to Db"))
    .catch(err=>console.log(err))
}

module.exports=ConnectToDb;