const express = require('express');
const Ticket = require('../models/ticketModel');



// Get all tickets by userId
const getTicketsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const tickets = await Ticket.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new ticket
const createTicket = async (req, res) => {
    const { userId, userName, company, from, to, busTime, busDate, paymentMethod, bookedNumber } = req.body;
    try {
        const ticket = await Ticket.create({ userId, userName, company, from, to, busTime, busDate, paymentMethod, bookedNumber });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get booked seats by bus details
const getBookedSeatsByBusDetails = async (req, res) => {
    const { company, busTime, from, to, busDate } = req.query;
    try {
        const tickets = await Ticket.find({ company, busTime, from, to, busDate });
        const bookedSeats = tickets.map(ticket => ticket.bookedNumber);
        res.status(200).json(bookedSeats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a ticket by id and userId
const deleteTicket = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such ticket' });
    }

    try {
        const ticket = await Ticket.findOneAndDelete({ _id: id, userId });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found or you do not have permission to delete it' });
        }
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};  


// update a ticket 
const updateTicket = async (req, res) => {
    const { id } = req.params;
    const { userId, userName, company, from, to, busTime, busDate, paymentMethod, bookedNumber } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such ticket' });
    }
    try {
        const ticket = await Ticket.findByIdAndUpdate
        (id, { userId, userName, company, from, to, busTime, busDate, paymentMethod, bookedNumber }, { new: true });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    getTicketsByUserId,
    createTicket,
    getBookedSeatsByBusDetails,
    deleteTicket,
    updateTicket
    
};