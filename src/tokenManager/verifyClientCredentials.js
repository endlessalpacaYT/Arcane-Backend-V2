const validClients = [
    {
        client_id: 'fortnitePCGameClient',
        client_secret: 'ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ='
    },
];

const verifyClientCredentials = (clientId, clientSecret) => {
    const client = validClients.find(c => c.client_id === clientId && c.client_secret === clientSecret);
    return !!client; 
};

module.exports = verifyClientCredentials;