const express = require("express");
const app1 = require('./routes/event-route');
const app = express();
const db = require('./config/database');
const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute')
const body_parser = require('body-parser')
const auth = require('./middleware/auth')



app.use(express.json());
app.use(body_parser.json());

app.get('/api', (req, res) => {
    console.log("this end point worked")
    res.send("it's working at this time")
})
app.use('/api/product', auth, productRouter); // Ajout du slash initial et "api" pour correspondre au chemin complet
app.use('/api/user', userRouter); // Ajout du slash initial et "api" pour correspondre au chemin complet
app.use('/event', app1)
app.listen(3000, () => {
    console.log("it listen on port 3000")
})
