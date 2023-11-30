// server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const routes = require('./routes');
const { User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set up sessions
const sess = {
  secret: 'your-secret-key',
  cookie: {
    maxAge: 60000, // Set your desired session timeout in milliseconds
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Set up Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy for authenticating with username and password
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username } });

        if (!user || !user.checkPassword(password)) {
          return done(null, false, { message: 'Invalid username or password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user information to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user information to retrieve from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Use routes
app.use(routes);

// Sync sequelize models and start the Express app
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
