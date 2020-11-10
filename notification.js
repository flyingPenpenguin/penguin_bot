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

// 実際にチャンネルに通知するメッセージ
const notificationMsg = '@everyone\n本日は拠点戦です！・ｗ・\n出欠シートへの記入がまだの方は下記の連盟シートへ出欠の記入よろしくお願いします・ｗ・/\n' + Env.UNION_SPREADSHEET_URL;

/**
 * 処理を行う
 */
// ログイン
client.login(token);

// readyになり次第ロギングと出欠お願いメッセージを送る
client.on('ready', () => {
    console.log(`${client.user.username}でログイン成功しました。`);

    let notificationResult = Promise.resolve(sendNotification());

    // チャンネルにメッセージを送信したらログアウト
    notificationResult.then(() => {
        client.destroy();
    });
});

/**
 * ログイン >> 通知 >> ログアウト
 */
async function sendNotification() {
    return await client.channels.cache.get(Env.DISCORD_NODE_NOTIFICATION_CHANNEL_ID).send(notificationMsg);
}
