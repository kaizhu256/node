// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';
const common = require('../common');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const tmpdir = require('../common/tmpdir');
tmpdir.refresh();

{
  // Test appendFile, appendFileSync, writeFile, writeFileSync
  // with lazy-mkdirp.
  [
    'appendFile',
    'writeFile'
  ].forEach((functionName) => {
    const functionNameSync = functionName + 'Sync';
    // Test async lazy-mkdirp multiple times to ensure EEXIST is ignored.
    [
      path.join(tmpdir.path, functionName + '/mkdirp/test1.txt'),
      path.join(tmpdir.path, functionName + '/mkdirp/test2.txt'),
      path.join(tmpdir.path, functionName + '/mkdirp/test3.txt'),
      path.join(tmpdir.path, functionName + '/mkdirp/test4.txt')
    ].forEach((pathname) => {
      fs[functionName](
        pathname,
        'hello world!',
        { mkdirp: true },
        common.mustSucceed(() => {
          fs.readFile(pathname, 'utf8', common.mustSucceed((data) => {
            // Validate data.
            assert.strictEqual(data, 'hello world!');
          }));
        })
      );
    });
    // Test sync lazy-mkdirp multiple times to ensure EEXIST is ignored.
    [
      path.join(tmpdir.path, functionNameSync + '/mkdirp/test1.txt'),
      path.join(tmpdir.path, functionNameSync + '/mkdirp/test2.txt'),
      path.join(tmpdir.path, functionNameSync + '/mkdirp/test3.txt'),
      path.join(tmpdir.path, functionNameSync + '/mkdirp/test4.txt')
    ].forEach((pathname) => {
      fs[functionNameSync](
        pathname,
        'hello world!',
        { mkdirp: true }
      );
      fs.readFile(pathname, 'utf8', common.mustSucceed((data) => {
        // Validate data.
        assert.strictEqual(data, 'hello world!');
      }));
    });
  });
}

{
  // Test appendFile, appendFileSync, writeFile, writeFileSync
  // will disables option mkdirp for flags missing O_CREAT.
  [
    'appendFile',
    'writeFile'
  ].forEach((functionName) => {
    const functionNameSync = functionName + 'Sync';
    [
      'r',   // O_RDONLY
      'rs',  // Fall through.
      'sr',  // O_RDONLY | O_SYNC
      'r+',  // O_RDWR
      'rs+', // Fall through.
      'sr+'  // O_RDWR | O_SYNC
    ].forEach((flag) => {
      // Test fs.writeFile(..., { flag: 'r', mkdirp: 'true' }, callback)
      // fails with 'ENOENT'.
      fs[functionName](
        path.join(tmpdir.path, 'enoent/enoent/test.txt'),
        'hello world!',
        { flag, mkdirp: true },
        common.mustCall((err) => {
          // Validate error 'ENOENT'.
          assert.strictEqual(err.code, 'ENOENT');
        })
      );
      // Test fs.writeFileSync(..., { flag: 'r', mkdirp: 'true' })
      // fails with 'ENOENT'.
      try {
        fs[functionNameSync](
          path.join(tmpdir.path, 'enoent/enoent/test.txt'),
          'hello world!',
          { flag, mkdirp: true }
        );
        throw new Error('fs.' + functionNameSync + ' should have failed.');
      } catch (errCaught) {
        // Validate error 'ENOENT'.
        assert.strictEqual(errCaught.code, 'ENOENT');
      }
    });
  });
}

{
  // Test openWithMkdirp, openWithMkdirpSync
  // with lazy-mkdirp.
  [
    'openWithMkdirp'
  ].forEach((functionName) => {
    const functionNameSync = functionName + 'Sync';
    // Test async lazy-mkdirp multiple times to ensure EEXIST is ignored.
    [
      path.join(tmpdir.path, functionName + '/mkdirp/test1.txt'),
      path.join(tmpdir.path, functionName + '/mkdirp/test2.txt'),
      path.join(tmpdir.path, functionName + '/mkdirp/test3.txt'),
      path.join(tmpdir.path, functionName + '/mkdirp/test4.txt')
    ].forEach((pathname) => {
      fs[functionName](
        pathname,
        'w',
        common.mustSucceed((fd) => {
          // cleanup fd
          fs.close(fd, common.mustSucceed(() => {}));
        })
      );
    });
    // Test sync lazy-mkdirp multiple times to ensure EEXIST is ignored.
    [
      path.join(tmpdir.path, functionNameSync + '/mkdirp/test1.txt'),
      path.join(tmpdir.path, functionNameSync + '/mkdirp/test2.txt'),
      path.join(tmpdir.path, functionNameSync + '/mkdirp/test3.txt'),
      path.join(tmpdir.path, functionNameSync + '/mkdirp/test4.txt')
    ].forEach((pathname) => {
      const fd = fs[functionNameSync](
        pathname,
        'w'
      );
      // cleanup fd
      fs.close(fd, common.mustSucceed(() => {}));
    });
  });
}

{
  // Test openWithMkdirp, openWithMkdirpSync
  // will disables option mkdirp for flags missing O_CREAT.
  [
    'openWithMkdirp'
  ].forEach((functionName) => {
    const functionNameSync = functionName + 'Sync';
    [
      'r',   // O_RDONLY
      'rs',  // Fall through.
      'sr',  // O_RDONLY | O_SYNC
      'r+',  // O_RDWR
      'rs+', // Fall through.
      'sr+'  // O_RDWR | O_SYNC
    ].forEach((flag) => {
      // Test fs.openWithMkdirp(..., { flag: 'r', mkdirp: 'true' }, callback)
      // fails with 'ENOENT'.
      fs[functionName](
        path.join(tmpdir.path, 'enoent/enoent/test.txt'),
        flag,
        common.mustCall((err) => {
          // Validate error 'ENOENT'.
          assert.strictEqual(err.code, 'ENOENT');
        })
      );
      // Test fs.openWithMkdirpSync(..., { flag: 'r', mkdirp: 'true' })
      // fails with 'ENOENT'.
      try {
        fs[functionNameSync](
          path.join(tmpdir.path, 'enoent/enoent/test.txt'),
          flag
        );
        throw new Error('fs.' + functionNameSync + ' should have failed.');
      } catch (errCaught) {
        // Validate error 'ENOENT'.
        assert.strictEqual(errCaught.code, 'ENOENT');
      }
    });
  });
}
