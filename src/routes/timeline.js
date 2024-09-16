require("dotenv").config();

const express = require("express");
const app = express.Router();

const axios = require('axios');

const functions = require("../utils/functions.js");

app.get("/fortnite/api/calendar/v1/timeline", async (req, res) => {
    const memory = functions.GetVersionInfo(req);

    const timelineResponse = await axios.get(`http://${process.env.API_IP}:${process.env.API_PORT}/backend/timeline`); 
    console.log(`Get Request To: http://${process.env.API_IP}:${process.env.API_PORT}/backend/timeline`);

    const seasonStart = timelineResponse.data.seasonStart || "2020-01-01T00:00:00Z";
    const seasonEnd = timelineResponse.data.seasonEnd || "9999-01-01T00:00:00Z";

    let activeEvents = [
        {
            "eventType": `EventFlag.Season${memory.season}`,
            "activeUntil": seasonEnd,
            "activeSince": seasonStart
        },
        {
            "eventType": `EventFlag.${memory.lobby}`,
            "activeUntil": seasonEnd,
            "activeSince": seasonStart
        }
        
       if (memory.season == 3) {
        {
            "eventType": "EventFlag.Spring2018Phase1",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
        if (memory.build >= 3.1) {
            {
                "eventType": "EventFlag.Spring2018Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
        if (memory.build >= 3.3) {
            {
                "eventType": "EventFlag.Spring2018Phase3",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
        if (memory.build >= 3.4) {
            {
                "eventType": "EventFlag.Spring2018Phase4",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }

    if (memory.season == 4) {
        {
            "eventType": "EventFlag.Blockbuster2018",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Blockbuster2018Phase1",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
        if (memory.build >= 4.3) {
            {
                "eventType": "EventFlag.Blockbuster2018Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
        if (memory.build >= 4.4) {
            {
                "eventType": "EventFlag.Blockbuster2018Phase3",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
        if (memory.build >= 4.5) {
            {
                "eventType": "EventFlag.Blockbuster2018Phase4",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }

    if (memory.season == 5) {
        {
            "eventType": "EventFlag.RoadTrip2018",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Horde",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Anniversary2018_BR",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_Heist",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }
    
    if (memory.build == 5.10) {
        {
            "eventType": "EventFlag.BirthdayBattleBus",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 6) {
        {
            "eventType": "EventFlag.LTM_Fortnitemares",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_LilKevin",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
        if (memory.build >= 6.20) {
            {
                "eventType": "EventFlag.Fortnitemares",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.FortnitemaresPhase1",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "POI0",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
        if (memory.build >= 6.22) {
            {
                "eventType": "EventFlag.FortnitemaresPhase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            }
        }
    }
    
    if (memory.build == 6.20 || memory.build == 6.21) {
        {
            "eventType": "EventFlag.LobbySeason6Halloween",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.HalloweenBattleBus",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 7) {
        {
            "eventType": "EventFlag.Frostnite",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_14DaysOfFortnite",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_Festivus",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_WinterDeimos",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_S7_OverTime",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 8) {
        {
            "eventType": "EventFlag.Spring2019",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Spring2019.Phase1",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_Ashton",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_Goose",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_HighStakes",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_BootyBay",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
        if (memory.build >= 8.2) {
            {
                "eventType": "EventFlag.Spring2019.Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }


    if (memory.season == 9) {
        {
            "eventType": "EventFlag.Season9.Phase1",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Anniversary2019_BR",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_14DaysOfSummer",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_Mash",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_Wax",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
        if (memory.build >= 9.2) {
            {
                "eventType": "EventFlag.Season9.Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }

    if (memory.season == 10) {
        {
            "eventType": "EventFlag.Mayday",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Season10.Phase2",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Season10.Phase3",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_BlackMonday",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.S10_Oak",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.S10_Mystery",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 11) {
        {
            "eventType": "EventFlag.LTE_CoinCollectXP",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z" 
        },
        {
            "eventType": "EventFlag.LTE_Fortnitemares2019",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z" 
        },
        {
            "eventType": "EventFlag.LTE_Galileo_Feats",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z" 
        },
        {
            "eventType": "EventFlag.LTE_Galileo",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z" 
        },
        {
            "eventType": "EventFlag.LTE_WinterFest2019",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })

        if (memory.build >= 11.2) {
            {
                "eventType": "EventFlag.Starlight",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            })
        }

        if (memory.build < 11.3) {
            {
                "eventType": "EventFlag.Season11.Fortnitemares.Quests.Phase1",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            },
            {
                "eventType": "EventFlag.Season11.Fortnitemares.Quests.Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            },
            {
                "eventType": "EventFlag.Season11.Fortnitemares.Quests.Phase3",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            },
            {
                "eventType": "EventFlag.Season11.Fortnitemares.Quests.Phase4",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            },
            {
                "eventType": "EventFlag.StormKing.Landmark",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            })
        } else {
            {
                "eventType": "EventFlag.HolidayDeco",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Season11.WinterFest.Quests.Phase1",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Season11.WinterFest.Quests.Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Season11.WinterFest.Quests.Phase3",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Season11.Frostnite",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }

        if (memory.build == 11.31 || memory.build == 11.40) {
            {
                "eventType": "EventFlag.Winterfest.Tree",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTE_WinterFest",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTE_WinterFest2019",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }

    if (memory.season == 12) {
        {
            "eventType": "EventFlag.LTE_SpyGames",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_JerkyChallenges",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_Oro",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_StormTheAgency",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 14) {
        {
            "eventType": "EventFlag.LTE_Fortnitemares_2020",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
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
                        seasonBegin: seasonStart,
                        seasonEnd: seasonEnd,
                        seasonDisplayedEnd: seasonEnd,
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
