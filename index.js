const express = require('express');
const port = 3001;
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection string
const connectionString = 'mongodb+srv://PrathamRajbhar:PrathamRajbhar@cluster0.5c9zh.mongodb.net/test';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Define the schema to match your data structure
const projectSchema = new mongoose.Schema({
    thumbnail: String,
    title: String,
    description: String,
    github: String,
    demo: String,
    isBlog: Boolean,
}, { collection: 'projectslist' });

// Create the model using the schema
const Project = mongoose.model('Project', projectSchema);

// Route to handle form submission from /getData
app.post('/getData', async (req, res) => {
    try {
        // Extract data from the request body
        const { thumbnail, title, description, github, demo, isBlog } = req.body;

        // Create a new project instance using the submitted form data
        const newProject = new Project({
            thumbnail,
            title,
            description,
            github,
            demo,
            isBlog: isBlog === 'true',  // Handle string conversion to Boolean
        });

        // Save the new project in the database
        await newProject.save();

        // Redirect to a success page after submission
        res.redirect('/success');
    } catch (error) {
        console.error('Error saving project:', error);
        res.status(500).send('Server error');
    }
});

// Success page route
app.get('/success', (req, res) => {
    res.send('Project successfully added to the database!');
});

// Basic route to serve the form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/contact.html');
})

app.get('/projects', async (req, res) => {
    try {
        // Fetch all projects from the database
        const projects = await Project.find({});

        // Send the projects as a JSON response
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
