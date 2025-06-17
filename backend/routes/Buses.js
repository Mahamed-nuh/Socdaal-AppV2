const express = require('express');
const {createBus, getBuses, getBusByDetails, updateBus, deleteBus, getFilteredBuses} = require('../controllers/busController');






const router = express.Router();


//get all buses
router.get('/', getBuses);

//get a single bus by details
router.get('/details', getBusByDetails);

//get filtered buses
router.get('/filter', getFilteredBuses);

//create a new bus
router.post('/', createBus);



//update a bus by id
router.patch('/:id', updateBus);


//delete a bus by id
router.delete('/:id', deleteBus); 





module.exports = router;
