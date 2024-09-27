<div align="center">

<img src="docs/images/banner.png" alt="logo">

[![NodeJS Engines](https://img.shields.io/node/v/bannerlord-helper?color=lightseagreen)](https://nodejs.org/docs/latest/api/)
[![Install Size](https://packagephobia.com/badge?p=bannerlord-helper)](https://packagephobia.com/result?p=bannerlord-helper)
[![NPM Downloads](https://img.shields.io/npm/d18m/bennerlord-helper?color=cornflowerblue)](https://www.npmjs.com/package/bannerlord-helper)
[![XO code style](https://shields.io/badge/code_style-5ed9c7?logo=xo&labelColor=gray&logoSize=auto&logoWidth=20)](https://github.com/xojs/xo)
[![License](https://img.shields.io/github/license/gengark/bannerlord-helper?color=slateblue)](LICENSE)

一个用于 《Mount & Blade II: Bannerlord》 的 Node.js 命令行实用工具

</div>

## 📖 简介

> `search`: 在 Nexusmod 上搜索模组
>
> `info`: 查看本地模组信息
>
> `language`: 展示可翻译的语言列表
>
> `generate`: 生成翻译模板
>
> `translate`: 将翻译模板或一种语言翻译成另一种语言
>
> `localize`: 填充和修复翻译标识，并将可翻译模组文件翻译到目标语言 (ModuleData)
>
> `events`: 填充和修复翻译标识，并将可翻译模组文件翻译到目标语言 (Events)

## ⚙️ 安装

```bash
npm install bannerlord-helper -g
```

## 🚀 使用

![Usage Screenshot](docs/images/usage-bilingual.png)

```bash
bh <命令> [选项]

命令：
  bh search [query]         在Nexusmod上搜寻模组                          [aliases: query]
  bh info [keywords]        查看用户本地模组信息                            [aliases: view]
  bh language [codeOrName]  展示受支持的语言列表                            [aliases: lang]
  bh generate [keywords]    补全翻译标识生成翻译模板                          [aliases: gen]
  bh translate [keywords]   将一种翻译语言翻译成另一种语言                   [aliases: trans]
  bh localize [keywords]    翻译模组文件到目标语言                         [aliases: locale]
  bh events [keywords]      作用于 `Events` 目录的 `generate` 与 `translate` 的组合命令
                                                                             [aliases: ce]
  bh completion             generate completion script

选项：
  -h, --help     显示帮助信息                                                        [布尔]
  -v, --version  显示版本号                                                          [布尔]

示例：
  $ bh -h            查看命令行帮助信息
  $ bh language -h   查看 `language` 命令的帮助信息
  $ bh [command] -h  查看指定 `command` 的帮助信息
```

## 🌐 国际化

| 语言名称                |   当地名称    | ISO-639-1 | ISO-3166-1 (Alpha-2) | 文件                                         |
|:--------------------|:---------:|:---------:|:--------------------:|:-------------------------------------------|
| English             |     -     |    en     |          US          | [src/locale/en-US.ts](src/locale/en-US.ts) |
| German              |  Deutsch  |    de     |          DE          | [src/locale/de-DE.ts](src/locale/de-DE.ts) |
| Spanish             |  Español  |    es     |          ES          | [src/locale/es-ES.ts](src/locale/es-ES.ts) |
| French              | Français  |    fr     |          FR          | [src/locale/fr-FR.ts](src/locale/fr-FR.ts) |
| Italian             | Italiano  |    it     |          IT          | [src/locale/it-IT.ts](src/locale/it-IT.ts) |
| Japanese            |    日本語    |    ja     |          JP          | [src/locale/ja-JP.ts](src/locale/ja-JP.ts) |
| Korean              |    한국어    |    ko     |          KR          | [src/locale/ko-KR.ts](src/locale/ko-KR.ts) |
| Polish              |  Polski   |    pl     |          PL          | [src/locale/pl-PL.ts](src/locale/pl-PL.ts) |
| Portuguese          | Português |    pt     |          PT          | [src/locale/pt-PT.ts](src/locale/pt-PT.ts) |
| Russian             |  Русский  |    ru     |          RU          | [src/locale/ru-RU.ts](src/locale/ru-RU.ts) |
| Turkish             |  Türkçe   |    tr     |          TR          | [src/locale/tr-TR.ts](src/locale/tr-TR.ts) |
| Chinese Simplified  |   简体中文    |    zh     |          CN          | [src/locale/zh-CN.ts](src/locale/zh-CN.ts) |
| Chinese Traditional |   繁體中文    |    zh     |          TW          | [src/locale/zh-TW.ts](src/locale/zh-TW.ts) |

## 🔗 致谢

- [node-translate](https://github.com/kabeep/node-translate) - 🦜 一个强大、安全且功能丰富的 API，通过 Google 翻译
- [micro-translate-api](https://github.com/Chewawi/microsoft-translate-api) - 适用于 Node.js 的 Microsoft Translator
  的简单、强大且免费的 API

## 🤝 贡献

欢迎通过 Pull Requests 或 [Issues](https://github.com/gengark/bannerlord-helper/issues) 来贡献你的想法和代码。

## 📄 许可

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。
