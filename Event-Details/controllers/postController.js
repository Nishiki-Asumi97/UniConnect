// controllers/postController.js
const Post = require('../models/Post');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const { heading, content } = req.body;
  let image = '';

  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  }

  const newPost = new Post({
    heading,
    content,
    image,
  });

  try {
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
