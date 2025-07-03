const express = require('express');
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { isAdmin } = require('../middleware/auth');


router.post('/', isAdmin, createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlog);
router.put('/:id', isAdmin, updateBlog);
router.delete('/:id', isAdmin, deleteBlog);

module.exports = router;
