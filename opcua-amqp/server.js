var console = require("console");
//var setTimeout = require("setTimeout");
var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();
var endpointUrl = "opc.tcp://127.0.0.1:8087";