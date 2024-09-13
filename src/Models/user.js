const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        Create: { type: Date, required: true, default: Date.now },
        Banned: { type: Boolean, default: false },
        BannedReason: { type: String, required: true, unique: true },
        BannedExpire: { type: Date, required: true, default: Date.now },
        BannedMatchmaker: { type: String, required: true, unique: true },
        BannedMatchmakerExpire: { type: Date, required: true, default: Date.now },
        MatchmakerID: { type: String, required: true, unique: true },
        DiscordId: { type: String, required: true, unique: true },
        AccountId: { type: String, required: true, unique: true },
        Username: { type: String, required: true, unique: true },
        Username_Lower: { type: String, required: true, unique: true },
        Email: { type: String, required: true, unique: true },
        Password: { type: String, required: true },
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