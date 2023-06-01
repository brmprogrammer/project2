const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

// Route to Homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

// Route to Sign Up Page
app.use(express.static(path.join(__dirname, 'css')));
app.get('/signUp', (req, res) => {
    res.sendFile(__dirname + '/static/signUp.html');
});

app.use(require('./interestingFacts.js'), (req, res, next) => {
    next();
});
app.post('/signUp', require('./sendMessage.js'));

const port = 3000 // Port we will listen on


// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));

module.exports = app;