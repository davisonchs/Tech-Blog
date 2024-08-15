const User = require('./users');
const BlogPost = require('./blogs')
const Comment = require('./comments');


User.hasMany(BlogPost, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

BlogPost.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

BlogPost.hasMany(Comment, {
    foreignKey: 'blogPost_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

module.exports = { User, BlogPost, Comment };