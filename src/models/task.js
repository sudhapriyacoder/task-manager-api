const mongoose = require("mongoose");
const becrypt = require("bcryptjs");

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },

    completed: {
       type: Boolean,
       default: false,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
},{
    timestamps: true
});


const Task = mongoose.model("Tasks", taskSchema);
module.exports= Task;