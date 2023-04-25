const mongoose= require('mongoose');
const env = require('./environment');
mongoose.connect(`mongodb://0.0.0.0:27017/${env.db}`);

const db= mongoose.connection;

db.on('error', console.error.bind(console,"error connecting to database"));

db.once('open', function(){
	console.log('connected to DB:: MonngoDB');

})

module.exports=db;