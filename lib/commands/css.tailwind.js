const logger = require('../utils/logger');
const tailwind = require("tailwindcss");
const postcss = require("postcss");
const fs = require('fs');

/**
 * Creates the resulting CSS by reading all the pages and getting the tailwind classes
 *
 * @param {*} project
 * @returns project
 */
const run = (project) => {
  const promise = new Promise((resolve, reject) => {
    const { html, config } = project;
    if (!html) {
      logger.error('Missing html data at css step');
      return reject();
    }

    (async () => {
      const result = await postcss([
        tailwind({
          //...config,
          content: [`${config.dest}/**/*.{html,js,md}`],
        }),
      ]).process(`@tailwind base;@tailwind components;@tailwind utilities;`, {
        from: undefined,
      });

      fs.writeFileSync(`${config.dest}/main.css`, result.css);
    })();

    return resolve(project);
  });

  return promise;
};

module.exports = {
  run,
};
