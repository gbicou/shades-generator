#!/usr/bin/env node

import {Command} from 'commander'
import {version} from '../package.json' with {type: 'json'}
import {shades, ShadesProjection} from "./shades";

const program = new Command();

program.name('palette-maker')
program.description('Build a palette');
program.version(version, '-v, --version');

program
    .option('-n, --name [NAME]', 'color name', 'primary')
    .option('--delta [DELTA]', 'delta luminance', parseFloat)
    .option('--range-base [RANGE_BASE]', 'range base', parseFloat)
    .option('--bezier', 'use bezier projection', false)
    .argument('<color>', 'base color')
    .action((arg, options) => {
        shades(arg, {
            ...options,
            projection: options.bezier ? ShadesProjection.BEZIER : ShadesProjection.LINEAR
        }).forEach((shade) => {
            console.log(`--color-${options.name}-${shade.level}: ${shade.css};`)
        })
    })

async function main() {
    await program.parseAsync();
}

main().then(() => console.log());
