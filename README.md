<div align="center">

<img src="docs/images/banner.png" alt="logo">

[![NodeJS Engines](https://img.shields.io/node/v/bannerlord-helper?color=lightseagreen)](https://nodejs.org/docs/latest/api/)
[![Install Size](https://packagephobia.com/badge?p=bannerlord-helper)](https://packagephobia.com/result?p=bannerlord-helper)
[![NPM Downloads](https://img.shields.io/npm/d18m/bannerlord-helper?color=cornflowerblue)](https://www.npmjs.com/package/bannerlord-helper)
[![XO code style](https://shields.io/badge/code_style-5ed9c7?logo=xo&labelColor=gray&logoSize=auto&logoWidth=20)](https://github.com/xojs/xo)
[![License](https://img.shields.io/github/license/gengark/bannerlord-helper?color=slateblue)](LICENSE)

English | [简体中文](README.zh-CN.md) | [Türkçe](README.tr-TR.md)

</div>

> [!IMPORTANT]
>
> Only Windows supported.
> For detail, see [node-steam-library](https://github.com/kabeep/node-steam-library)
> and [winreg](https://github.com/fresc81/node-winreg).

## 📖 Introduction

A collection of useful tools dedicated to making i18n works easier for Mount & Blade II: Bannerlord mod creators.

## 💡 Why bannerlord-helper?

`bannerlord-helper` assists ***translation contributors*** in quickly creating localized files and translations that
adhere to the official directory structure and XML content standards, **allowing them to focus solely on the
translation work.**

Even with frequent updates to the source mod, `bannerlord-helper` identifier algorithm ensures that translations from
previous versions are preserved and reused, **meaning your past efforts are never wasted.**

For ***players / enthusiasts***, `bannerlord-helper` offers a fast and accurate way to translate mods without
internationalization into your language with **just a single command, and then you can enjoy the game right away.**

## ⚙️ Prerequisites

- make sure that the [Node version 18+](https://nodejs.org/en) is installed on the computer
- the installation path exists in the operating system or user environment variable.

## 📦 Installation

1. Install this cli through NPM in any terminal (cmd/bash/powershell/...).

    ```bash
    npm install bannerlord-helper --global
    ```

2. Run the help command to check whether the cli is installed successfully.

    ```bash
    bh -h
    ```

## 🚀 Usage

![Bilingual Screenshot](docs/images/usage-bilingual.png)

```
bh <command> [options]

Commands:
  bh search [keywords]      Search mods on Nexusmod            [aliases: browse]
  bh info                   Retrieve local module details and update information
                                                                [aliases: query]
  bh identifier             Populate and fix translation flags for local mods
                                                                [aliases: ident]
  bh generate               Generate translation template files for local module
                            s                                     [aliases: gen]
  bh translate              Translate the translation template files for local m
                            odules                              [aliases: trans]
  bh external               Translate local modules to plug-in translation modul
                            es                                    [aliases: ext]
  bh language [codeOrName]  Show list of supported languages     [aliases: lang]
  bh completion             generate completion script

Options:
      --engine   translation engine (Default by microsoft)
      [string] [choices: "microsoft", "google", "deeplx"] [default: "microsoft"]
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

Examples:
  $ bh -h                         View command line help information
  $ bh language -h                View help information for the langua
                                            ge command
  $ bh [command] -h               View help information for the specif
                                            ied command
  $ bh [command] --engine google  Use Google Translate Engine
  $ bh [command] --engine deeplx  Translate using Deeplx
```

## 🕹️ Command

### Environment Variables

| Name         | Default | Description                      |
|:-------------|:-------:|:---------------------------------|
| DEEPLX_PORT  |  1188   | Local service port of DeepLX     |
| DEEPLX_TOKEN |    -    | Access token to protect your API |

### Common Options

| Name    |  Type   | Abbr | Required |             Choices             |   Default   | Description                               |
|:--------|:-------:|:----:|:--------:|:-------------------------------:|:-----------:|:------------------------------------------|
| engine  | string  |  -   |    No    | "microsoft", "google", "deeplx" | "microsoft" | translation engine (Default by microsoft) |
| help    | boolean |  h   |    No    |                -                |      -      | Show help                                 |
| version | boolean |  v   |    No    |                -                |      -      | Show version number                       |

### search

Alias: browse

> Search mods on `Nexusmod`

| Option   |  Type  | Abbr | Required | Default | Description                                          |
|:---------|:------:|:----:|:--------:|:-------:|:-----------------------------------------------------|
| keywords | string |  k   |   Yes    |    -    | Module name keyword                                  |
| language | string |  l   |    No    |  "EN"   | Translate language codes for Nexusmod mod list names |

**Example**

- `$ bh search "ButterLib"`: Show details of the Butter Lib module on Nexusmod in the terminal
- `$ bh search "改良驻军" --language="cns"`: Use Simplified Chinese to search for modules and translate the search
  result names
- `$ bh search "Diplomacia" --language="sp" --engine="google"`: Find and translate modules in Spanish via Google
  Translate
- `$ bh browse -k Diplomacy -l tr`: Use aliases to simplify command lines

### info

Alias: query

> Query local module details and update information

| Option   |  Type   | Abbr | Required | Default | Description                                       |
|:---------|:-------:|:----:|:--------:|:-------:|:--------------------------------------------------|
| language | string  |  l   |    No    |  "EN"   | Translate language codes for local mod list names |
| reset    | boolean |  r   |    No    |  false  | Reindex selected mods linked to Nexusmod          |

**Example**

- `$ bh info --language="cns"`: Translate search result names using Simplified Chinese
- `$ bh view -l cns`: Use aliases to simplify command lines

### identifier

Alias: ident

> Populate and fix translation flags for local mods

| Option   |  Type  | Abbr | Required | Default | Description                                       |
|:---------|:------:|:----:|:--------:|:-------:|:--------------------------------------------------|
| language | string |  l   |    No    |  "EN"   | Translate language codes for local mod list names |

**Example**

- `$ bh identifier --language="cns"`: Translate search result names using Simplified Chinese
- `$ bh ident -l cns`: Use aliases to simplify command lines

### generate

Alias: gen

> Generate translation template files for local modules

| Option   |  Type   | Abbr | Required | Default | Description                                                 |
|:---------|:-------:|:----:|:--------:|:-------:|:------------------------------------------------------------|
| language | string  |  l   |    No    |  "EN"   | Translate language codes for local mod list names           |
| to       | string  |  t   |    No    |  "EN"   | Target language code (the language of the source file text) |
| force    | boolean |  -   |    No    |  false  | Clear existing files and regenerate templates               |

**Example**

- `$ bh generate`: Generate a translation English template and export it to the Languages root directory
- `$ bh generate -to="tr"`: Generate translation Turkish template and export to Languages/TR directory
- `$ bh generate -to="chinese simplified"`: Generate a translation Simplified Chinese template and export it to the
  Languages/CNs directory
- `$ bh gen -t cns`: Use aliases to simplify command lines

### translate

Alias: trans

> Translate the translation template files for local modules

| Option |  Type  | Abbr | Required | Default | Description                           |
|:-------|:------:|:----:|:--------:|:-------:|:--------------------------------------|
| to     | string |  t   |   Yes    |    -    | target language code                  |
| from   | string |  f   |    No    |  "EN"   | Source text language code             |
| prefix | string |  p   |    No    |    -    | Add a prefix to each translated text  |
| force  | string |  -   |    No    |  false  | Clear existing files and re-translate |

**Example**

- `$ bh translate --to="cns"`: Translate the English translation template in the Languages root directory into
  Simplified Chinese and export it to the Languages/CNs directory
- `$ bh translate --from="cns" --to="Japanese"`: Translate the Simplified Chinese template in the Languages/CNs
  directory into Japanese and generate it to the Languages/JP root directory
- `$ bh translate --to="cns" --prefix="[CNS]"`: Translate the English template into Simplified Chinese and generate it
  into the Languages/CNs directory, and add the [CNS] prefix to each translated text
- `$ bh translate --to="cns" --force`: Clear the Languages/CNs directory and translate the English template into
  Simplified Chinese, and export it to the Languages/CNs directory
- `$ bh trans -f en -t cns -p [CNS]`: Use aliases to simplify command lines

### external

Alias: ext

> Translate local modules to plug-in translation modules

| Option |  Type  | Abbr | Required | Default | Description                           |
|:-------|:------:|:----:|:--------:|:-------:|:--------------------------------------|
| to     | string |  t   |   Yes    |    -    | target language code                  |
| from   | string |  f   |    No    |  "EN"   | Source text language code             |
| prefix | string |  p   |    No    |    -    | Add a prefix to each translated text  |
| force  | string |  -   |    No    |  false  | Clear existing files and re-translate |

**Example**

- `$ bh external --to="cns"`: Translate the source file into a Simplified Chinese template and export it to the
  ../Module Name CNs/ModuleData directory
- `$ bh external --to="cns" --prefix="[CNS]"`: Translate the source file into Simplified Chinese, export it to the
  ../Module Name CNs/ModuleData directory, and add the [CNS] prefix to each translated text
- `$ bh external --to="cns" --force`: Clear the ../Module Name CNs/ModuleData directory, translate the source files into
  Simplified Chinese, and generate them into the Languages/CNs directory
- `$ bh ext -f en -t cns -p [CNS]`: Use aliases to simplify command lines

### language

Alias: lang

> Show list of supported languages

| Option       |  Type  | Abbr | Required | Default | Description                    |
|:-------------|:------:|:----:|:--------:|:-------:|:-------------------------------|
| code-or-name | string |  -   |    No    |    -    | Language code or language name |

**Example**

- `$ bh language`: Show details of the Butter Lib module on Nexusmod in the terminal
- `$ bh language cns`: View the language names and localized names of language code CNs
- `$ bh lang`: Use aliases to simplify command lines

## ♾️ Workflow

![Workflow Image](./docs/images/workflow.png)

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

## 📍 Roadmap

- [x] Refactor Core Code
- [x] Optimize i18n Management
- [x] Fine-grained Code
- [x] Support DeepLX
- [x] Support xslt file
- [x] Support plug-in translation module
- [x] Fix the Issue of {=!} Not Being Translated
- [x] Resolve UTC Date Issue with Nexusmod Data
- [x] Enhance Translation Identifier for Reused Text Items
- [x] Configurable XML Recognition Path
- [ ] Command sugar
- [ ] Single File Processing Feature
- [ ] Conversion Between Language Files and XLSX

## 🏅 Credits

- [node-steam-library](https://github.com/kabeep/node-steam-library) - Obtain the installation directory and application
  list of Steam through the Windows registry.
- [node-translate](https://github.com/kabeep/node-translate) - 🦜 A powerful, secure and feature-rich api via Google
  Translation.
- [micro-translate-api](https://github.com/Chewawi/microsoft-translate-api) - A simple, powerful and free API for
  Microsoft Translator for Node.js
- [node-translate-i18n](https://github.com/kabeep/node-translate-i18n) - 🌏 A command-line interface tool for translating
  localization files to other languages.

## 🤝 Contribution

Contributions via Pull Requests or [Issues](https://github.com/gengark/bannerlord-helper/issues) are welcome.

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dontkillchicken"><img src="https://avatars.githubusercontent.com/u/40334029?v=4?s=100" width="100px;" alt="dontkillchicken"/><br /><sub><b>dontkillchicken</b></sub></a><br /><a href="mailto:1587409536@qq.com" title="Email">✉️</a><a href="https://bbs.mountblade.com.cn/forum.php?mod=viewthread&tid=2097412&highlight=%E6%B1%89%E5%8C%96%E6%95%99%E7%A8%8B" title="Blog">📝</a><a href="#" title="Question">💬</a><a href="#" title="Data">🔣</a></td>
    </tr>
  </tbody>
</table>

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
