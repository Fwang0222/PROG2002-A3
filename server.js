// Import the required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const eventAPI = require('./controllerAPI/events-controller');
const categoryAPI = require('./controllerAPI/categories-controller');

// Introduce the API controller
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// add static resources
app.use(express.static(path.join(__dirname, 'public')));

// add api routes
app.use('/api/categories', categoryAPI);
app.use('/api/events', eventAPI);

// add 404 processing pages
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// start server and listen 3060 port
app.listen(3060, () => console.log('Server up on 3060'));
