<div align="center">

<img src="docs/images/banner.png" alt="logo">

[![NodeJS Engines](https://img.shields.io/node/v/bannerlord-helper?color=lightseagreen)](https://nodejs.org/docs/latest/api/)
[![Install Size](https://packagephobia.com/badge?p=bannerlord-helper)](https://packagephobia.com/result?p=bannerlord-helper)
[![NPM Downloads](https://img.shields.io/npm/d18m/bennerlord-helper?color=cornflowerblue)](https://www.npmjs.com/package/bannerlord-helper)
[![XO code style](https://shields.io/badge/code_style-5ed9c7?logo=xo&labelColor=gray&logoSize=auto&logoWidth=20)](https://github.com/xojs/xo)
[![License](https://img.shields.io/github/license/gengark/bannerlord-helper?color=slateblue)](LICENSE)

A utility for Node.js Cli for Mount & Blade II: Bannerlord

English | [简体中文](README.zh-CN.md) | [Türkçe](README.tr-TR.md)

</div>

## 📖 Introduction

> `search`: Search for mods on Nexusmod
>
> `info`: View local mod information
>
> `language`: Display the list of translatable languages
>
> `generate`: Generate translation templates (ModuleData)
>
> `translate`: Translate translation templates or one language into another (ModuleData)
>
> `localize`: Fill and repair translation identifiers and translate translatable mod files to the target language
> (ModuleData)
>
> `events`: Fill and repair translation identifiers and translate translatable mod files to the target language
> (Events) (*Experimental*)

## ⚙️ Installation

```bash
npm install bannerlord-helper -g
```

## 🚀 Usage

![Usage Screenshot](docs/images/usage-bilingual.png)

```bash
bh <command> [options]

Commands:
  bh search [query]         Search mods on Nexusmod             [aliases: query]
  bh info [keywords]        View local mod information           [aliases: view]
  bh language [codeOrName]  Display a list of supported languages[aliases: lang]
  bh generate [keywords]    Generate translation templates by completing transla
                            tion identifiers                      [aliases: gen]
  bh translate [keywords]   Translate from one language to another
                                                                [aliases: trans]
  bh localize [keywords]    Translate mod files to the target language
                                                               [aliases: locale]
  bh events [keywords]      Combined `generate` and `translate` commands for the
                             `Events` directory                    [aliases: ce]
  bh completion             generate completion script

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

Examples:
  $ bh -h            View CLI help information
  $ bh language -h   View help information for the `language` command
  $ bh [command] -h  View help information for a specific `command`
```

## 🌐 i18n

| Language Name       | Native Name | ISO-639-1 | ISO-3166-1 (Alpha-2) | file                                       |
|:--------------------|:-----------:|:---------:|:--------------------:|:-------------------------------------------|
| English             |      -      |    en     |          US          | [src/locale/en-US.ts](src/locale/en-US.ts) |
| German              |   Deutsch   |    de     |          DE          | [src/locale/de-DE.ts](src/locale/de-DE.ts) |
| Spanish             |   Español   |    es     |          ES          | [src/locale/es-ES.ts](src/locale/es-ES.ts) |
| French              |  Français   |    fr     |          FR          | [src/locale/fr-FR.ts](src/locale/fr-FR.ts) |
| Italian             |  Italiano   |    it     |          IT          | [src/locale/it-IT.ts](src/locale/it-IT.ts) |
| Japanese            |     日本語     |    ja     |          JP          | [src/locale/ja-JP.ts](src/locale/ja-JP.ts) |
| Korean              |     한국어     |    ko     |          KR          | [src/locale/ko-KR.ts](src/locale/ko-KR.ts) |
| Polish              |   Polski    |    pl     |          PL          | [src/locale/pl-PL.ts](src/locale/pl-PL.ts) |
| Portuguese          |  Português  |    pt     |          PT          | [src/locale/pt-PT.ts](src/locale/pt-PT.ts) |
| Russian             |   Русский   |    ru     |          RU          | [src/locale/ru-RU.ts](src/locale/ru-RU.ts) |
| Turkish             |   Türkçe    |    tr     |          TR          | [src/locale/tr-TR.ts](src/locale/tr-TR.ts) |
| Chinese Simplified  |    简体中文     |    zh     |          CN          | [src/locale/zh-CN.ts](src/locale/zh-CN.ts) |
| Chinese Traditional |    繁體中文     |    zh     |          TW          | [src/locale/zh-TW.ts](src/locale/zh-TW.ts) |

## 🎖️ Credits

- [node-translate](https://github.com/kabeep/node-translate) - 🦜 A powerful, secure and feature-rich api via Google
  Translation.
- [micro-translate-api](https://github.com/Chewawi/microsoft-translate-api) - A simple, powerful and free API for
  Microsoft Translator for Node.js

## 🤝 Contribution

Contributions via Pull Requests or [Issues](https://github.com/gengark/bannerlord-helper/issues) are welcome.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
