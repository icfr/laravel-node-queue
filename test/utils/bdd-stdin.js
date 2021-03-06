'use strict';

var mockStdin = require('mock-stdin');
var self;
const waitAnswer = 300;
var BddStdin = function BddStdin() {
  if (!(this instanceof BddStdin)) {
    throw new Error('bdd stdin not initialised');
  }
  this.stdin = mockStdin.stdin();

  self = this;
  return this;
};

BddStdin.prototype.type = function type(responses) {
  if (arguments.length > 1) {
    responses = Array.prototype.slice.call(arguments, 0);
  }
  if (typeof responses === 'string') {
    responses = [responses];
  }

  if (!Array.isArray(responses)) {
    throw new Error('Expected array of responses, not ' + JSON.stringify(responses, null, 2));
  }
  if (responses.length < 1) {
    throw new Error('Expected at least 1 response, not ' + JSON.stringify(responses, null, 2));
  }

  var key = 0;
  var sendAnswer = function sendAnswer() {
    setTimeout(function timeoutSendAnswer() {
      var text = responses[key];
      if (typeof text !== 'string') {
        throw new Error('Should give only text responses ' + JSON.stringify(responses, null, 2));
      }
      self.stdin.send(text);
      key += 1;
      if (key < responses.length) {
        sendAnswer();
      }
    }, waitAnswer);
  };
  sendAnswer();
};

BddStdin.keys = Object.freeze({
  up: '\u001b[A',
  down: '\u001b[B',
  left: '\u001b[D',
  right: '\u001b[C',
  delete: '\u0008'
});

module.exports = BddStdin;

