const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const cors = require('cors');
let gitData;
const app = express();

app.use(session({ secret: 'e5f8d604f3fc45e8ba3cc499b435fb45aaa2f6b4-key', resave: true, saveUninitialized: true }));

// Enable CORS for all routes
app.use(cors({ origin: 'https://git-auth-b4j9.onrender.com', credentials: true }));

app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: 'c7a0b7f99db396069e7e',
      clientSecret: 'e5f8d604f3fc45e8ba3cc499b435fb45aaa2f6b4',
      callbackURL: 'https://git-auth-e2ro.onrender.com/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Save user information in session
      return done(null, profile);
    }
  )
);

// Serialize user information to store in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to GitHub Signin API');
});

// GitHub authentication route
app.get('/auth/github', passport.authenticate('github'));

// GitHub callback after authentication

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('https://git-auth-b4j9.onrender.com/user-details');
 gitData = req.user
});

app.get('/gitAccountData', (req, res) => {
  if (gitData) {
    res.json(gitData);
  } else {
    // Handle the case when gitData is not available
    res.status(500).json({ error: 'GitHub user data not available' });
  }
});

// Profile route to display user information after login
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user);
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
