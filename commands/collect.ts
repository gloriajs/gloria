// import logger from '../lib/utils/logger';
// import config from '../lib/core/project.config';
// import _collect from '../lib/commands/collect';
import fs from 'fs';
import * as yargs from 'yargs';

/**
 * Normally called as part of another command, but it can be used
 * directly for debugging purposes.
 * When given an output argument it will write the results and
 * additional information to disk in a json file.
 *
 * Default include-paths are pages and posts.
 * @param {string} argv.dest If present, write result to destination file
 */
const collect = (argv: any) => {
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
    type: 'string',
    default: 'build',
  },
});

console.log({ options });

export const command = 'collect';
export const builder = options;
export const handler = collect;
export const alliases = [];
export const describe = 'Collects source files in the project folder';
