<div align="center">
    <h1>Discord.js Example Bot</h1>
    <p>
        <a href="https://discord.gg/PTTGPsYwjX"><img src="https://img.shields.io/discord/1270549796742238208?color=5865F2&logo=discord&logoColor=white" alt="Discord" /></a>
    </p>
</div>

## 概要

[Discord.js](https://discord.js.org/) を使用した Discord Bot のサンプルリポジトリです。

- [English](README.md)
- [简体中文 (Chinese)](README-zh.md)

## 使い方

### 1. 依存パッケージのインストール

Windows の場合は、コマンドプロンプトで以下を実行してください。

```
setup.bat
```

もしくは、

```
bun i
```

### 2. ボットの起動

```
bun run src/index.ts
```

### 3. ボットのアップデート

```
bun run update
```

または、Discord 上で `/update` コマンドを実行してください（Bot のコンフィグの管理者権限が必要です）。

## リンク

- [Discord サーバー](https://discord.gg/PTTGPsYwjX)

## オープンソースライセンス

このプロジェクトは MIT ライセンスで公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

### 使用ライブラリ

- [discord.js](https://github.com/discordjs/discord.js) - [MIT License](https://github.com/discordjs/discord.js/blob/main/LICENSE)
- [boxen](https://github.com/sindresorhus/boxen) - [MIT License](https://github.com/sindresorhus/boxen/blob/main/license)
- [chalk](https://github.com/chalk/chalk) - [MIT License](https://github.com/chalk/chalk/blob/main/license)
- [dotenv](https://github.com/motdotla/dotenv) - [BSD-2-Clause License](https://github.com/motdotla/dotenv/blob/main/LICENSE)
