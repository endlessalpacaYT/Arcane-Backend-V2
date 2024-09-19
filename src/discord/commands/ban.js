const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../../Models/user/user.js');
const UserV2 = require('../../Models/user/userv2.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to ban.")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const userId = user.id;
        const banningUser = interaction.user; 
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

            
            const dmEmbed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("You have been banned")
                .setDescription(`You have been banned from Lightning Backend by ${banningUser.tag}.`)
                .setTimestamp();

            try {
                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Could not send DM to user:', error);
            }

            
            if (existingUserV2) {
                await existingUserV2.updateOne({ $set: { Banned: true } });
            } else if (existingUser) {
                await existingUser.updateOne({ $set: { banned: true } });
            }

            
            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully banned user")
                .setDescription(`Banned user <@${userId}>.`);

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'There was an error banning that user. Please try again later.', ephemeral: true });
        }
    }
};
