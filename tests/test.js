/**
 The MIT License (MIT)

 Copyright (c) 2016 @biddster

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

"use strict";
var assert = require('assert');
var nodeRedModule = require('../index.js');

function Context(type) {
    this._values = {};
    this._type = type;
}

Context.prototype.get = function (key) {
    return this._values[key];
};

Context.prototype.set = function (key, value) {
    console.log(this._type + ' context: set [' + key + '] => [' + value + ']');
    this._values[key] = value;
};

function mock(nodeRedModule, config) {
    var _events = [], _status = undefined, _error = undefined, _messages = [], _context = new Context('node');
    _context.flow = new Context('flow');
    _context.global = new Context('global');
    var RED = {
        nodes: {
            registerType: function (nodeName, nodeConfigFunc) {
                this.nodeConfigFunc = nodeConfigFunc;
            },
            createNode: function () {
                // TODO write me
            }
        }
    };
    var node = {
        log: console.log,
        warn: console.log,
        error: function (error, msg) {
            console.log(error);
            if (error) _error = error;
            return _error;
        },
        on: function (event, eventFunc) {
            _events[event] = eventFunc;
        },
        emit: function (event, data) {
            _events[event](data);
        },
        status: function (status) {
            if (status) _status = status;
            return _status;
        },
        send: function (msg) {
            assert(msg);
            _messages.push(msg);
        },
        messages: function (messages) {
            if (messages) _messages = messages;
            return _messages;
        },
        context: function () {
            return _context;
        }
    };
    nodeRedModule(RED);
    RED.nodes.nodeConfigFunc.call(node, config);
    return node;
}

describe('latching-router', function () {

    it('should work ', function () {
        var node = mock(nodeRedModule, {
            outputs: 3
        });

        node.emit('input', {payload: {latchOutput: 1}});
        var msg0 = {payload: '0'};
        node.emit('input', msg0);
        assert.strictEqual(node.messages().length, 1);
        assert.strictEqual(node.messages()[0][0], msg0);

        node.emit('input', {payload: 'latchOutput2'});
        var msg1 = {payload: '1'};
        node.emit('input', msg1);
        assert.strictEqual(node.messages().length, 2);
        assert.strictEqual(node.messages()[1][1], msg1);

        var msg2 = {payload: '1'};
        node.emit('input', msg2);
        assert.strictEqual(node.messages().length, 3);
        assert.strictEqual(node.messages()[2][1], msg2);
    });

});
