const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load User Model
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');

// Load Keys
const keys = require('./config/keys');

// Mongoose Connect
mongoose.connect(keys.mongoURI, {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//passport.sesssion() requires express session

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  //if user is authenticated and has successfully passed through passport authentication, the user object from passport google oauth 2.0 that is inside req.user is stored into a global response variable called user
  next()
})

// Use Routes
app.use('/', index);
app.use('/auth', auth);
//Routes need to be placed at the bottom to include all the middleware

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
