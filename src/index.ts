#!/usr/bin/env node

import { Command } from 'commander'
import { version } from '../package.json' with { type: 'json' }
import {tw} from "./tw";

const program = new Command();

program.name('palette-maker')
program.description('Our New CLI');
program.version(version, '-v, --version');

program.command('tw')
    .description('Tailwind palette')
    .option('-n, --name [NAME]', 'color name', 'primary')
    .argument('<string>', 'color')
    .action((arg, options) => {
        const shades = tw(arg)
        shades.forEach((s) => {
            console.log(`--color-${options.name}-${s.level}: ${s.css};`)
        })
    })

async function main() {
    await program.parseAsync();
}

main().then(() => console.log());
