// TODO: mongoose schema for user
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: String,
  email: String,
  role: String,
  password: String,
});

userSchema.set('toJSON', {
  transform: (doc: any, ret: typeof userSchema) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    delete ret.role;
    delete ret.password;
    delete doc.password;
  },
});

const user = mongoose.model('User', userSchema);
module.exports = user;
export default user;
