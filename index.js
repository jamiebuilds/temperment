// @flow
'use strict';

const tempy = require('tempy');
const del = require('del');
const onExit = require('signal-exit');

const root = tempy.root;

/*::
type FileOpts = {
  name?: string,
  extension?: string,
};

type FileSet = Set<string>;
*/

function standalone() {
  let created = new Set();

  function file(opts /*: FileOpts */) {
    let filePath = tempy.file(opts);
    created.add(filePath);
    return filePath;
  }

  function directory() {
    let filePath = tempy.directory();
    created.add(filePath);
    return filePath;
  }

  async function cleanup() {
    await del(Array.from(created), { force: true });
    created.clear();
  }

  function cleanupSync() {
    del.sync(Array.from(created), { force: true });
    created.clear();
  }

  cleanup.sync = cleanupSync;

  onExit(() => {
    cleanupSync();
  });

  return {
    file,
    directory,
    root,
    cleanup,
    standalone,
  };
}

module.exports = standalone();
