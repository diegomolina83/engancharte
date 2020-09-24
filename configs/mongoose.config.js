const mongoose = require('mongoose')

mongoose
    .connect('mongodb://pedro99:chaima99@cluster0.xbwz5.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error('Error connecting to mongo', err))

module.exports = mongoose