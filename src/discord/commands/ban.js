const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../../Models/user/user.js');
const UserV2 = require('../../Models/user/userv2.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user")
        .addStringOption(option =>
            option.setName("id")
                .setDescription("What is the Discord ID of the user you would like to ban?")
                .setRequired(true)),

    async execute(interaction) {
        const username = interaction.options.getString('id');


        try {
            const existingUser = await User.findOne({ discordId: userId });
            const existingUserV2 = await UserV2.findOne({ discordId: userId });

            if (existingUser) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed To Create An Account!")
                    .setDescription("Reason: You already created an account!");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            } else if (existingUserV2) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed To Create An Account!")
                    .setDescription("Reason: You already created an account!");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            try {
    
                await newUserV2.save();
            }catch (err) {

    
                await newUser.save();
                console.log("Reverted Creating User To V1: " + err);
            }

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully Registered")
                .setDescription("Registered With The Username: " + username);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error registering user:', error);
            await interaction.reply({ content: 'There was an error registering your account. Please try again later.', ephemeral: true });
        }
    }
};