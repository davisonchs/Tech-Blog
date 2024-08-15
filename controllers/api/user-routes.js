

const router = require('express').Router();

const { User, BlogPost, Comment } = require('../../models');



router.post('/signup', async (req, res) => {
    try {
        const userData = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        req.session.save(() => {
            req.session.loggedIn = true;
            res.status(200).json(userData);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});



router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }
        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userId = userData.id;
            res
                .status(200)
                .json({ user: userData, message: 'You are now logged in!' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});



router.get('/dashboard', ensureAuthenticated, (req, res) => {
    if (req.session.loggedIn) {
        const userId = req.session.userId;

        if (userId) {
            BlogPost.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: User,
                        attributes: ['username'],
                    },
                    {
                        model: Comment,
                        attributes: ['content', 'user_id', 'blogPost_id', 'createdAt'],
                        include: {
                            model: User,
                            attributes: ['username'],
                        },
                    },
                ],
            })
                .then(blogPostData => {
                    const blogPosts = blogPostData.map(blogPost => {
                        const serializedBlogPost = blogPost.get({ plain: true });
                        serializedBlogPost.comment = blogPost.Comment?.map(comment => comment.get({ plain: true })) || [];
                        return serializedBlogPost;
                    });


                    res.render('dashboard', { blogPosts, loggedIn: req.session.loggedIn });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Error fetching user posts');
                });
        } else {
            res.status(400).send('User ID not found in session');
        }
    } else {
        res.redirect('/login');
    }
});



function ensureAuthenticated(req, res, next) {
    if (req.session.loggedIn) {
        return next();
    }
    res.redirect('/login');
}



router.get('/:id', async (req, res) => {
    try {
        const blogPostData = await BlogPost.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ],
        });

        if (!blogPostData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        const blogPost = blogPostData.get({ plain: true });
        res.render('single-post', { blogPost, loggedIn: req.session.loggedIn });
    } catch (err) {
        res.status(500).json(err);
    }
});



router.post('/', async (req, res) => {
    try {
        const newPost = await BlogPost.create({
            ...req.body,
            user_id: req.session.userId
        });
        console.log("req.body", req.body);
        console.log('user id', req.session.userId);

        res.status(200).json(newPost);
        console.log("Post created successfully", newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});



router.delete('/:id', async (req, res) => {
    try {
        const blogPostData = await BlogPost.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.userId,
            },
        });

        if (!blogPostData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        res.status(200).json(blogPostData);
    } catch (err) {
        console.log('error', err);
        res.status(500).json(err);
    }
});



router.put('/:id', async (req, res) => {
    try {
        const blogPostData = await BlogPost.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.userId,
            },
        });

        if (!blogPostData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        res.status(200).json(blogPostData);
    } catch (err) {
        res.status(500).json(err);
    }
});



router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});
module.exports = router;