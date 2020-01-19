const Discord = require('discord.js');
//const require = require('require.js');
const client = new Discord.Client();
const {prefix, token, name} = require('./config.json');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');
const default_url = "https://www.youtube.com/watch?v=BCLeTNyJeAc";


client.login(token);

client.once('ready', () => {
    console.log('Ready!');
    console.log('Logged in as: ' + name);
});


client.on('message',message => {
    switch (message.content) {
    case "!bajangle":
        message.channel.send("Up and coming smash ultimate player | Wolf, Roy, Chrom, Ganon fuck vsb");
        break;
    case "!game":
        message.channel.send("It's funny how I can do so much more work than the enemy adc and still lose. This game is just out of my control!");
        break;
    case "!point":
        message.channel.send("What's even the point of going to tournaments? Never gonna go pro anyway");
        break;
    default:
        
}
});