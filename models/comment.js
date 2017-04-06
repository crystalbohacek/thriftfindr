var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    date: Date,
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        name: String,
        picture: String,
    }
});

module.exports = mongoose.model("Comment", commentSchema);