# discord_bot
###Copyright (c) 2020 flyingPenpenguin. All rights reserved.

// Node.jsのインストール
[ ~]$ yum install -y @nodejs:12/common

// プロジェクトフォルダの作成
[ ~]$ mkdir penguin_bot

[ ~]$ cd penguin_bot/

[ penguin_bot]$ npm init
// 適当に

// gitをインストールする(アカウントが必要です)
[ penguin_bot]$ npm install git

// インストールできているか確認
[ penguin_bot]$ git --version
git version 2.18.2

// git init
[ penguin_bot]$ git init

// sshキーの登録をするのでいったんホームディレクトリへ
[ penguin_bot]$ cd ~

[ ~]$ mkdir .ssh

[ ~]$ cd .ssh

[ .ssh]$ ssh-keygen -t rsa
// 3回くらい聞かれるのですべてそのままエンター

[ penguin_bot]$ cd ~
[ ~]$ cd .ssh

[ .ssh]$ cat id_rsa.pub
// 中身をコピーしてGitHubの[Add SSH key]から登録する

// ログインできるか確認
[ .ssh]$ ssh -T git@github.com
The authenticity of host 'github.com (IPあどれす)' can't be established.
RSA key fingerprint is SHA256:YOUR_KEY.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'github.com,IPあどれす' (RSA) to the list of known hosts.
Hi flyingPenpenguin! You've successfully authenticated, but GitHub does not provide shell access.

[ .ssh]$ cd ~/penguin_bot/

// git cloneする
[ penguin_bot]$ git clone git@github.com:flyingPenpenguin/penguin_bot.git

// google API
[ penguin_bot]$ npm install googleapis@39 --save

[ penguin_bot]$ npm install dotenv

[ penguin_bot]$ npm install discord.js

[ penguin_bot]$ node ./notification.js
ぺんぎんbotでログイン成功しました。




https://qiita.com/yuto0214w/items/1ecee25efca6b5b7445b