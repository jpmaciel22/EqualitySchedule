require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes')
const cors = require('cors');
const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' })); 

//MongoDB Connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNECTION_URL, {
})
  .then(() => {
    console.log('MongoDB connected successfully');
    app.emit('ready');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
  
app.use(route)


app.use((req, res,) => {
  res.json({ message: 'API CONNECTED.' });
});


app.on('ready', () => {
  app.listen(PORT, (e) => {
    if (!e) {
      console.log(`Escutando na porta ${PORT}.`)
    } else console.log(e)
  })
});