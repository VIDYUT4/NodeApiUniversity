var mongoose = require('mongoose'); 
var uniqueValidator = require('mongoose-unique-validator'); 
const UserAdminSchema = new mongoose.Schema({
  email: {
      trim: true,
      type: String,
      unique: true,
      required: true,
      match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: { type: String, required: true },
  tokenExpireTime: {
      type: Date
  }
},{
  timestamps: true
});


module.exports = mongoose.model('UserAdmin', UserAdminSchema);