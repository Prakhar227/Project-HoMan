const mongoose = require('mongoose');
const { Schema } = mongoose;

// const ImageSchema = new Schema({
//     url: String,
//     filename: String
// })
const ImageSchema = new Schema({
    url: String,
    filename: String
})
const studentSchema = new Schema({
    name: String,
    image: [ImageSchema],
    admno: String,
    phone: Number,
    address: String
})

module.exports = mongoose.model('Student',studentSchema);