const Discord = require('discord.js');
//const require = require('require.js');
const client = new Discord.Client();
const {prefix, token, name} = require('./config.json');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');
const default_url = "https://www.youtube.com/watch?v=BCLeTNyJeAc";
const Queue = require('./queue.js');

var dispatcher;
let queue = new Queue();

client.login(token);

client.once('ready', () => {
    console.log('Ready!');
    console.log('Logged in as: ' + name);
});


client.on('message',message => {
    if (message.content.substr(0,1) != prefix || message.author.bot){
        return;
    }

    const args = message.content.slice(1, message.content.length).split(" ");
    const member = message.member;
    const voiceChannel = member.voiceChannel;
    const displayName = member.displayName;
    args[0] = args[0].toLowerCase();

    switch (args[0])
    {
        case "hi":
        message.channel.send("no");
        break;

        case "play":
        if (!voiceChannel)
        {
            message.channel.send(displayName + " is not in a voice channel.");
            return;
        }

        if (args[1] != null)
        {
            var url = args[1];
        }
        else 
        {
            var url = default_url;
        }

        queue.enqueue(url);
        message.channel.send("Added to queue");

        if (dispatcher != null)
        {
            // if (!dispatcher.paused)
            // {
            //     return;
            // }
        }

        voiceChannel.join().then(
            connection => {
                const stream = ytdl(url, { filter: 'audioonly'});
                /*if (!stream.validateURL(url))
                {
                    message.channel.send(displayName + " did not give a valid URL.");
                    return;
                }*/
                dispatcher = connection.playStream(stream);
                dispatcher.on('end', () => {
                    stream = dispatcherEnd(stream, message.channel, voiceChannel);
                    if (stream != null)
                    {
                        dispatcher = connection.playStream(stream);
                    }
                    // message.channel.send("No more music left");
                    // setTimeout(voiceChannel.leave(), 3000);
                });
                dispatcher.on('error', e => {
                    console.log(e);
                });
                
            });
        break;

        case "join":
        if (!voiceChannel)
        {
            notInVoiceChannelMsgSend(member, message.channel);
            return;
        }
        voiceChannel.join();
        message.channel.send(name + " has joined " + voiceChannel.name);
        break;

        case "leave":
        if (!voiceChannel)
        {
            notInVoiceChannelMsgSend(member, message.channel);
            return;
        }
        else
        {
            message.channel.send("It's not like I wanted to stay in this channel or anything... b-baka");
            voiceChannel.leave();
        }
        break;

        case "off":
        message.channel.send("Oof");
        client.destroy();
        break;

        case "on":
        client.login(token);
        break;

        case "pause":
        if (!voiceChannel)
        {
            notInVoiceChannelMsgSend(member, message.channel);
        }
        if (dispatcher == null)
        {
            return;
        }
        dispatcher.pause();
        message.channel.send("Audio has been paused.");
        break;

        case "stop":
        if (!voiceChannel)
        {
            notInVoiceChannelMsgSend(member, message.channel);
        }

        break;

        case "resume":
        if (!voiceChannel)
        {
            notInVoiceChannelMsgSend(member, message.channel);
        }
        if (dispatcher == null)
        {
            return;
        }
        dispatcher.resume();
        message.channel.send("Audio has started again.");
        break;
        default:
        message.channel.send("Not a viable command");
    }

});

/**
 * sends a message to the channel, when the member sending the command isn't in a voice channel
 * 
 * @param {*} member
 * @param {*} channel 
 * @return boolean
 */
function notInVoiceChannelMsgSend(member, channel)
{
    channel.send(member.displayName + " is not in a voice channel.");
}

/**
 * 
 * @param {*} stream 
 * @param {*} channel 
 * @param {*} voiceChannel 
 */
function dispatcherEnd(stream, channel, voiceChannel)
{
    if (queue.empty())
    {
        channel.send("No more music left. Music onegaishimasu");
        setTimeout(voiceChannel.leave(), 3000);
        return null;
    }
    else 
    {
        url = queue.dequeue();
        return ytdl(url, { filter: 'audioonly'});
    }
}