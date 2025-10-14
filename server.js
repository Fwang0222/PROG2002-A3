// Import the required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();
const eventAPI = require('./controllerAPI/events-controller');
const categoryAPI = require('./controllerAPI/categories-controller');
const registrationAPI = require('./controllerAPI/registrations-controller');

// Middleware that can be used to enable CORS
app.use(cors());

// Introduce the API controller
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// add static resources
app.use(express.static(path.join(__dirname, 'public')));

// add api routes
app.use('/api/categories', categoryAPI);
app.use('/api/events', eventAPI);
app.use('/api/registrations', registrationAPI);

// add 404 processing pages
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// start server and listen 3060 port
app.listen(3060, () => console.log('Server up on 3060'));
