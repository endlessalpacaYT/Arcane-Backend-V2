const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../../Models/user/user.js');
const UserV2 = require('../../Models/user/userv2.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("password")
        .setDescription("Reset your password.")
        .addStringOption(option =>
            option.setName("password")
                .setDescription("Your new password.")
                .setRequired(true)),

    async execute(interaction) {
        const password = interaction.options.getString('password');
        const userId = interaction.user.id;


        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const existingUser = await User.findOne({ Discord: userId });
            const existingUserV2 = await UserV2.findOne({ Discord: userId });

            if (!existingUser && !existingUserV2) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to reset password")
                    .setDescription("Reason: You do not have an account");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            try {
                await existingUserV2.updateOne({ $set: { Password: hashedPassword } });
            } catch (err) {
                if (!existingUserV2) {
                    await existingUser.updateOne({ $set: { password: hashedPassword } });
                } else {
                    const embed = new EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("Failed To Create An Account!")
                        .setDescription("Reason: You have already created an account!");

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }
            }

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully changed password")
                .setDescription("Successfully changed your password.");

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error changing password:', error);
            await interaction.reply({ content: 'There was an error changing your password. Please try again later.', ephemeral: true });
        }
    }
};