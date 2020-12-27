/*
* Disbot - Bot for Discord Communication Apps with NodeJS
*                           v1.0
* ---------------------------------------------------------
* Github : https://github.com/hexageek1337
* Author : Denny Septian Panggabean
* ---------------------------------------------------------
* Link Authorize :
* https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot
*/
'use strict'

// DotENV
require('dotenv').config();

// Settings
const serverName = process.env.SERVER_NAME;
const serverID = process.env.SERVER_ID;
const channelID = process.env.CHANNEL_MUSIC;
const token_disbot = process.env.TOKEN_MUSICBOT;
const prefixCom = process.env.COMMAND_PREFIX;

// Require
const chalk = require('chalk');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const queue = new Map();

//Chalk Definition
const error = chalk.keyword('red');
const warning = chalk.keyword('orange');
const title = chalk.keyword('magenta');
const titlebold = chalk.bold.cyan;
const description = chalk.keyword('green');

/*
* Discord Function
*/
function readyDiscord() {
  bannerReady();
}

const bannerReady = function(){
  console.log(title(`
  ————————————————————— [INFORMATION] ———————————————————————
  [?] `)+titlebold('Disbot')+title(` - Bot for Discord Communication Apps with NodeJS
  ———————————————————————————————————————————————————————————`)+description(`
  ——————————————————————  [AUTHOR]  —————————————————————————
  [+] Github : https://github.com/hexageek1337
  [+] Author : Denny Septian Panggabean 
  ———————————————————————————————————————————————————————————
  [-] Logged in as ${client.user.tag}
  ———————————————————————————————————————————————————————————`));
}

function reconnectDiscord(){
  bannerReconnect();
}

const bannerReconnect = function(){
  console.log(title(`
  ————————————————————— [INFORMATION] ———————————————————————
  [?] `)+titlebold('Disbot')+title(` - Bot for Discord Communication Apps with NodeJS
  ———————————————————————————————————————————————————————————`)+description(`
  ——————————————————————  [AUTHOR]  —————————————————————————
  [+] Github : https://github.com/hexageek1337
  [+] Author : Denny Septian Panggabean 
  ———————————————————————————————————————————————————————————
  [-] Reconnecting in as ${client.user.tag}
  ———————————————————————————————————————————————————————————`));
}

function disconnectDiscord(){
  bannerDisconnect();
}

const bannerDisconnect = function(){
  console.log(title(`
  ————————————————————— [INFORMATION] ———————————————————————
  [?] `)+titlebold('Disbot')+title(` - Bot for Discord Communication Apps with NodeJS
  ———————————————————————————————————————————————————————————`)+description(`
  ——————————————————————  [AUTHOR]  —————————————————————————
  [+] Github : https://github.com/hexageek1337
  [+] Author : Denny Septian Panggabean 
  ———————————————————————————————————————————————————————————
  [-] Disconnect as ${client.user.tag}
  ———————————————————————————————————————————————————————————`));
}

const broadcast = client.voice.createBroadcast();
const commands_radio = ['!help','!play','!skip','!stop','!queue','!join','!leave'];

const Main = async function(){
  client.login(token_disbot);
  client.once('ready', readyDiscord);
  client.once('reconnecting', reconnectDiscord);
  client.once('disconnect', disconnectDiscord);

  client.on('message', async message => {
    if (message.guild.id === serverID) {
      if (message.channel.id === channelID) {
        const serverQueue = queue.get(message.guild.id);
        /*
        * Balas Pesan sesuai channel tertentu
        */
        if(message.content.startsWith(`${prefixCom}help`)){
          let pesanhelp;
          pesanhelp = 'Halo semua, saya bot yang bertugas di '+serverName+' membantu dan menemani temen-temen semua yang ada di Discord\n\n';
          pesanhelp += 'Command yang tersedia :\n';
          commands_radio.forEach(command => {
            pesanhelp += '- '+command+'\n';
          });
          pesanhelp += '\nJika membutuhkan bantuan lebih, silahkan hubungi saya melalui email di hexageek1337@gmail.com';
          message.reply(pesanhelp);
        } else if(message.content.startsWith(`${prefixCom}play`)){
          execute(message, serverQueue);
        } else if (message.content.startsWith(`${prefixCom}skip`)) {
          skip(message, serverQueue);
        } else if (message.content.startsWith(`${prefixCom}stop`)) {
          stop(message, serverQueue);
        } else if (message.content.startsWith(`${prefixCom}queue`)) {
          queueList(message, serverQueue);
        } else if(message.content.startsWith(`${prefixCom}join`)){
          try {
            message.member.voice.channel.join();
            message.reply('Terimakasih sudah invite saya ke voice channel :)');
          } catch {
            message.reply('Maaf anda harus terlebih dahulu masuk ke voice channel sebelum menginvite saya!');
          }
        } else if(message.content.startsWith(`${prefixCom}leave`)){
          try {
            message.member.voice.channel.leave();
          } catch {
            message.reply('Maaf sudah keluar!');
          }
        }
      }
    } else {
      message.reply('Maaf saya hanya bertugas di server '+serverName+' !');
    }
  });
}

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.reply(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.reply(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      queue.delete(message.guild.id);
      return message.reply("Maaf sudah join");
    }
  } else {
    serverQueue.songs.push(song);
    return message.reply(`**${song.title}** has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.reply(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.reply("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
  message.channel.send("**Song was skipped!**");
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.reply(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.reply("There is no song that I could stop!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  message.channel.send("**Song was stopped!**");
}

function queueList(message, serverQueue) {
  if (!serverQueue)
    return message.reply("No queue list song!");
  else if (serverQueue)
    var indexSong = 1;
    let qLStr = "**Queue List :**\n";
    serverQueue.songs.forEach(lagu => {
      qLStr += indexSong+". "+lagu.title+"\n";
      indexSong++;
    });
    return message.reply(qLStr);
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    //serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing : **${song.title}**`);
}

Main()