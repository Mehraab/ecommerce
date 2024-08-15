const express = require('express');
const dbConnector = require('./config/dbConnector');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes')

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);


app.use(notFound);
app.use(errorHandler);

dbConnector();
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})