var console = require("console");
//var setTimeout = require("setTimeout");
var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();
var url = "opc.tcp://127.0.0.1:8087"; // simulaattori

var istunto, tilaus;

async.series([


    // Yhdist‰minen OPC UA -palvelimeen
    function (callback) {

        client.connect(url, function (err) {
            if (err) {
                console.log("virhe");
            }
            else {
                console.log("yhdistetty palvelimeen: ", url);
            }
            callback(err);
        });
    },


    // Istunnon luonti
    function (callback) {
        client.createSession(function (err, i) {
            if (!err) {
                istunto = i;
            }
            callback(err);
        });
    },


    // Tilauksen luonti
    function (callback) {
        tilaus = new opcua.ClientSubscription(istunto, {
            requestedPublishingInterval: 1000,
            requestedLifetimeCount: 10,
            requestedMaxKeepAliveCount: 2,
            maxNotificationsPerPublish: 10,
            publishingEnabled: true,
            priority: 10
        });

        tilaus.on("started", function () {
            console.log("subscription started for 2 seconds - subscriptionId=", tilaus.subscriptionId);
        }).on("keepalive", function () {
            console.log("keepalive");
        }).on("terminated", function () {
            callback();
        });

        // lis‰t‰‰n seurattava kohde
        var monitoredItem = tilaus.monitor({
            nodeId: opcua.resolveNodeId("ns=2;s=eq_states.EQ_V102"),
            attributeId: opcua.AttributeIds.Value
        },
        {
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 10
        }
        );

        monitoredItem.on("changed", function (dataValue) {
            console.log(dataValue.value.value);

        });
    }



]);
