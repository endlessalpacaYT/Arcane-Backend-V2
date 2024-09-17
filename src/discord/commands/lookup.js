const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../../Models/user/user.js');
const UserV2 = require('../../Models/user/userv2.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lookup")
        .setDescription("View a user's account details.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to look up.")
                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const userId = user.id;
        

        try {
            const existingUser = await User.findOne({ Discord: userId });
            const existingUserV2 = await UserV2.findOne({ Discord: userId });

            if (!existingUser && !existingUserV2) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to view details")
                    .setDescription("Reason: That user does not have an account.");

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
