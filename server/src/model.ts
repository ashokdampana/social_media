import mongoose from 'mongoose';

// Users
const mongoUserSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['userrole', 'adminrole'], 
    default: 'userrole' // Fixed: must match one of the enum values
  },
}, { timestamps: true });

export const UserModel = mongoose.model('User', mongoUserSchema);


// Comments
const mongoCommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Fixed: proper ObjectId type
    ref: 'User',                           // Links to UserModel
    required: true 
  },
  postId: { 
    type: mongoose.Schema.Types.ObjectId, // Fixed: proper ObjectId type
    ref: 'Post',                           // Links to PostModel
    required: true 
  }
}, { timestamps: true });

export const CommentModel = mongoose.model('Comment', mongoCommentSchema);


// Posts
const mongoPostSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Fixed typo: 'requried' -> 'required'
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

export const PostModel = mongoose.model('Post', mongoPostSchema);
