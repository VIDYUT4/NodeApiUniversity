var mongoose = require('mongoose'); 
var uniqueValidator = require('mongoose-unique-validator'); 
const UserSchema = new mongoose.Schema({

  username: {
      trim: true,
      type: String,
      unique: true,
      required: true,
      //match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  email: {
      trim: true,
      type: String,
      unique: true,
      required: true,
      match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  empId: { 
    type: Number, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  fullName: {
      trim: true,
      type: String,
      required: true
  },
  
  phoneNumber: {
      trim: true,
      type: Number,
      required: true
  },
  designation: {
    trim: true,
    type: String,
    required: true
  },
  dob: {
    trim: true,
    type: String,
    required: true
  },
  doj: {
    trim: true,
    type: String,
    required: true
  },
  gender: {
    trim: true,
    type: String,
    required: true
  },
  reportingManagerId: {
    trim: true,
    type: String,
    required: true
  },
  userType: {
    trim: true,
    type: String,
    required: true
  },

  // userRights: { type: mongoose.Schema.Types.ObjectId, ref: 'tblUserRights' },
  // companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'tblCompanies' },
  // isArchived: {
  //     type: Boolean,
  //     required: true,
  //     default: false
  // },
  // isResetPassword: {
  //     type: Boolean,
  //     required: true,
  //     default: false
  // },
  // resetToken: {
  //     trim: true,
  //     type: String,
  // },
  // IsUserLocked: {
  //     type: Boolean,
  //     required: true,
  //     default: false
  // },
  // tokenExpireTime: {
  //     type: Date
  // }
},{
  timestamps: true
});
//UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });
// mongoose.model('User', UserSchema);

module.exports = mongoose.model('User', UserSchema);