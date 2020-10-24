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
    if (msg.content.startsWith('拠点')) {

        // メッセージを配列化

        // switch文

        // 最初の拠点を除いて
        // 1. 文字列で始まる場合

            // 配列の長さが4あるか確認 || 早期退出

            // 配列を展開したうえで、すべてが参加 ~ 保留に正規表現マッチしているかの確認 || 早期退出

            // google api client.authorize

                // 4箇所書き換えfunctionの呼び出し

        // 2. 数字で始まる場合

            // 配列の長さが2か || 早期退出

            // 配列を展開したうえで
            // 一つは1~4
            // 2つ目は参加 ~ 保留に正規表現マッチしているか

            // google api client.authorize

                // 1箇所書き換えfunctionの呼び出し

        msg.channel.send('こんぺん！・ｗ・');
    }
});


// async function inputAttendance()
// @param array


// async function inputAttendanceSpecified()
// @param array
