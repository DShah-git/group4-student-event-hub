const express = require('express');
const app = express();
var cors = require('cors')
const env = require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Import body-parser
const authRoutes = require('./Routes/Auth/auth')
const adminRoutes = require('./Routes/Admin/admin')
const studentRoutes = require('./Routes/Student/student')

const corsOptions = {
  origin: '*', // Allow all origins
  methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
  allowedHeaders: 'Content-Type,Authorization,x-auth',
  credentials: true
};

app.use(express.json());
app.use(cors(corsOptions))

// Middleware setup
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth',authRoutes)
app.use('/admin',adminRoutes)
app.use('/student',studentRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}/`);
});