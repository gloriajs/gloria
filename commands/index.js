"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const collect = __importStar(require("./collect"));
const launch = (argv) => {
    const yargs = (0, yargs_1.default)((0, helpers_1.hideBin)(argv));
    yargs
        .scriptName('gloria')
        // .commandDir(`./commands`)
        .usage('$0 <cmd> [args]')
        .command(collect)
        // .command()
        .coerce('times', (value) => {
        // value is not typed, but it is fine
        // at this point port is actual string you passed to the app
        // or the default value so it should be `string | number`
        // in this case
        const result = Number(value);
        if (isNaN(result)) {
            throw new Error('Times is not a number');
        }
        return result;
    })
        .help();
    return yargs;
};
// import pg from './package.json';
// const { version } = pg;
// .commandDir(`./commands`)
// process.bin = process.title = `gloria`;
// `Gloria is a static site generator. Use the command init to get started.`,
// )
// .epilogue(
//   `For more information, check out the documentation in github.com/gloriajs/gloria`,
// ).argv;
// .options({
//   write: {
//     type: 'boolean',
//     default: true,
//     description: 'Write the resulting files to disk',
//   },
//   logs: { type: 'boolean', default: false, description: '' },
//   dest: { type: 'string', default: 'build', demandOption: true },
//   tempfolder: { type: 'string', default: 'temp' },
//   difficulty: {
//     choices: ['normal', 'nightmare', 'hell'] as const,
//     alias: 'dificultad',
//   },
//   turbo: { type: 'boolean', default: true },
//   times: { type: 'count' },
// })
exports.default = launch;
