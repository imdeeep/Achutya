const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['paragraph', 'image', 'list', 'quote', 'link', 'section', 'subsection']
    },
    title: String, // for sections/subsections
    text: String,  // for paragraphs, quotes, links
    url: String,   // for images and links
    alt: String,   // for image accessibility
    caption: String, // optional for images
    style: {
        type: String,
        enum: ['ordered', 'unordered']
    },
    items: [String], // for lists
    content: [this] // recursive content (for sections/subsections)
}, { _id: false });

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false });

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
    author: {
        type: String,
        default: 'Admin'
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
    heroImage: {
        url: { type: String },
        alt: { type: String }
    },
    content: [contentBlockSchema],
    faq: [faqSchema],
    tags: [String],
    category: String,
    relatedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    seo: {
        title: String,
        description: String,
        keywords: [String]
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Archived'],
        default: 'Draft'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

blogsSchema.index({ title: 'text', 'content.text': 'text' });

const Blog = mongoose.model('Blog', blogsSchema);

module.exports = Blog;
