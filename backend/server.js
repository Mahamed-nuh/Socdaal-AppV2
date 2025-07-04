const express = require('express');
require('dotenv').config();
const cors = require('cors');
const busRoutes = require('./routes/Buses')
const mongoose = require('mongoose');
const ticketRoutes = require('./routes/Tickets');
const userRoutes = require('./routes/User');

//express app
const app = express();


// ✅ Enable CORS
app.use(cors());

//middleware
app.use(express.json()); // to parse JSON bodies

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//routes

app.use('/api/buses', busRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);


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

