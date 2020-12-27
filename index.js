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
const token_disbot = process.env.TOKEN_CHATBOT;
const prefixCom = process.env.COMMAND_PREFIX;

// Require
const chalk = require('chalk');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const client = new Discord.Client();

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

const commands_chat = ['!hai','!help','!tentang','!joined'];

function gotMessage(msg) {
  if (msg.guild.id === serverID) {
    if (msg.channel.id != channelID) {
      /*
      * Balas Pesan selain channel tertentu
      */
      if (msg.content.startsWith(`${prefixCom}hai`)) {
        msg.reply('Hai juga! perkenalkan saya Bot yang bertugas di '+serverName+' :)');
      } else if(msg.content.startsWith(`${prefixCom}help`)){
        let pesanhelp;
        pesanhelp = 'Halo semua, saya bot yang bertugas di '+serverName+' membantu dan menemani temen-temen semua yang ada di Discord\n\n';
        pesanhelp += 'Command yang tersedia :\n';
        commands_chat.forEach(command => {
          pesanhelp += '- '+command+'\n';
        });
        pesanhelp += '\nJika membutuhkan bantuan lebih, silahkan hubungi saya melalui email di hexageek1337@gmail.com';
        msg.channel.send(pesanhelp);
      } else if(msg.content.startsWith(`${prefixCom}tentang`)){
        msg.channel.send(serverName+' adalah sebuah wadah bagi para bisnisman dan programmer berkolaborasi satu sama lain ataupun hanya berbincang-bincang.');
      } else if(msg.content.startsWith(`${prefixCom}joined`)){
        const unix_timestamp = msg.member.joinedTimestamp;
        const tanggal = new Date(unix_timestamp);

        msg.reply(tanggal);
      }
    }
  } else {
    msg.reply('Maaf saya hanya bertugas di server '+serverName+' !');
  }
}

const Main = async function(){
  client.login(token_disbot);
  client.once('ready', readyDiscord);
  client.once('reconnecting', reconnectDiscord);
  client.once('disconnect', disconnectDiscord);

  client.on('message', gotMessage);
}

Main()