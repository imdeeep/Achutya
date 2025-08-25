const express = require('express');
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlog,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs
} = require('../controllers/blogController');
const { isAdmin } = require('../middleware/auth');


router.post('/', isAdmin, createBlog);
router.get('/featured', getFeaturedBlogs);
router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlog);
router.put('/:id', isAdmin, updateBlog);
router.delete('/:id', isAdmin, deleteBlog);

module.exports = router;
