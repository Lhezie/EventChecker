import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  dob: Date
});

const User = mongoose.model('User', userSchema);

export default User;
