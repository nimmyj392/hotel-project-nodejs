const mongoose = require("mongoose"),
    Schema = mongoose.Schema

const tableSchema = new Schema({

    name: {
        type: String
    },

    status: {

        type: String
    },
    image: {
        type: Number,
        default: null
    },
    
    // preparedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Chef',
    //     required: true
    // },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;