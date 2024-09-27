#!/usr/bin/env node
import chalk from 'chalk';
import yargs, { type Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import type {
    EventsCommandOption,
    GenerateCommandOption,
    InfoCommandOption,
    LanguageCommandOption,
    LocalizeCommandOption,
    SearchCommandOption,
    TranslateCommandOption,
} from '../src/index.js';
import { events, generate, info, language, locale, localize, search, translate } from '../src/index.js';

yargs(hideBin(process.argv))
    .scriptName('bh')
    .usage(locale.USAGE)
    // @ts-ignore TS2769: No overload matches this call. (Caused by required parameters `query`)
    .command(['search [query]', 'query'], locale.USAGE_DESC_SEARCH, (yargs: Argv<SearchCommandOption>) => {
        return yargs
            .option('query', {
                type: 'string',
                alias: 'q',
                describe: locale.USAGE_OPT_QUERY,
                demandOption: true,
            })
            .option('open', {
                type: 'boolean',
                alias: 'o',
                describe: locale.USAGE_OPT_OPEN,
            })
            .option('open-router', {
                type: 'string',
                describe: `${locale.USAGE_OPT_OPEN_ROUTER_SUMMARY} (Power by OpenRouter)`,
            })
            .option('google', {
                type: 'boolean',
                describe: `${locale.USAGE_OPT_GOOGLE} (Bing by Default)`,
            })
            .example(chalk.yellow('$ bh search "ButterLib"'), locale.USAGE_EG_SEARCH)
            .example(chalk.yellow('$ bh search "Butter Lib" --open'), locale.USAGE_EG_BROWSE)
            .example(chalk.yellow('$ bh query ButterLib --google'), locale.USAGE_EG_GOOGLE)
            .example(
                chalk.yellow('$ bh query "ButterLib" --open-router="xx-xx-xx-xxx..."'),
                locale.USAGE_EG_OPEN_ROUTER,
            );
    }, boundary<[SearchCommandOption]>(search))
    .command(['info [keywords]', 'view'], locale.USAGE_DESC_INFO, (yargs: Argv<InfoCommandOption>) => {
        return yargs
            .option('keywords', {
                type: 'string',
                alias: 'k',
                describe: locale.USAGE_OPT_KEYWORDS,
            })
            .option('reset', {
                type: 'boolean',
                alias: 'r',
                describe: locale.USAGE_OPT_RESET,
            })
            .option('google', {
                type: 'boolean',
                describe: `${locale.USAGE_OPT_GOOGLE} (Bing by Default)`,
            })
            .example(chalk.yellow('$ bh info'), locale.USAGE_EG_INFO)
            .example(chalk.yellow('$ bh info "Butter"'), locale.USAGE_EG_INFO_KEYWORDS)
            .example(chalk.yellow('$ bh view --google'), locale.USAGE_EG_GOOGLE)
            .example(chalk.yellow('$ bh view --reset'), locale.USAGE_EG_INFO_RESET)
            .epilog(chalk.grey(`* ${locale.USAGE_EPILOG_WITHOUT_SUBSCRIBE}\n* ${locale.USAGE_EPILOG_WITHOUT_SUBSCRIBE}`));
    }, boundary<[InfoCommandOption]>(info))
    .command(['language [codeOrName]', 'lang'], locale.USAGE_DESC_LANG, (yargs: Argv<LanguageCommandOption>) => {
        return yargs
            .option('code-or-name', {
                type: 'string',
                describe: locale.USAGE_OPT_CODE_OR_NAME,
            })
            .example(chalk.yellow('$ bh language'), locale.USAGE_EG_LANG)
            .example(chalk.yellow('$ bh language cns'), locale.USAGE_EG_LANG_CODE);
    }, boundary<[LanguageCommandOption]>(language))
    .command(['generate [keywords]', 'gen'], locale.USAGE_DESC_GEN, (yargs: Argv<GenerateCommandOption>) => {
        return yargs
            .option('keywords', {
                type: 'string',
                alias: 'k',
                describe: locale.USAGE_OPT_KEYWORDS,
            })
            .option('to', {
                type: 'string',
                alias: 't',
                describe: `${locale.USAGE_OPT_TO} (EN by Default)`,
            })
            .option('google', {
                type: 'boolean',
                describe: `${locale.USAGE_OPT_GOOGLE} (Bing by Default)`,
            })
            .example(chalk.yellow('$ bh generate'), locale.USAGE_EG_GEN)
            .example(chalk.yellow('$ bh gen StoreMode -t jp'), locale.USAGE_EG_GEN_SEARCH)
            .example(chalk.yellow('$ bh gen -to="chinese simplified"'), locale.USAGE_EG_GEN_LANGUAGE)
            .epilog(chalk.grey(`* ${locale.USAGE_EPILOG_WITHOUT_SUBSCRIBE}\n* ${locale.USAGE_EPILOG_EXPORT}\n* USAGE_EPILOG_SOURCE_SAFE`));
    }, boundary<[GenerateCommandOption]>(generate))
    // @ts-ignore TS2769: No overload matches this call. (Caused by required parameters `to`)
    .command(['translate [keywords]', 'trans'], locale.USAGE_DESC_TRANSLATE, (yargs: Argv<TranslateCommandOption>) => {
        return yargs
            .option('keywords', {
                type: 'string',
                alias: 'k',
                describe: locale.USAGE_OPT_KEYWORDS,
            })
            .option('to', {
                type: 'string',
                alias: 't',
                describe: locale.USAGE_OPT_TO,
                demandOption: true,
            })
            .option('from', {
                type: 'string',
                alias: 'f',
                describe: `${locale.USAGE_OPT_FROM} (EN by Default)`,
            })
            .option('prefix', {
                type: 'string',
                alias: 'p',
                describe: locale.USAGE_OPT_PREFIX,
            })
            .option('google', {
                type: 'boolean',
                describe: `${locale.USAGE_OPT_GOOGLE} (Bing by Default)`,
            })
            .example(chalk.yellow('$ bh translate -t cns'), locale.USAGE_EG_TRANS)
            .example(chalk.yellow('$ bh translate -from cns -t Japanese'), locale.USAGE_EG_TRANS_APPOINT)
            .example(chalk.yellow('$ bh translate -t cns -p="[CNS]"'), locale.USAGE_EG_TRANS_PREFIX)
            .epilog(chalk.grey(`* ${locale.USAGE_EPILOG_WITHOUT_SUBSCRIBE}\n* ${locale.USAGE_EPILOG_SOURCE_SAFE}`));
    }, boundary<[TranslateCommandOption]>(translate))
    .command(
        ['localize [keywords]', 'locale'],
        locale.USAGE_DESC_LOCALE,
        // @ts-ignore TS2769: No overload matches this call. (Caused by required parameters `to`)
        (yargs: Argv<LocalizeCommandOption>) => {
            return yargs
                .option('keywords', {
                    type: 'string',
                    alias: 'k',
                    describe: locale.USAGE_OPT_KEYWORDS,
                })
                .option('to', {
                    type: 'string',
                    alias: 't',
                    describe: locale.USAGE_OPT_TO,
                    demandOption: true,
                })
                .option('prefix', {
                    type: 'string',
                    alias: 'p',
                    describe: locale.USAGE_OPT_PREFIX,
                })
                .option('google', {
                    type: 'boolean',
                    describe: `${locale.USAGE_OPT_GOOGLE} (Bing by Default)`,
                })
                .example(chalk.yellow('$ bh localize -t cns'), locale.USAGE_EG_LOCALIZE)
                .example(chalk.yellow('$ bh locale -t cns Sandbox'), locale.USAGE_EG_LOCALIZE_SEARCH)
                .example(
                    chalk.yellow('$ bh locale "Open Source Armory" -t cns -p="[OSA]"'),
                    locale.USAGE_EG_LOCALIZE_PREFIX,
                )
                .epilog(chalk.grey(`* ${locale.USAGE_EPILOG_WITHOUT_SUBSCRIBE}\n* ${locale.USAGE_EPILOG_TRANSLATE_SIGN}`));
        },
        boundary<[LocalizeCommandOption]>(localize),
    )
    .command(['events [keywords]', 'ce'], locale.USAGE_DESC_EVENTS, (yargs: Argv<EventsCommandOption>) => {
        return yargs
            .option('keywords', {
                type: 'string',
                alias: 'k',
                describe: locale.USAGE_OPT_KEYWORDS,
            })
            .option('to', {
                type: 'string',
                alias: 't',
                describe: locale.USAGE_OPT_TO,
            })
            .option('google', {
                type: 'boolean',
                describe: `${locale.USAGE_OPT_GOOGLE} (Bing by Default)`,
            })
            .option('open-router', {
                type: 'string',
                describe: `${locale.USAGE_OPT_OPEN_ROUTER_SUMMARY} (Power by OpenRouter)`,
            })
            .example(chalk.yellow('$ bh events'), locale.USAGE_EG_EVENTS)
            .example(chalk.yellow('$ bh events -t cns'), locale.USAGE_EG_EVENTS_TO);
    }, boundary<[EventsCommandOption]>(events))
    .demandCommand()
    .example([
        [chalk.yellow('$ bh -h'), locale.USAGE_EG_HELP],
        [chalk.yellow('$ bh language -h'), locale.USAGE_EG_COMMAND_LANG],
        [chalk.yellow('$ bh [command] -h'), locale.USAGE_EG_COMMAND],
    ])
    .alias({
        h: 'help',
        v: 'version',
    })
    .completion()
    .parse();

function boundary<T extends any[] = any[], R = any>(fn: (...args: T) => R | void | Promise<R | void>) {
    return async function (...args: T): Promise<R | void> {
        try {
            return await fn.apply(null, args);
        } catch (err: unknown) {
            if (process.env.NODE_ENV === 'production') {
                console.log(
                    chalk.black.bgRed(' UNCAUGHT ERROR '),
                    '\n',
                    (
                        err as Error
                    )?.message,
                );
                process.exit(1);
            } else {
                console.log(err);
                process.exit(1);
            }
        }
    };
}
