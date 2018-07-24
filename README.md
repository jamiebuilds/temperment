# temperment

> Get a random temporary file or directory path that will delete itself

## Install

```sh
yarn add temperment
```

## Usage

Same interface as [tempy](https://github.com/sindresorhus/tempy):

```js
const temp = require('temperment');

temp.file(); // "/private/var/folders/9w/8285f7cn29d74zlvk4b2tclh0000gp/T/679be05150c143aec8c08e35b9f2235a"
temp.file({ name: 'foo' }); // "/private/var/folders/9w/8285f7cn29d74zlvk4b2tclh0000gp/T/7ee0b6d4d6fbfa9cf644ad367642815a/foo.txt"
temp.file({ extension: 'txt' }); // "/private/var/folders/9w/8285f7cn29d74zlvk4b2tclh0000gp/T/93b1abc869d30c0ef79c61790d264e6c.txt"
temp.directory(); // "/private/var/folders/9w/8285f7cn29d74zlvk4b2tclh0000gp/T/a1663ccd3f5b1230e6390f549ed02b24"
temp.root; // "/private/var/folders/9w/8285f7cn29d74zlvk4b2tclh0000gp/T"
```

Manually clean files up asynchronously

```js
const temp = require('temperment');
const fs = require('fs');
const pathExists = require('path-exists');

let fp = temp.file();
pathExists.sync(fp); // false
fs.writeFileSync(fp, 'hello');
pathExists.sync(fp); // true

await temp.cleanup();

pathExists.sync(dir); // false
```

Manually clean files up synchronously

```js
const fs = require('fs');
const pathExists = require('path-exists');

const temp = require('temperment');

let fp = temp.file();
pathExists.sync(fp); // false
fs.writeFileSync(fp, 'hello');
pathExists.sync(fp); // true

temp.cleanup.sync();

pathExists.sync(dir); // false
```

However, you don't need to clean files up. This will happen automatically when
the process exits (even on errors).

You can also make a standalone instance of temperment where you won't
accidentally delete someone else's temp files and they won't accidentally
delete yours:

```js
const temperment = require('temperment');
const temp = temperment.standalone();

temp.file();
temp.directory();

await temp.cleanup(); // only delete your own files
await temperment.cleanup(); // won't delete files created by `temp`
```
