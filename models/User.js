const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String},
    email: { type: String, required: true, unique: true },
    phonenumber: {type: String, required:true},
    password: { type: String }, // Not required for Google users
    gender: { type: String, enum: ["male", "female"] },
    createdAt: {type:Date, default:Date.now},
    authProvider: { type: String, enum: ["local", "google"], default: "local" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
