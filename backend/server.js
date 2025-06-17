const express = require('express');
require('dotenv').config();
const busRoutes = require('./routes/Buses')
const mongoose = require('mongoose');
const ticketRoutes = require('./routes/Tickets');

//express app
const app = express();

//middleware
app.use(express.json()); // to parse JSON bodies

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//routes
app.use('/api/buses', busRoutes);
app.use('/api/tickets', ticketRoutes);

//connect to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to MongoDB and listening on port ${process.env.PORT}`);  
        });

    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

