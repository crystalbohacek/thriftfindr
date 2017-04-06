var mongoose = require("mongoose");

//SCHEMA SETUP

var thriftstoreSchema = new mongoose.Schema({
    name: String,
    pricegroup: String,
    image: String,
    description: String,
    address: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        name: String
    },
        
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
        ]
});

module.exports = mongoose.model("Thriftstore", thriftstoreSchema);
