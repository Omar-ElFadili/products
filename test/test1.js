const db = require('../config/database')
const Event = require('../models/Product')

const newEvent = new Event({
    name : "omar"
})

newEvent.save()
  .then(() => {
    console.log('object added on the db');
  })
  .catch((error) => {
    console.error('Error in adding', error);
  });