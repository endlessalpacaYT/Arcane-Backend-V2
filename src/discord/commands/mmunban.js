const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../../Models/user/user.js');
const UserV2 = require('../../Models/user/userv2.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mmunban")
        .setDescription("Unban a user from matchmaking. (ONLY WORKS ON V2 ACCOUNTS)")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to unban.")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const userId = user.id;

        try {
            
            const existingUserV2 = await UserV2.findOne({ Discord: userId, MatchmakerBanned: true });

            if (!existingUserV2) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to unban user")
                    .setDescription("Reason: The user is not banned.");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            if (existingUserV2) {
                await existingUserV2.updateOne({ $set: { MatchmakerBanned: false } });
            }

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully unbanned user")
                .setDescription("Unbanned user <@" + userId + "> from matchmaking.");

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'There was an error unbanning that user. Please try again later.', ephemeral: true });
        }
    }
};
