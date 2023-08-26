const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/productsdb',
    { useNewUrlParser: true, 
      useUnifiedTopology: true 
    })
    .then(() => {
        console.log("Connected successfully to the database...");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });
