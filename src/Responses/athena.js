const express = require("express");

const app = express();

const User = require("../Models/user/user");
const UserV2 = require("../Models/user/userv2");

app.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', async (req, res) => {
    try {
        const { accountId } = req.params;

        const userProfile = await UserV2.findOne({ Account: accountId }) || await User.findOne({ accountId: accountId });
        if (!userProfile) {
            return res.status(404).json({
                error: 'arcane.errors.profile.not_found',
                message: 'Profile not found.'
            });
        }

        const cosmeticItems = {
            character: {
                templateId: "CosmeticLockerItem:athena_character_cid_001_athena_commando_f_default",
                attributes: {
                    level: 1,
                    item_seen: true,
                    xp: 0,
                    variants: [],
                    favorite: false
                }
            },
            backpack: {
                templateId: "CosmeticLockerItem:athena_backpack_bid_001",
                attributes: {
                    level: 1,
                    item_seen: true,
                    xp: 0,
                    variants: [],
                    favorite: false
                }
            },
            pickaxe: {
                templateId: "CosmeticLockerItem:athena_pickaxe_id_001",
                attributes: {
                    level: 1,
                    item_seen: true,
                    xp: 0,
                    variants: [],
                    favorite: false
                }
            }
        };

        const loadout = {
            sandbox_loadout: {
                templateId: "CosmeticLocker:cosmeticlocker_athena",
                attributes: {
                    locker_slots_data: {
                        slots: {
                            Pickaxe: {
                                items: ["AthenaPickaxe:DefaultPickaxe"],
                                activeVariants: []
                            },
                            Dance: {
                                items: ["AthenaDance:EID_BoogieDown", "AthenaDance:EID_DanceMoves", "", "", "", ""]
                            },
                            Glider: {
                                items: ["AthenaGlider:DefaultGlider"]
                            },
                            Character: {
                                items: ["AthenaCharacter:CID_001_Athena_Commando_F_Default"],
                                activeVariants: [{ variants: [] }]
                            },
                            Backpack: {
                                items: [""],
                                activeVariants: [{ variants: [] }]
                            },
                            ItemWrap: {
                                items: ["", "", "", "", "", "", ""],
                                activeVariants: [null, null, null, null, null, null, null]
                            },
                            LoadingScreen: {
                                items: [""],
                                activeVariants: [null]
                            },
                            MusicPack: {
                                items: [""],
                                activeVariants: [null]
                            },
                            SkyDiveContrail: {
                                items: [""],
                                activeVariants: [null]
                            }
                        }
                    },
                    use_count: 1,
                    banner_icon_template: "",
                    locker_name: "",
                    banner_color_template: "",
                    item_seen: false,
                    favorite: false
                },
                quantity: 1
            }
        };

        res.json({
            created: "2022-01-08T22:58:06.983Z",
            updated: "2022-01-08T22:58:57.261Z",
            rvn: 1,
            wipeNumber: 1,
            accountId: accountId,
            profileId: "athena",
            version: "no_version",
            items: {
                cosmetics: cosmeticItems,
                loadouts: loadout
            },
            stats: {
                attributes: {
                    season_match_boost: 0,
                    loadouts: ["sandbox_loadout", "momentum0-loadout"],
                    rested_xp_overflow: 0,
                    mfa_reward_claimed: true,
                    quest_manager: {},
                    book_level: 0,
                    season_num: 16,
                    season_update: 1,
                    book_xp: 1,
                    permissions: [],
                    book_purchased: false,
                    lifetime_wins: 0,
                    party_assist_quest: "",
                    purchased_battle_pass_tier_offers: [],
                    rested_xp_exchange: 0.333,
                    level: 0,
                    xp_overflow: 0,
                    rested_xp: 0,
                    rested_xp_mult: 0,
                    accountLevel: 0,
                    competitive_identity: {},
                    inventory_limit_bonus: 0,
                    last_applied_loadout: "sandbox_loadout",
                    daily_rewards: {},
                    xp: 0,
                    season_friend_match_boost: 1,
                    active_loadout_index: 1,
                    favorite_musicpack: "",
                    favorite_glider: "",
                    favorite_pickaxe: "",
                    favorite_skydivecontrail: "",
                    favorite_backpack: "",
                    favorite_dance: ["", "", "", "", "", ""],
                    favorite_itemwraps: [],
                    favorite_character: "",
                    favorite_loadingscreen: ""
                }
            },
            commandRevision: 5
        });

    } catch (err) {
        console.error('Error fetching player profile:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            message: 'The server encountered an error while processing the request.'
        });
    }
});

module.exports = app;