const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    accountId: { type: String, required: true },
    profileId: { type: String, required: true },
    profileRevision: { type: Number, default: 1 },
    profileChangesBaseRevision: { type: Number, default: 1 },
    profileChanges: { type: Array, default: [] },
    profileCommandRevision: { type: Number, default: 1 },
    serverTime: { type: Date, default: Date.now },
    responseVersion: { type: Number, default: 1 }
}, {
    collection: "profiles" 
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;