// Load mongoose
const mongoose = require("mongoose");
var DB_URI = 'mongodb://localhost:27017/booksservice'

// connect
function connect() {
    return new Promise( (resolve, reject) => {

        if (process.env.NODE_ENV === 'test'){
            const Mockgoose = require('mockgoose').Mockgoose;
            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage()
                .then(() => {
                    mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
                    .then( (res, err) => {
                        if(err) {
                            return reject(err);
                        }
                        return resolve();
                    }).catch((err) => {
                        console.error('App starting error:', err.stack);
                        return reject(err);
                    });
                });

        } else {
            mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then( (res, err) => {
                if(err) {
                    return reject(err);
                }
                return resolve();
            }).catch((err) => {
                console.error('App starting error:', err.stack);
                return reject(err);
            });
        }

    });
}

//close
function close(){
    return mongoose.disconnect();
}

module.exports = {connect, close};
