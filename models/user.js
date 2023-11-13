const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: String,
  userName: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});
userSchema.plugin(uniqueValidator);

mongoose.set("toJSON", {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
    delete returnObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
