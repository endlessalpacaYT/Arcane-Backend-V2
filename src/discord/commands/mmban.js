const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../../Models/user/user.js');
const UserV2 = require('../../Models/user/userv2.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mmban")
        .setDescription("Ban a user from matchmaking.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to ban from matchmaking.")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const userId = user.id;

        try {
            const existingUser = await User.findOne({ discordId: userId });
            const existingUserV2 = await UserV2.findOne({ Discord: userId });

            if (!existingUser && !existingUserV2) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to Ban User")
                    .setDescription("Reason: The user does not have an account.");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            if (existingUserV2) {
                await existingUserV2.updateOne({ $set: { MatchmakerBanned: true } });
            } else if (existingUser) {
                const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Failed to ban from matchmaking")
                .setDescription("The current user is unable to be matchmaker banned, due to them having a V1 Account.");

            await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully banned user")
                .setDescription("Banned user <@" + userId + "> from matchmaking.");

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'There was an error banning that user. Please try again later.', ephemeral: true });
        }
    }
};
