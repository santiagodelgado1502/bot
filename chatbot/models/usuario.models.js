const mongoose = require("mongoose");
const {Schema} = mongoose;

const UsuarioSchema = new Schema({
    fecha:String,
    informacion:String
});

 module.exports = mongoose.model('usuario',UsuarioSchema);