# MongoStream

*Record and live stream streams (stdout/stderr/anything) to the browser* 

Copyright (c) 2016 by Gadi Cohen <dragon@wastelands.net>, released under GPLv3.

## Usage

### On the Server

#### Method 1: passing a stream

```js
var ms = new MongoStream({
  id: 'uniqueId'  // optional.  generated if not given at ms._id
  stdout: child_process.stdout,
  stderr: child_process.stdin
});
```

#### Method 2: piping

```js
var ms = new MongoStream();
child_process.stdout.pipe(ms.stdout);
```

### On the Client

#### Blaze

{{>mongoStream id=id}}

#### React

<MongoStream id={id} />

## How it works

Under the hood this relies on Mongo and Blaze.  The truth is Meteor's
original core is much better for this (right now) than Relay / React,
etc.  But we do supply a React wrapper.

Long term there could be a better way, but we did specifically want
to retrieve the stream at a later point (i.e. to view log files),
so storing in a database too was a design decision.

Each chunk received is stored as a separate doc in the mongoStream
collection.  Carriage returns (\r) are merged into the most recent
doc.  ANSI colors are converted to HTML.

## Security

### Log retrieval

Currently the only security is to rely on knowing the unique ID.

### Log display

'<' etc characters are escaped, so in theory, no unsafe HTML should
ever be presented.
