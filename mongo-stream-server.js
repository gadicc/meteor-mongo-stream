import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Fiber from 'fibers';
import stream from 'stream';

const STDIN = 0;
const STDOUT = 1;
const STDERR = 2;

MongoStreamCol = new Mongo.Collection('mongoStream');

class MongoStream {

  constructor({stdout, stderr, id}) {
    this._id = id || Random.id();
    this.lastChunks = {};
    this.lastChunks[STDOUT] = 0;
    this.lastChunks[STDERR] = 0;

    // If this id was used before, delete previos entries.
    MongoStreamCol.remove({ p: this._id }, () => {});

    this.stdout = new stream.Writable();
    this.stdout._write = (chunk, encoding, done) => this.log(STDOUT, chunk, done);

    this.stderr = new stream.Writable();
    this.stderr._write = (chunk, encoding, done) => this.log(STDERR, chunk, done);

    if (stdout) this.stdout.pipe(stderr);
    if (stderr) this.stderr.pipe(stderr);
  }

  log(fd, chunk, done) {
    Fiber(() => {

      chunk = chunk.toString('utf8');

      try {

        if (chunk.match(/^\r/)) {

          // TODO, handle \n in middle of chunk
          MongoStreamCol.update({
            p: this._id,
            o: this.lastChunks[fd],
            f: fd
          }, { $set: {
            c: chunk.replace(/^\r/, '')
          }});

        } else {

          MongoStreamCol.insert({
            p: this._id,
            o: ++this.lastChunks[fd],
            f: fd,
            d: Date.now(),
            c: chunk
          });

        }

      } catch (err) {

        if (done)
          done(err);
      }

      if (done)
        done();

    }).run();

  }

}

// TODO, security
Meteor.publish('mongoStream', (id) => {
  check(id, String);
  return MongoStreamCol.find({ p: id })
});

export { MongoStream };
export default MongoStream;