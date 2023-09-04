require('dotenv').config();

const mongoose = require('mongoose');

const connectionStr = "mongodb+srv://mosmos:ZJgvipGiEzLSwSz4@cluster0.bshlqnk.mongodb.net/PureView?retryWrites=true&w=majority";

mongoose.connect(connectionStr, {useNewUrlparser: true})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))

mongoose.connection.on('error', err => {
  console.log(err)
})  