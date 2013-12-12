var assert = require('assert');
var mtime  = require('..');
var touch  = require('touch');
var mkdirp = require('mkdirp');
var fs     = require('fs');
var rimraf = require('rimraf');

function m(file) {
  return (fs.statSync(file)).mtime.getTime();
}

var ms = Date.now();
function nd() {
  ms = ms += 360000;
  var d = new Date(ms);
  return d;
}

suite('mtime', function () {
  // Create some random files in /tmp
  setup(function (done) {
    mkdirp.sync('/tmp/_mtime', 0777);
    mkdirp.sync('/tmp/_mtime/foo', 0777);
    mkdirp.sync('/tmp/_mtime/bar/baz', 0777);
    touch.sync('/tmp/_mtime/a', { mtime: nd()});
    touch.sync('/tmp/_mtime/b', { mtime: nd()});
    touch.sync('/tmp/_mtime/c', { mtime: nd()});
    touch.sync('/tmp/_mtime/foo/1', { mtime: nd()});
    touch.sync('/tmp/_mtime/foo/2', { mtime: nd()});
    touch.sync('/tmp/_mtime/foo/3', { mtime: nd()});
    touch.sync('/tmp/_mtime/bar/1', { mtime: nd()});
    touch.sync('/tmp/_mtime/bar/2', { mtime: nd()});
    touch.sync('/tmp/_mtime/bar/3', { mtime: nd()});
    touch.sync('/tmp/_mtime/bar/baz/1', { mtime: nd()});
    touch.sync('/tmp/_mtime/bar/baz/2', { mtime: nd()});
    touch.sync('/tmp/_mtime/bar/baz/3', { mtime: nd()});
    done();
  });

  // Delete test files
  teardown(function () {
    try {
      rimraf.sync('/tmp/_mtime');
    }
    catch (e) {
      console.log('\t**Failed to delete test files.**');
      console.log('\t%s', e);
    }
  });

  test('Sync mtime works', function () {
    var t = mtime.sync('/tmp/_mtime');
    var x = m('/tmp/_mtime');
    assert.equal(t, x);

    t = mtime.sync('/tmp/_mtime/foo/1');
    x = m('/tmp/_mtime/foo/1');
    assert.equal(t, x);
  });

  test('Recursive sync mtime works', function () {
    var t = mtime.sync('/tmp/_mtime', true);
    var x = m('/tmp/_mtime/bar/baz/3');

    t = mtime.sync('/tmp/_mtime/foo', true);
    x = m('/tmp/_mtime/foo/3');
  });

  test('Async mtime works', function (done) {
    mtime('/tmp/_mtime/a', function (err, t) {
      assert(!err);
      var x = m('/tmp/_mtime/a');
      assert.equal(t, x);
      done();
    });
  });

  test('Recursive async mtime works', function (done) {
    mtime('/tmp/_mtime/', true, function (err, t) {
      assert(!err);
      var x = m('/tmp/_mtime/bar/baz/3');
      assert.equal(t, x);
      done();
    });
  });
});

