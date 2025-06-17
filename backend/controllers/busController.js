const express = require('express');
const Bus = require('../models/BusModel');


//get all buses
const getBuses = async (req, res) => {
    try {
        const buses = await Bus.find().sort({ busDate: 1 });
        res.status(200).json(buses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//get a single bus by company, busTime, from, to, busDate
const getBusByDetails = async (req, res) => {
    const { company, busTime, from, to, busDate } = req.query;
    try {
        const bus = await Bus.findOne({ company, busTime, from, to, busDate });
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.status(200).json(bus);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }}  


//create a new bus
const createBus = async (req, res) => {
    const { company, busTime, price, durationTime, from, to, busDate, seats } = req.body;
    try {
        const bus = await Bus.create({ company, busTime, price, durationTime, from, to, busDate, seats });
        res.status(201).json(bus);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//update a bus by id
const updateBus = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such bus' });
    }
    const { company, busTime, price, durationTime, from, to, busDate, seats } = req.body;
    try {
        const bus = await Bus.findByIdAndUpdate(id, { company, busTime, price, durationTime, from, to, busDate, seats }, { new: true });
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.status(200).json(bus);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 

//delete a bus by id
const deleteBus = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such bus' });
    }
    try {
        const bus = await Bus.findByIdAndDelete({_id: id})
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.status(200).json({ message: 'Bus deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//get filtered buses
const getFilteredBuses = async (req, res) => {
    const { from, to, busDate } = req.query;
    try {
        const query = {};
        if (from) query.from = new RegExp(from, 'i');
        if (to) query.to = new RegExp(to, 'i');
        if (busDate) query.busDate = busDate;
        
        const buses = await Bus.find(query).sort({ busTime: 1 });
        res.status(200).json(buses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getBuses,
    getBusByDetails,
    createBus,
    updateBus,
    deleteBus,
    getFilteredBuses
};
