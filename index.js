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
    const _ = require('lodash');

    RED.nodes.registerType('latching-router', function (config) {
        RED.nodes.createNode(this, config);
        // eslint-disable-next-line consistent-this
        const node = this;

        const indicateLatchedOutput = function () {
            node.status({
                fill: 'green',
                shape: 'dot',
                text: 'Output => ' + node.context().get('latchOutput'),
            });
        };

        const useLatchOutput = function (newOutput) {
            if (newOutput > config.outputs || newOutput < 1) {
                node.status({
                    fill: 'red',
                    shape: 'dot',
                    text: 'Invalid output ' + newOutput,
                });
            } else {
                node.context().set('latchOutput', newOutput);
                indicateLatchedOutput();
            }
        };

        if (!node.context().get('latchOutput')) {
            node.context().set('latchOutput', 1);
        }

        node.on('input', (msg) => {
            if (_.has(msg, 'payload.latchOutput')) {
                useLatchOutput(Number(msg.payload.latchOutput));
            } else if (_.isString(msg.payload) && msg.payload.indexOf('latchOutput') >= 0) {
                const match = /.*latchOutput.*(\d+)/.exec(msg.payload);
                useLatchOutput(Number(match[1]));
            } else {
                const msgs = new Array(config.outputs);
                msgs[node.context().get('latchOutput') - 1] = msg;
                node.send(msgs);
            }
        });

        indicateLatchedOutput();
    });
};
