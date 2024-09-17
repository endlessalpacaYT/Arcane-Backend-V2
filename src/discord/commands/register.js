const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../../Models/user/user.js');
const UserV2 = require('../../Models/user/userv2.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Create An Account On Lightning!")
        .addStringOption(option =>
            option.setName("username")
                .setDescription("Your desired Username.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("email")
                .setDescription("Your desired email for login.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("password")
                .setDescription("Your password for login (not for discord).")
                .setRequired(true)),

    async execute(interaction) {
        const username = interaction.options.getString('username');
        const email = interaction.options.getString('email');
        const password = interaction.options.getString('password');
        const userId = interaction.user.id;

        function generateAccountId() {
            const uuid = uuidv4();
            const accountId = uuid.replace(/-/g, '').substring(0, 32);
            return accountId.toUpperCase();
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const existingUser = await User.findOne({ Discord: userId });
            const existingUserV2 = await UserV2.findOne({ Discord: userId });

            if (existingUser || existingUserV2) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed To Create An Account!")
                    .setDescription("Reason: You have already created an account!");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            try {
                const newUserV2 = new UserV2({
                    Create: new Date(),
                    Banned: false,
                    BannedReason: "You are banned from Lightning.",
                    MatchmakerID: generateAccountId(),
                    Discord: userId,
                    Account: generateAccountId(),
                    Username: username,
                    Username_Lower: username.toLowerCase(),
                    Email: email,
                    Password: hashedPassword
                });

                await newUserV2.save();
            } catch (err) {
               
                const newUser = new User({
                    created: new Date(),
                    banned: false,
                    discordId: userId,
                    accountId: generateAccountId(),
                    username: username,
                    username_lower: username.toLowerCase(),
                    email: email,
                    password: hashedPassword
                });

                await newUser.save();
                console.log("Reverted Creating User To V1: " + err);
            }

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully Registered")
                .setDescription("Registered with the following details:")
                .addFields([
                    {
                        name: "Username",
                        value: username,
                        inline: true
                    },
                    {
                        name: "Email",
                        value: email,
                        inline: true
                    },
                ]);

            await interaction.reply({ embeds: [embed], ephemeral: true });

            
            const publicEmbed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("New Signup!")
                .setDescription("A user has registered on the Lightning Backend.")
                .addFields([
                    {
                        name: "Username",
                        value: username,
                        inline: true
                    },
                    {
                        name: "Discord Tag",
                        value: interaction.user.tag,  
                        inline: true
                    }
                ])
                .setImage(interaction.user.displayAvatarURL({ dynamic: true })); 

            await interaction.followUp({ embeds: [publicEmbed] }); 

        } catch (error) {
            console.error('Error registering user:', error);
            await interaction.reply({ content: 'There was an error registering your account. Please try again later.', ephemeral: true });
        }
    }
};
