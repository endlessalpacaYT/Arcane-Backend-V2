const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        created: { type: Date, required: true, default: Date.now },
        banned: { type: Boolean, default: false },
        discordId: { type: String, required: true, unique: true },
        accountId: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        username_lower: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    {
        collection: "users"
    }
);

UserSchema.pre('save', function(next) {
    this.username_lower = this.username.toLowerCase();
    next();
});

const model = mongoose.model('User', UserSchema);

module.exports = model;