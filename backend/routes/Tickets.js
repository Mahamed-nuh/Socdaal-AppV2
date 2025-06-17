const express = require('express');
const { getTicketsByUserId, createTicket, getBookedSeatsByBusDetails, deleteTicket, updateTicket } = require('../controllers/ticketController');  


const router = express.Router();


// Get booked seats by bus details
router.get('/booked-seats', getBookedSeatsByBusDetails);


// Get all tickets by userId
router.get('/:userId', getTicketsByUserId);


// Create a new ticket
router.post('/', createTicket);


// Delete a ticket by id and userId
router.delete('/:id', deleteTicket);


// Update a ticket by id
router.patch('/:id', updateTicket);

module.exports = router;
