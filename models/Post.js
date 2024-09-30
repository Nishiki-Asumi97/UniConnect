// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  heading: String,
  content: String,
  image: String,
  likes: { type: Number, default: 0 },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
