import ansi_up from 'ansi_up';

import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

import { blazeToReact } from 'meteor/gadicc:blaze-react-component';

import './mongo-stream-client.html';

MongoStreamCol = new Mongo.Collection('mongoStream');

Template.mongoStream.onCreated(function() {
  this.autorun(() => {
    var data = Template.currentData();
    if (data.id)
      this.subscribe("mongoStream", data.id);
  });
});

Template.mongoStream.helpers({
  chunks() {
    return MongoStreamCol.find({ p: this.id }, { sort: { o: 1 }} );
  },
  chunk(c) {
    scrollDown(Template.instance());

    return ansi_up.linkify(
      ansi_up.ansi_to_html(
        ansi_up.escape_for_html(
          this.c
        )
      )
    );
  }
});

var scrollDown = _.debounce((tpl) => {
  var div = tpl.$('.mongoStream');
  div.scrollTop(div.prop('scrollHeight'));
}, 50);

const MongoStream = blazeToReact('mongoStream');

export { MongoStream };
export default MongoStream;
