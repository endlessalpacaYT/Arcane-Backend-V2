const express = require("express");
const app = express.Router();

const functions = require("../utils/functions.js");

app.get("/fortnite/api/calendar/v1/timeline", (req, res) => {
    const memory = functions.GetVersionInfo(req);

    let activeEvents = [
        {
            "eventType": `EventFlag.Season${memory.season}`,
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": `EventFlag.${memory.lobby}`,
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        }
    ];

    res.json({
        channels: {
            "client-matchmaking": {
                states: [],
                cacheExpire: "9999-01-01T00:00:00.000Z"
            },
            "client-events": {
                states: [{
                    validFrom: "0001-01-01T00:00:00.000Z",
                    activeEvents: activeEvents,
                    state: {
                        activeStorefronts: [],
                        eventNamedWeights: {},
                        seasonNumber: memory.season,
                        seasonTemplateId: `AthenaSeason:athenaseason${memory.season}`,
                        matchXpBonusPoints: 0,
                        seasonBegin: "2020-01-01T00:00:00Z",
                        seasonEnd: "9999-01-01T00:00:00Z",
                        seasonDisplayedEnd: "9999-01-01T00:00:00Z",
                        weeklyStoreEnd: "9999-01-01T00:00:00Z",
                        stwEventStoreEnd: "9999-01-01T00:00:00.000Z",
                        stwWeeklyStoreEnd: "9999-01-01T00:00:00.000Z",
                        sectionStoreEnds: {
                            Featured: "9999-01-01T00:00:00.000Z"
                        },
                        dailyStoreEnd: "9999-01-01T00:00:00Z"
                    }
                }],
                cacheExpire: "9999-01-01T00:00:00.000Z"
            }
        },
        eventsTimeOffsetHrs: 0,
        cacheIntervalMins: 10,
        currentTime: new Date().toISOString()
    });
});

app.get("/fortnite/api/version", (req, res) => {
    res.json({
      "app": "fortnite",
      "serverDate": new Date().toISOString(),
      "overridePropertiesVersion": "unknown",
      "cln": "17951730",
      "build": "444",
      "moduleName": "Fortnite-Core",
      "buildDate": "2021-10-27T21:00:51.697Z",
      "version": "18.30",
      "branch": "Release-18.30",
      "modules": {
        "Epic-LightSwitch-AccessControlCore": {
          "cln": "17237679",
          "build": "b2130",
          "buildDate": "2021-08-19T18:56:08.144Z",
          "version": "1.0.0",
          "branch": "trunk"
        },
        "epic-xmpp-api-v1-base": {
          "cln": "5131a23c1470acbd9c94fae695ef7d899c1a41d6",
          "build": "b3595",
          "buildDate": "2019-07-30T09:11:06.587Z",
          "version": "0.0.1",
          "branch": "master"
        },
        "epic-common-core": {
          "cln": "17909521",
          "build": "3217",
          "buildDate": "2021-10-25T18:41:12.486Z",
          "version": "3.0",
          "branch": "TRUNK"
        }
      }
    });
});

app.get("/fortnite/api*/versioncheck*", (req, res) => {
    res.json({
        "type": "NO_UPDATE"
    });
});

module.exports = app;