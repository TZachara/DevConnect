const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

// Init Express Application
const app = express();
// Connect to database
connectDB();

// Init Middleware -> Body Parser that is included in Express
app.use(express.json({ extended: false }));

// Routes
// app.get('/', (req, res) => {
//     res.send('API initialied');
// });
// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set Static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
    });
}

// Create Port and Add Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});
