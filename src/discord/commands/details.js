const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../../Models/user/user.js');
const UserV2 = require('../../Models/user/userv2.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("details")
        .setDescription("View your account details."),

    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            const existingUser = await User.findOne({ Discord: userId });
            const existingUserV2 = await UserV2.findOne({ Discord: userId });

            if (!existingUser && !existingUserV2) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to view details")
                    .setDescription("Reason: You do not have an account!");

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const userDetails = existingUserV2 || existingUser;
            
            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("User Details")
                .setDescription(`User details for: <@${userId}>`)
                .addFields([
                    {
                        name: "Username",
                        value: userDetails.Username || userDetails.username,
                        inline: true
                    },
                    {
                        name: "Email",
                        value: userDetails.Email || userDetails.email,
                        inline: true
                    },
                    {
                        name: "Account ID",
                        value: userDetails.Account || userDetails.accountId,
                        inline: true
                    },
                    {
                        name: "Banned?",
                        value: userDetails.Banned ? "Yes" : "No",
                        inline: true
                    },
                ])
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error getting details:', error);
            await interaction.reply({ content: 'There was an error getting your account details. Please try again later.', ephemeral: true });
        }
    }
};
