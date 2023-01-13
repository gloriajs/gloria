/**
 * Contains the rules we use to filter files during the prebuild process
 * @param {object} item representing a file and its attributes
 */
const rejectPrebuild = (item /* project */) => {
  if (item.isDir) {
    return true;
  }

  if (item.path.endsWith('.draft.md')) {
    return true;
  }
};

module.exports = {
  rejectPrebuild,
};
