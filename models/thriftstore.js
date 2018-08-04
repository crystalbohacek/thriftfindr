var mongoose = require("mongoose");

//SCHEMA SETUP

var thriftstoreSchema = new mongoose.Schema({
    name: String,
    pricegroup: String,
    isFeatured: Boolean,
    image: String,
    description: String,
    address: String,
    city: String,
    state: String,
    phone: String,
    country: String,
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
