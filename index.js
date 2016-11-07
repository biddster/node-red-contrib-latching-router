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

module.exports = function (RED) {
    'use strict';

    var _ = require('lodash');

    RED.nodes.registerType('latching-router', function (config) {

        RED.nodes.createNode(this, config);
        var node = this;
        if (!node.context().get('latchOutput')) {
            node.context().set('latchOutput', 1);
        }

        node.on('input', function (msg) {
            if (_.has(msg, 'payload.latchOutput')) {
                useLatchOutput(Number(msg.payload.latchOutput));
            } else if (_.isString(msg.payload) && msg.payload.indexOf('latchOutput') >= 0) {
                var match = /.*latchOutput.*(\d+)/.exec(msg.payload);
                useLatchOutput(Number(match[1]));
            } else {
                var msgs = new Array(config.outputs);
                msgs[node.context().get('latchOutput') - 1] = msg;
                node.send(msgs);
            }
        });

        function useLatchOutput(newOutput) {
            if (newOutput > config.outputs || newOutput < 1) {
                node.status({
                    fill: 'red',
                    shape: 'dot',
                    text: 'Invalid output ' + newOutput
                });
            } else {
                node.context().set('latchOutput', newOutput);
                indicateLatchedOutput();
            }
        }

        function indicateLatchedOutput() {
            node.status({
                fill: 'green',
                shape: 'dot',
                text: 'Output => ' + node.context().get('latchOutput')
            });
        }

        indicateLatchedOutput();
    });
};