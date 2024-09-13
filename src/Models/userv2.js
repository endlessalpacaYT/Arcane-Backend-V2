const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        Create: { type: Date, required: true, default: Date.now },
        Banned: { type: Boolean, default: false },
        BannedReason: { type: String, unique: true },
        BannedExpire: { type: Date, default: Date.now },
        BannedMatchmaker: { type: String, unique: true },
        BannedMatchmakerExpire: { type: Date, default: Date.now },
        MatchmakerID: { type: String, unique: true },
        DiscordId: { type: String, required: true, unique: true },
        AccountId: { type: String, required: true, unique: true },
        Username: { type: String, required: true, unique: true },
        Username_Lower: { type: String, required: true, unique: true },
        Email: { type: String, required: true, unique: true },
        Password: { type: String, required: true },
    },
    {
        collection: "usersv2"
    }
);

UserSchema.pre('save', function(next) {
    this.Username_Lower = this.Username.toLowerCase();
    next();
});

const UserV2 = mongoose.model('UserV2', UserSchema);

UserV2.createIndexes({ Email: 1 });

module.exports = UserV2;