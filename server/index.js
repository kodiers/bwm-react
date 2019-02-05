const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/index');
const FakeDB = require('./fake-db');
const path = require('path');

const rentalRoutes = require('./routes/rentals');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const imageUploadRoutes = require('./routes/image-upload');
const paymentRoutes = require('./routes/payments');


mongoose.connect(config.DB_URI, {
  "auth": { "authSource": config.authSource },
  "user": config.user,
  "pass": config.pass,
  useCreateIndex: true,
  useNewUrlParser: true
}).then(() => {
  // const fakeDb = new FakeDB();
  // fakeDb.seedDB();
});


const app = express();


app.use(bodyParser.json());

app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', imageUploadRoutes);

if (process.env.NODE_ENV === 'production') {
  const appPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(appPath));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'));
  });
}


const PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
  console.log('I am running');
});
