// dotenvの読み込み設定
require('dotenv').config();
const Env = process.env;

/**
 * google api設定
 */
const {google} = require('googleapis');
const gKeys     = require('./keys.json');

// トークンの生成(Json Web Token)
const googleClient = new google.auth.JWT(
    gKeys.client_email,
    null,
    gKeys.private_key,
    [
       'https://www.googleapis.com/auth/spreadsheets'
    ]
);

/**
 * Discordの設定
 */
// discord.jsのimport
const Discord = require('discord.js');
// Discord Clientインスタンス生成
const discordClient = new Discord.Client();
// トークン
const dToken = Env.DISCORD_TOKEN;
// ログイン
discordClient.login(dToken);

/**
 * ユーザーの発言に対しての処理
 * TODO : メッセージをpickupするチャンネルの制限
 */
discordClient.on('message', async msg => {
    // bot自身の発言は無視
    if (msg.author.bot) return;

    // '拠点'で始まるメッセージをピック
    if (msg.content.match(/^拠点/)) {
        msg.channel.send('こんぺん！・ｗ・');
    }
});
