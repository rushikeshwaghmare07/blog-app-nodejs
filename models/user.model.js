const { createHmac, randomBytes } = require("crypto");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type:String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    },
    profileImageURL: {
      type: String,
      default: "./images/default-image.png"
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    }
  }, {timestamps: true}
);

userSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(10).toString();
  const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

  this.salt = salt;
  this.password = this.password;

  next();
})

const User = mongoose.model("user", userSchema);

module.exports = User;
