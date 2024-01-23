const mongoose =require('mongoose');

const dbConnect = ()=>{
    try{
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log('databse connected is successful'.bgMagenta.white);
    }catch(error){
        console.log(`Error in MongoDb ${error}`.bgRed.white)
    }
}

module.exports = dbConnect;