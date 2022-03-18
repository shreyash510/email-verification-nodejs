const mongoose = require('mongoose');

const db = 'mongodb+srv://cluster:cluster@cluster0.x9ipa.mongodb.net/emailverification?retryWrites=true&w=majority'

mongoose.connect(db, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
}).then(() => {
    console.log("Database Connected...")
}).catch((err) => {
    console.log(err)
})
