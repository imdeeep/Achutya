const express = require('express');
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs
} = require('../controllers/blogController');
const { isAdmin } = require('../middleware/auth');

console.log("Blog Routes Loaded");

router.post('/', isAdmin, createBlog);
router.get('/featured', getFeaturedBlogs);
router.get('/', getBlogs);
router.get('/:id', getBlog);
router.put('/:id', isAdmin, updateBlog);
router.delete('/:id', isAdmin, deleteBlog);

module.exports = router;
