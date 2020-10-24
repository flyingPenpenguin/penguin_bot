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
 * function内で使用する定数
 */
// 週の拠点参加日(4日)のindex no
const dayNumbers = [
    1,
    2,
    3,
    4,
];

// 参加オプション
const attendanceOptions = [
    '参加',
    '不参加',
    '遅刻',
    '保留',
];

/**
 * ユーザーの発言に対しての処理
 * TODO : メッセージをpickupするチャンネルの制限
 */
discordClient.on('message', async msg => {
    // bot自身の発言は無視
    if (msg.author.bot) return;

    console.log(msg.author.username);


    // '拠点'で始まるメッセージをピック
    if (msg.content.startsWith('拠点')) {

        // メッセージを配列化
        let msgContent = msg.content.split('　');

        // '拠点'の後にスペースが入っていなければ終了
        if (msgContent[0] != '拠点') return;

        // 全入力モードなのか曜日指定モードなのかを最初の入力で判定する
        let firstItem = msgContent[1];

        switch (true) {
            /**
             * 曜日指定モード
             */
            // 最初の入力が整数 && 1~4の間である
            case (Number.isInteger(parseInt(firstItem)) && dayNumbers.includes(parseInt(firstItem))):

                // 先頭は拠点なので削除
                msgContent.shift();

                // バリデーションエラーがあるか
                let validationError = false;

                // 配列の長さが2か
                if (msgContent.length !== 2) {
                    validationError = true;
                };

                // 曜日番号
                let dayNum = parseInt(msgContent[0]);
                // 参加オプション
                let attendanceInput = msgContent[1];

                // 一つは1~4
                // 2つ目は参加 ~ 保留に正規表現マッチしているか
                if (
                    !dayNumbers.includes(dayNum) ||
                    !attendanceOptions.includes(attendanceInput)
                ) {
                    validationError = true;
                }

                // バリエーションエラーがある場合通知
                if (validationError) {
                    // 書式エラーの通知
                    msg.channel.send(
                        '書式にエラーがあるみたいです！・ｗ・\n' +
                        '"拠点"につづけて①曜日番号、②参加オプションの順で入力してください・ｗ・\n' +
                        '**曜日番号は半角数字、各要素の間は全角スペースを入れてください**・ｗ・\n' +
                        '\n' +
                        '```例) 拠点　2　不参加```\n' +
                        '\n' +
                        '[使用可能オプション]:\n' +
                        '参加、不参加、遅刻、保留' +
                        '\n' +
                        // TODO : 曜日オプションを環境変数化
                        '[曜日オプション]:\n' +
                        '1 : 火曜日\n' +
                        '2 : 木曜日\n' +
                        '3 : 金曜日\n' +
                        '4 : 日曜日\n'
                    );
                }

                // google api client.authorize
                googleClient.authorize(function (err, tokens) {

                    // エラー時
                    if (err) {
                        console.log(err);
                        return;
                    }

                    // 接続完了
                    console.log('Connected!');

                    // 全入力functionの呼び出し
                    inputAttendanceSpecified(googleClient, msgContent);
                });

                break; // case 1おわり

            /**
             * 全入力モード
             */
            // 最初の入力が文字列である
            case typeof firstItem == 'string':

                // 先頭は拠点なので削除
                msgContent.shift();

                // バリデーション用カウンター
                let validationSucceed = 0;

                // 拠点の後に続く文字列それぞれが参加オプションに登録されている文字列かのチェック
                msgContent.forEach(function (element) {
                    if (attendanceOptions.includes(element)) {
                        validationSucceed++;
                    }
                });

                // バリデーションでエラーがあれば処理終了
                if (validationSucceed !== 4) {
                    // 書式エラーの通知
                    msg.channel.send(
                        '書式にエラーがあるみたいです！・ｗ・\n' +
                        '"拠点"につづけて参加可否をオプションの中から選んで曜日ごとに**4つすべて**入力してください・ｗ・\n' +
                        '**各要素の間は全角スペースを入れてください**・ｗ・\n' +
                        '\n' +
                        '```　　　　　　1　　　2　　 3　　 4\n' +
                        '例) 拠点　参加　不参加　保留　参加```\n' +
                        '\n' +
                        '[使用可能オプション]:\n' +
                        '参加、不参加、遅刻、保留'
                    );

                    return;
                }

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
                    const startingNumPromise = Promise.resolve(getStartingCellByUserId(gsapi, msg.author.username));

                    // 書き込み開始位置取得が成功したら書き込みを行う(例外処理ないけどね！)
                    startingNumPromise.then((startingNumber) => {
                        // 全入力functionの呼び出し
                        inputAttendanceBatch(gsapi, msgContent, startingNumber);

                        msg.channel.send(
                            msg.author.username + 'さん、参加登録を受け付けました！・ｗ・\n' +
                            '記入ありがとですー・ｗ・/'
                        );
                    });

                }); // case 2おわり
        } // switchおわり
    }
});

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
        spreadsheetId: Env.TEST_SPREADSHEET_ID,
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
        spreadsheetId: Env.TEST_SPREADSHEET_ID,
        range: Env.DISCORD_USER_NAME_SHEET_NAME + '!B5:C'
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
        spreadsheetId: Env.TEST_SPREADSHEET_ID,
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
