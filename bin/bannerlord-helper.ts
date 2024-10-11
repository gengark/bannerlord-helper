#!/usr/bin/env node
import process from 'node:process';
import Exception from '@kabeep/exception';
import chalk from 'chalk';
import yargs, { type Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
    $t,
    external,
    type ExternalCommandOptions,
    generate,
    type GenerateCommandOptions,
    identifier,
    type IdentifierCommandOptions,
    info,
    type InfoCommandOptions,
    language,
    type LanguageCommandOptions,
    search,
    type SearchCommandOptions,
    translate,
    type TranslateCommandOptions,
} from '../src';

void yargs(hideBin(process.argv))
    .scriptName('bh')
    .usage($t('CMD_USAGE'))
    .options({
        engine: {
            type: 'string',
            choices: ['microsoft', 'google', 'deeplx'],
            describe: `${$t('CMD_USAGE_OPT_ENGINE')} (Default by microsoft)`,
            default: 'microsoft',
        },
    })
    .command(
        ['search [keywords]', 'browse'],
        $t('CMD_SEARCH_USAGE'),
        (yargs: Argv<SearchCommandOptions>) => {
            return yargs
                .option('keywords', {
                    type: 'string',
                    alias: 'k',
                    describe: $t('CMD_USAGE_OPT_KEYWORDS'),
                    demandOption: true,
                })
                .option('language', {
                    type: 'string',
                    alias: 'l',
                    describe: $t('CMD_USAGE_OPT_LANGUAGE'),
                })
                .example(chalk.yellow('$ bh search "ButterLib"'), $t('CMD_SEARCH_USAGE_EG'))
                .example(chalk.yellow('$ bh search "改良驻军" --language="cns"'), $t('CMD_SEARCH_USAGE_EG_LANGUAGE'))
                .example(
                    chalk.yellow('$ bh search "Diplomacia" --language="sp" --engine="google"'),
                    $t('CMD_SEARCH_USAGE_EG_GOOGLE'),
                )
                .example(chalk.yellow('$ bh browse -k Diplomacy -l tr'), $t('CMD_USAGE_EG_ALIAS'));
        },
        boundary<[SearchCommandOptions]>(search),
    )
    .command(
        ['info', 'query'],
        $t('CMD_INFO_USAGE'),
        (yargs: Argv<InfoCommandOptions>) => {
            return yargs
                .option('language', {
                    type: 'string',
                    alias: 'l',
                    describe: $t('CMD_USAGE_OPT_LANGUAGE'),
                })
                .option('reset', {
                    type: 'boolean',
                    alias: 'r',
                    describe: $t('CMD_INFO_USAGE_OPT_RESET'),
                })
                .example(chalk.yellow('$ bh info --language="cns"'), $t('CMD_INFO_USAGE_EG_LANGUAGE'))
                .example(chalk.yellow('$ bh view -l cns'), $t('CMD_USAGE_EG_ALIAS'))
                .epilog(chalk.grey(`* ${$t('CMD_INFO_USAGE_EPILOG_WORKSHOP')}`));
        },
        boundary<[InfoCommandOptions]>(info),
    )
    .command(
        ['identifier', 'ident'],
        $t('CMD_IDENTIFIER_USAGE'),
        (yargs: Argv<IdentifierCommandOptions>) => {
            return yargs
                .option('language', {
                    type: 'string',
                    alias: 'l',
                    describe: $t('CMD_USAGE_OPT_LANGUAGE'),
                })
                .example(chalk.yellow('$ bh identifier --language="cns"'), $t('CMD_IDENTIFIER_USAGE_EG_LANGUAGE'))
                .example(chalk.yellow('$ bh ident -l cns'), $t('CMD_USAGE_EG_ALIAS'))
                .epilog(chalk.grey(`* ${$t('CMD_INFO_USAGE_EPILOG_WORKSHOP')}`));
        },
        boundary<[IdentifierCommandOptions]>(identifier),
    )
    .command(
        ['generate', 'gen'],
        $t('CMD_GENERATE_USAGE'),
        (yargs: Argv<GenerateCommandOptions>) => {
            return yargs
                .option('language', {
                    type: 'string',
                    alias: 'l',
                    describe: $t('CMD_USAGE_OPT_LANGUAGE'),
                })
                .option('to', {
                    type: 'string',
                    alias: 't',
                    describe: $t('CMD_GENERATE_USAGE_OPT_TO'),
                    default: 'EN',
                })
                .option('force', {
                    type: 'boolean',
                    describe: $t('CMD_GENERATE_USAGE_OPT_FORCE'),
                    default: false,
                })
                .example(chalk.yellow('$ bh generate'), $t('CMD_GENERATE_USAGE_EG_GENERATE'))
                .example(chalk.yellow('$ bh generate -to="tr"'), $t('CMD_GENERATE_USAGE_EG_TO_CODE'))
                .example(chalk.yellow('$ bh generate -to="chinese simplified"'), $t('CMD_GENERATE_USAGE_EG_TO_NAME'))
                .example(chalk.yellow('$ bh gen -t cns'), $t('CMD_USAGE_EG_ALIAS'))
                .epilog(chalk.grey(`* ${$t('CMD_INFO_USAGE_EPILOG_WORKSHOP')}`));
        },
        boundary<[GenerateCommandOptions]>(generate),
    )
    .command(
        ['translate', 'trans'],
        $t('CMD_TRANSLATE_USAGE'),
        (yargs: Argv<TranslateCommandOptions>) => {
            return yargs
                .option('to', {
                    type: 'string',
                    alias: 't',
                    describe: $t('CMD_TRANSLATE_USAGE_OPT_TO'),
                    demandOption: true,
                })
                .option('from', {
                    type: 'string',
                    alias: 'f',
                    describe: $t('CMD_TRANSLATE_USAGE_OPT_FROM'),
                    default: 'EN',
                })
                .option('prefix', {
                    type: 'string',
                    alias: 'p',
                    describe: $t('CMD_TRANSLATE_USAGE_OPT_PREFIX'),
                })
                .option('force', {
                    type: 'boolean',
                    describe: $t('CMD_TRANSLATE_USAGE_OPT_FORCE'),
                    default: false,
                })
                .example(chalk.yellow('$ bh translate --to="cns"'), $t('CMD_TRANSLATE_USAGE_EG_TO_CODE'))
                .example(chalk.yellow('$ bh translate --from="cns" --to="Japanese"'), $t('CMD_TRANSLATE_USAGE_EG_FROM'))
                .example(
                    chalk.yellow('$ bh translate --to="cns" --prefix="[CNS]"'),
                    $t('CMD_TRANSLATE_USAGE_EG_PREFIX'),
                )
                .example(chalk.yellow('$ bh translate --to="cns" --force'), $t('CMD_TRANSLATE_USAGE_EG_FORCE'))
                .example(chalk.yellow('$ bh trans -f en -t cns -p [CNS]'), $t('CMD_USAGE_EG_ALIAS'))
                .epilog(chalk.grey(`* ${$t('CMD_INFO_USAGE_EPILOG_WORKSHOP')}`));
        },
        boundary<[TranslateCommandOptions]>(translate),
    )
    .command(
        ['external', 'ext'],
        $t('CMD_EXTERNAL_USAGE'),
        (yargs: Argv<ExternalCommandOptions>) => {
            return yargs
                .option('to', {
                    type: 'string',
                    alias: 't',
                    describe: $t('CMD_EXTERNAL_USAGE_OPT_TO'),
                    demandOption: true,
                })
                .option('from', {
                    type: 'string',
                    alias: 'f',
                    describe: $t('CMD_EXTERNAL_USAGE_OPT_FROM'),
                    default: 'EN',
                })
                .option('prefix', {
                    type: 'string',
                    alias: 'p',
                    describe: $t('CMD_EXTERNAL_USAGE_OPT_PREFIX'),
                })
                .option('force', {
                    type: 'boolean',
                    describe: $t('CMD_EXTERNAL_USAGE_OPT_FORCE'),
                    default: false,
                })
                .example(chalk.yellow('$ bh external --to="cns"'), $t('CMD_EXTERNAL_USAGE_EG_TO_CODE'))
                .example(chalk.yellow('$ bh external --to="cns" --prefix="[CNS]"'), $t('CMD_EXTERNAL_USAGE_EG_PREFIX'))
                .example(chalk.yellow('$ bh external --to="cns" --force'), $t('CMD_EXTERNAL_USAGE_EG_FORCE'))
                .example(chalk.yellow('$ bh ext -f en -t cns -p [CNS]'), $t('CMD_USAGE_EG_ALIAS'))
                .epilog(chalk.grey(`* ${$t('CMD_INFO_USAGE_EPILOG_WORKSHOP')}`));
        },
        boundary<[ExternalCommandOptions]>(external),
    )
    .command(
        ['language [codeOrName]', 'lang'],
        $t('CMD_LANGUAGE_USAGE'),
        (yargs: Argv<LanguageCommandOptions>) => {
            return yargs
                .option('code-or-name', {
                    type: 'string',
                    describe: $t('CMD_LANGUAGE_USAGE_OPT_CODE_OR_NAME'),
                })
                .example(chalk.yellow('$ bh language'), $t('CMD_LANGUAGE_USAGE_EG'))
                .example(chalk.yellow('$ bh language cns'), $t('CMD_LANGUAGE_USAGE_EG_TARGET'))
                .example(chalk.yellow('$ bh lang'), $t('CMD_USAGE_EG_ALIAS'));
        },
        boundary<[LanguageCommandOptions]>(language),
    )
    .example([
        [chalk.yellow('$ bh -h'), $t('CMD_USAGE_EG_HELP')],
        [chalk.yellow('$ bh language -h'), $t('CMD_USAGE_EG_LANGUAGE_HELP')],
        [chalk.yellow('$ bh [command] -h'), $t('CMD_USAGE_EG_COMMAND_HELP')],
        [chalk.yellow('$ bh [command] --engine google'), $t('CMD_USAGE_EG_GOOGLE_ENGINE')],
        [chalk.yellow('$ bh [command] --engine deeplx'), $t('CMD_USAGE_EG_DEEPLX_ENGINE')],
    ])
    .epilog(chalk.grey(`* ${$t('CMD_USAGE_EPILOG_A')}`))
    .epilog(chalk.grey(`* ${$t('CMD_USAGE_EPILOG_B')}`))
    .epilog(chalk.grey(`* ${$t('CMD_USAGE_EPILOG_C')}`))
    .epilog(chalk.grey(`* ${$t('CMD_USAGE_EPILOG_D')}`))
    .epilog(chalk.grey(`* ${$t('CMD_USAGE_EPILOG_E')}`))
    .epilog(chalk.grey(`* ${$t('CMD_USAGE_EPILOG_F')}`))
    .demandCommand()
    .alias({
        h: 'help',
        v: 'version',
    })
    .completion()
    .parse();

function boundary<T extends any[] = any[], R = any>(function_: (...arguments_: T) => R | void | Promise<R | void>) {
    return async function (...arguments_: T): Promise<R | void> {
        try {
            await function_(...arguments_);
            process.exit(0);
        } catch (error: unknown) {
            const exception = new Exception(error as Error);
            console.log(exception);
            process.exit(1);
        }
    };
}

export {
    type ExternalCommandOptions,
    type GenerateCommandOptions,
    external,
    type IdentifierCommandOptions,
    generate,
    type InfoCommandOptions,
    identifier,
    type SearchCommandOptions,
    info,
    type LanguageCommandOptions,
    search,
    type TranslateCommandOptions,
    language,
    translate,
} from '../src';
