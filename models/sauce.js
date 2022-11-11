// On importe le package
const mongoose = require("mongoose");

// On créé notre schéma sauce
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    usersLiked: {type: Array, default: []},
    usersDislike: {type: Array, default: []}
});

module.exports = mongoose.model("Sauce", sauceSchema);