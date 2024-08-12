const mongoose = require('mongoose');

const dbConnector = () => {
    try {
        const connect = mongoose.connect(process.env.MONGO_URL);
        console.log('DB connection esatablished');
    }
    catch (error) {
        console.log('Error connecting DB');
    }
}

module.exports = dbConnector;