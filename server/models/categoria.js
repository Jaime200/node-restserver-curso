const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let categoriaSchema = new Schema({
 descripcion: {
                 type: String, 
                 unique: true, 
                 required: 
                 [true, 'La descripción es obligatoria'] 
                },
 usuarios: { 
            type: Schema.Types.ObjectId, 
            ref: 'usuarios'
          }
});
module.exports = mongoose.model('Categoria', categoriaSchema);