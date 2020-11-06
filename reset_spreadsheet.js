/**
 * References
 */
// Google Sheets API - JavaScript NodeJS Tutorial
// https://www.youtube.com/watch?v=MiPpQzW_ya0&t=32s

// dotenvの読み込み設定
require('dotenv').config();
const Env = process.env;

/**
 * google api設定
 */
const {google} = require('googleapis');
const gKeys     = require(Env.KEYS_JSON);

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

// TODO : ここで定義 参加登録範囲
// const attendanceInputArea = [

// ];



// readyになり次第ロギングと出欠お願いメッセージを送る
client.on('ready', () => {
    console.log(`${client.user.username}でログイン成功しました。出欠状況のリセット処理を開始します。`);

    let resetResult = Promise.resolve(resetAttendance());

    // チャンネルにメッセージを送信したらログアウト
    resetResult.then(() => {
        client.destroy();
    });
});

/**
 * ログイン >> 通知 >> ログアウト
 */
async function resetAttendance() {
    // return await client.channels.cache.get(Env.DISCORD_NODE_NOTIFICATION_CHANNEL_ID).send('@everyone\n本日は拠点戦です！・ｗ・\n出欠シートへの記入がまだの方は記入よろしくお願いします・ｗ・/');

    // google api client.authorize
    googleClient.authorize(function (err, tokens) {

        // エラー時
        if (err) {
            console.log(err);
            return;
        }

        // シートAPIの定義
        const gsapi = google.sheets({
            version:'v4',
            auth: googleClient
        });

        // 接続完了
        console.log('Connected!');

        // 書き込み位置取得function
        const resetPromise = Promise.resolve(proceedReset(gsapi, attendanceInputArea));

        // 書き込み開始位置取得が成功したら書き込みを行う(例外処理ないけどね！)
        resetPromise.then(() => {
            // ここにリセットが完了した旨の通知メッセージを設定する
            return await msg.channel.send(
                // msg.author.username + 'さん、参加登録を受け付けました！・ｗ・\n' +
                // '記入ありがとですー・ｗ・/'
            );
        });

    });
}







/***************************
 * ここから下は消える予定
 ***************************/


 
/**
 * 拠点参加予定日すべてに一括入力する
 */
async function inputAttendanceBatch(gsapi, uInput, startingNumber) {

    // リクエストに添うように配列化
    let updateValues = [uInput];

    // 5行目から開始なので
    startingNumber = startingNumber + 5;

    // 書き換えオプション
    const updateOptions = {
        // スプレッドシートのID(タブの名前ではない)
        spreadsheetId: Env.TARGET_SPREADSHEET_ID,
        // 書き込むタブ(シート)と位置の指定
        range: Env.ATTENDANCE_SHEET_NAME + '!F' + startingNumber,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: updateValues
        },
    };

    // 書き換え実行
    let res = await gsapi.spreadsheets.values.update(updateOptions);

    // 結果をコンソールに出力
    console.log(res);
}

/**
 * 参加情報書き込み位置を取得する
 */
async function getStartingCellByUserId(gsapi, userName) {

    /**
     * 発言ユーザーの家名取得
     */
    // 家名取得のためのオプション
    const optForIndexing = {
        spreadsheetId: Env.TARGET_SPREADSHEET_ID,
        range: Env.DISCORD_USER_NAME_SHEET_NAME + '!B2:C'
    };

    // 家名リストの元データ取得
    let inGameNames = await gsapi.spreadsheets.values.get(optForIndexing);
    // 家名リスト抽出
    inGameNames = inGameNames.data.values;

    let targetFamilyName = '';

    // 発言ユーザーの家名をtargetFamilyNameに代入
    inGameNames.some(function (element) {
        if (element[1] == userName) {
            targetFamilyName = element[0];
            return true;
        }
    });

    /**
     * 家名から書き込み位置の計算
     */
    // 出欠確認シートは並びが変わっている場合があるため現在の並びを取得する
    const optForGettingStartingNumber = {
        spreadsheetId: Env.TARGET_SPREADSHEET_ID,
        range: Env.ATTENDANCE_SHEET_NAME + '!B5:B'
    };

    // 出欠確認シートの家名リストの元データ取得
    let familyNamesOrder = await gsapi.spreadsheets.values.get(optForGettingStartingNumber);
    // 出欠確認シートの家名リスト抽出
    familyNamesOrder = familyNamesOrder.data.values.flat();

    // 取得開始位置(デフォルト5に加算する数値)
    return familyNamesOrder.indexOf(targetFamilyName);
}


// async function inputAttendanceSpecified()
// @param array
