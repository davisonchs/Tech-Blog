const sequelize = require('../config/connection');
const { BlogPost } = require('../models');
const seedBlogPosts = require('./blogPostData.json');

const seedDataBase = async () => {
    await sequelize.sync({ force: true });

    await BlogPost.bulkCreate(seedBlogPosts, {
        individualHooks: true,
        returning: true,
    });
    process.exit(0);
};
seedDataBase();