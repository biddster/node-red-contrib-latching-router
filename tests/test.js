/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
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

const Assert = require('assert');
const NodeRedModule = require('../index.js');
const Mock = require('node-red-contrib-mock-node');

describe('latching-router', function () {
    it('should work ', function () {
        const node = Mock(NodeRedModule, {
            outputs: 3,
        });

        node.emit('input', { payload: { latchOutput: 1 } });
        const msg0 = { payload: '0' };
        node.emit('input', msg0);
        Assert.strictEqual(node.sent().length, 1);
        Assert.strictEqual(node.sent(0)[0], msg0);

        node.emit('input', { payload: 'latchOutput2' });
        const msg1 = { payload: '1' };
        node.emit('input', msg1);
        Assert.strictEqual(node.sent().length, 2);
        Assert.strictEqual(node.sent(1)[1], msg1);

        const msg2 = { payload: '1' };
        node.emit('input', msg2);
        Assert.strictEqual(node.sent().length, 3);
        Assert.strictEqual(node.sent(2)[1], msg2);
    });
});
