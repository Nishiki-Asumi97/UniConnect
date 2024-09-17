// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Define routes
router.get('/posts', postController.getPosts);
router.post('/posts', upload.single('image'), postController.createPost);
router.post('/posts/:id/like', postController.likePost);

module.exports = router;
