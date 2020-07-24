const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const cors = require('cors');

const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected'));

mongoose.connection.on('error', (err) => {
  console.log(`DB connection error: ${err.message}`);
});

app.use(morgan('dev'));

app.get('/api', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }

    const docs = JSON.parse(data);
    res.json(docs);
  });
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized!' });
  }
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log('Server is listening on port : ', port);
});
