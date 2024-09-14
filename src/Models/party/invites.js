const mongoose = require('mongoose');

const inviteschema = new mongoose.schema({
    partyId: { type: String, required: true },
    accountId: { type: String, required: true }, 
    invitationTime: { type: Date, required: true, default: Date.now },
    expirationTime: { type: Date, required: true }, 
}, {
    collection: "invitations"
});

InviteSchema.index({ expirationTime: 1 }, { expireAfterSeconds: 0 });

const invite = mongoose.model('invite', inviteschema);

module.exports = invite;