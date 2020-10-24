// Google Sheets API - JavaScript NodeJS Tutorial
// https://www.youtube.com/watch?v=MiPpQzW_ya0&t=32s

// dotenvの読み込み設定
require('dotenv').config();
const Env = process.env;





client.authorize(function (err, tokens) {

    // エラー時
    if (err) {
        console.log(err);
        return;
    }

    // 接続完了
    console.log('Connected!');
    gsrun(client);
});

async function gsrun(cl) {

    const gsapi = google.sheets({
        version:'v4',
        auth: cl
    });

    const opt = {
        spreadsheetId: Env.TEST_SPREADSHEET_ID,
        range: 'A1:B5'
    };

    // try {
        let data = await gsapi.spreadsheets.values.get(opt);
        let dataArray = data.data.values;
        let newDataArray = dataArray.map(function (r) {
            r.push(r[0] + '-' + r[1]);
            return r;
        });

        console.log(newDataArray);

    // } catch (e) {
    //     console.log(e);
    // };


    const updateOptions = {
        spreadsheetId: Env.TEST_SPREADSHEET_ID,
        range: 'E2',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: newDataArray
        },
    };

    // try {
        let res = gsapi.spreadsheets.values.update(updateOptions);
    // } catch (e) {
        // console.log(e);
    // }

    console.log();

}