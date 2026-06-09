const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: /^[6-9]\d{9}$/
  },
  company: { type: String, default: "" },
  password: { type: String, required: true },
  profileImage: {
    type: String,
    default: ""
  },
  interests: { type: [String], default: [] },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Business' }]
}, { timestamps: true });

ClientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

ClientSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.models.Client || mongoose.model("Client", ClientSchema);
