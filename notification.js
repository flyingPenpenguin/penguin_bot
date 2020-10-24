/**
 * 定数定義
 */
// dotenvの読み込み設定
require('dotenv').config();
const Env = process.env;

// discord.jsのimport
const Discord = require('discord.js');

// Discord Clientインスタンス生成
const client = new Discord.Client();

// トークン
const token = Env.DISCORD_TOKEN;

/**
 * ログイン処理
 */
// ログイン
client.login(token);

// readyになり次第ロギングと出欠お願いメッセージを送る
client.on('ready', () => {
    console.log(`${client.user.username}でログイン成功しました。`);

    client.channels.cache.get(Env.DISCORD_NODE_NOTIFICATION_CHANNEL_ID).send('@everyone\n本日は拠点戦です！・ｗ・\n出欠シートへの記入がまだの方は記入よろしくお願いします・ｗ・/');
});
