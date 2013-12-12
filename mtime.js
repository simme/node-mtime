//
// # mtime
//
// Find last modification date of the given path. Can be recursive to find the
// date of the last modified file inside a directory.
//
// * **path**, path to check.
// * **recursive**, check all files in the given path if a dir. Return latest.
// * **callback**, if callback is provided the operation is done async.
//   Sync version will throw on error.
//

/* jslint node: true */
"use strict";

var fs   = require('fs');
var join = require('path').join;

module.exports = function mtimeAsync(path, recursive, fn) {
  if (typeof recursive === 'function') {
    fn = recursive;
    recursive = false;
  }
  fs.exists(path, function (exists) {
    if (!exists) {
      fn(new Error('Path: ' + path + ' not found'));
      return;
    }

    fs.stat(path, function (err, stat) {
      if (err) {
        fn(err);
        return;
      }

      if (stat.isFile() || stat.isDirectory() && !recursive) {
        fn(null, stat.mtime.getTime());
        return;
      }

      fs.readdir(path, function (err, files) {
        if (err) {
          fn(err);
          return;
        }

        var mtime = stat.mtime.getTime();
        function recurse(file) {
          mtimeAsync(file, true, function (err, t) {
            mtime = Math.max(mtime, t);
            var f = files.pop();
            if (!f) {
              fn(null, mtime);
              return;
            }
            recurse(join(path, f));
          });
        }

        recurse(join(path, files.pop()));
      });
    });
  });
};


module.exports.sync = function mtimeSync(path, recursive) {
  var exists = fs.existsSync(path);
  if (!exists) {
    throw new Error('Path: ' + path + ' not found');
  }

  var stat = fs.statSync(path);
  if (stat.isFile() || stat.isDirectory() && !recursive) {
    return stat.mtime.getTime();
  }

  var files = fs.readdirSync(path);
  var mtime = stat.mtime.getTime();
  files.forEach(function (file) {
    var time = mtimeSync(join(path, file), true);
    mtime = Math.max(mtime, time);
  });

  return mtime;
};

