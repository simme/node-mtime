# mtime

Grabs the last modification date for a given path.

The modification date will be returned as a UNIX timestamp (in _ms_).

## API

* `mtime('/path/to/file/or/directory', [recursive], callback)`. If recursive is
set to `true` the timestamp of the last modified file within that directory
(including the directory itself) will be returned.
* `mtime.sync('/path', [recursive])`. Does an async op to find out the last
modification date of the given path. Will throw any error that occurs.

