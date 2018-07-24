'use strict';

const test = require('ava');
const fs = require('fs');
const {promisify} = require('util');
const temp = require('./');
const pathExists = require('path-exists');
const writeFile = promisify(fs.writeFile);

test.serial.afterEach(async () => {
  await temp.cleanup();
});

test.serial('file()', async t => {
  t.true(typeof temp.file() === 'string');
  t.true(temp.file() !== temp.file());
});

test.serial('directory()', async t => {
  t.true(typeof temp.directory() === 'string');
  t.true(temp.directory() !== temp.directory());
  t.true(await pathExists(temp.directory()));
});

test.serial('root', async t => {
  t.true(typeof temp.root === 'string');
});

test.serial('cleanup', async t => {
  let fp = temp.file();
  let dp = temp.directory();
  await writeFile(fp, 'hello world');

  t.true(await pathExists(fp));
  t.true(await pathExists(dp));

  await temp.cleanup();

  t.false(await pathExists(fp));
  t.false(await pathExists(dp));
});

test.serial('standalone()', async t => {
  let temp2 = temp.standalone();

  let one = temp.directory();
  let two = temp2.directory();

  t.true(await pathExists(one));
  t.true(await pathExists(two));

  await temp2.cleanup();

  t.true(await pathExists(one));
  t.false(await pathExists(two));

  // inverse
  two = temp2.directory();

  t.true(await pathExists(one));
  t.true(await pathExists(two));

  await temp.cleanup();

  t.false(await pathExists(one));
  t.true(await pathExists(two));
});
