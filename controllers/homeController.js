// controllers/homeController.js
const path = require('path');
const { Post, User, Comment } = require(path.join(__dirname, '..', 'models'));

const homeController = {
  getHomePage: async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [
          { model: User, attributes: ['username'] },
          { model: Comment, attributes: ['content', 'createdAt'], include: [{ model: User, attributes: ['username'] }] },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.render('home', { posts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = homeController;
