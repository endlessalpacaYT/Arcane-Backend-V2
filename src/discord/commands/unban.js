const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../../Models/user/user.js');
const UserV2 = require('../../Models/user/userv2.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to unban.")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const userId = user.id;

        try {
            const existingUser = await User.findOne({ discordId: userId, banned: true });
            const existingUserV2 = await UserV2.findOne({ Discord: userId, Banned: true });

            if (!existingUserV2) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to unban user")
                    .setDescription("Reason: The user is not banned.");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            if (existingUserV2) {
                await existingUserV2.updateOne({ $set: { Banned: false } });
            } else {
                await existingUser.updateOne({ $set: { banned: false } });
            }

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully unbanned user")
                .setDescription("Unbanned user <@" + userId + ">.");

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'There was an error unbanning that user. Please try again later.', ephemeral: true });
        }
    }
};
