const mongoose = require('mongoose');

const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the blog post'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please provide blog content']
    },
    coverImage: {
        type: String,
        default: ''
    },
    publishedAt: {
        type: Date,
        default: null
    },
    readTime: {
        type: Number,
        min: 1
    },
    featured: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

blogsSchema.index({ title: 'text', content: 'text'});

const Blogs = mongoose.model('Blog', blogsSchema);

module.exports = Blogs