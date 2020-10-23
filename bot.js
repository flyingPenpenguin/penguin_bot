// dotenvの読み込み設定
require('dotenv').config();
const Env = process.env;

// discord.jsのimport
const Discord = require('discord.js');

// Discord Clientインスタンス生成
const client = new Discord.Client();

// トークン
const token = Env.DISCORD_TOKEN;

// ready時のイベント
client.on('ready', () => {
    console.log(`${client.user.username}でログインしています。`);

    // client.channels.cache.get('769191515993014302').send('テストだよ・ｗ・/');
});

client.on('message', async msg => {
    // bot自身の発言は無視
    if (msg.author.bot) return;

    // 'こん'が含まれているメッセージに対して返信
    if (msg.content.match(/^こん/)) {
        msg.channel.send('こんぺん！・ｗ・');
    }
});


// setInterval(async msg => {
//     msg.channel.send('ぺんぎんだぺん！・ｗ・');
// }, 10000);

// ログイン
client.login(token);