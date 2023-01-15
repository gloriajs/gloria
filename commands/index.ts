import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import * as collect from './collect';

const launch = (argv: string[]) => {
  const yargs = _yargs(hideBin(argv));
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

export default launch;
