# node-red-contrib-latching-router

A simple routing node that will latch the output and route all subsequent messages to that output.

E.g. Drag the node into your workspace and configure it to have 3 outputs. Send a string payload of `latchOutput 3`
to the node. This will cause the node to route all subsequent messages to output 3.

Outputs are not zero indexed. So `latchOutput 1` will route subsequent messages to the 1st output.

Messages which alter the latch are consumed and do not get sent via an output.


## Installation
 
Change directory to your node red installation:

    $ npm install node-red-contrib-latching-router
    
### Configuration


There isn't much to configure. Choose the number of outputs you need. The minimum is 2 as it makes no sense
to only have 1 output for this node.