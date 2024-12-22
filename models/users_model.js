const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        unique: true
    },
    email: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: { 
        type: String, 
        required: true
    }
});

userSchema.pre("save", async function (next) {
    const workFactor = 10;
    this.password = await bcrypt.hash(this.password, workFactor);
    next();
});

module.exports = mongoose.model("User", userSchema);