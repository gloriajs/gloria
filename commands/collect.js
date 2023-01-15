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
Object.defineProperty(exports, "__esModule", { value: true });
exports.describe = exports.alliases = exports.handler = exports.builder = exports.command = void 0;
const yargs = __importStar(require("yargs"));
/**
 * Normally called as part of another command, but it can be used
 * directly for debugging purposes.
 * When given an output argument it will write the results and
 * additional information to disk in a json file.
 *
 * Default include-paths are pages and posts.
 * @param {string} argv.dest If present, write result to destination file
 */
const collect = (argv) => {
    const project = {
    // config: config.get(),
    };
    // _collect.run(project).then((project) => {
    //   const { config } = project;
    //   if (argv.dest) {
    //     const dest = `./${argv.dest}/collected.${config._hash}.json`;
    //     const ztring = JSON.stringify(project.collected);
    //     fs.writeFileSync(dest, ztring);
    //   }
    // logger.log(project.collected);
    console.log({ argv, project });
    return project;
    // });
};
const options = yargs.options({
    dest: {
        default: 'build',
    },
});
const argv = yargs(process.argv.slice(2)).options({
    a: { type: 'boolean', default: false },
    b: { type: 'string', demandOption: true },
    c: { type: 'number', alias: 'chill' },
    d: { type: 'array' },
    e: { type: 'count' },
    f: { choices: ['1', '2', '3'] },
});
console.log({ argv, options });
exports.command = 'collect';
exports.builder = options;
exports.handler = collect;
exports.alliases = [];
exports.describe = 'Collects source files in the project folder';
