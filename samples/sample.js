var radio = require('../.').rf24js;

var pipe1 = new Buffer("1Node\0");
var pipe2 = new Buffer("2Node\0")

console.log(radio)

/********** User Config *********/
// Assign a unique identifier for this node, 0 or 1

var radioNumber = 1;

var role_ping_out = true,
    role_pong_back = false;

var role = role_pong_back;

function main() {
    console.log("RF24/examples/GettingStarted/\n");

    // Setup and configure rf radio
    radio.create(2, 10);
    radio.begin();

    // optionally, increase the delay between retries & # of retries
    radio.setRetries(15, 15);
    // Dump the configuration of the rf unit for debugging
    radio.printDetails();

    /********* Role chooser ***********/

    console.log("\n ************ Role Setup ***********\n");
    console.log("Choose a role: Enter 0 for pong_back, 1 for ping_out (CTRL+C to exit) \n>");

    var myChar = "1"
    if (myChar == "0") {
        console.log("Role: Pong Back, awaiting transmission");
    } else {
        console.log("Role: Ping Out, starting transmission");
        role = role_ping_out;
    }

    if (!radioNumber) {
        radio.openWritingPipe(pipe1);
        radio.openReadingPipe(1, pipe2);
    } else {
        radio.openWritingPipe(pipe2);
        radio.openReadingPipe(1, pipe1);
    }

    radio.startListening();
    loop();
}

function readTimeout() {
    return new Promise(function(resolve, reject) {
        var interval = setInterval(inner, 200);
        var tries = 0;

        function inner() {
            if (tries == 5) {
                clearInterval(interval);
                reject("timeout");
            } else if (radio.available()) {
                clearInterval(interval)
                resolve(radio.read(4));
            } else { tries++; }
        }
    });
}

async function loop() {
    // while (1) {
    if (role == role_ping_out) {
        // First, stop listening so we can talk.
        radio.stopListening();

        // Take the time, and send it.  This will block until complete

        console.log("Now sending...\n");
        var b = new Buffer(4).fill(0);
        b.writeUInt32LE(Math.floor(process.hrtime()[1] / 1000000));
        var ok = radio.write(b, b.length);
        if (!ok) {
            console.log("failed.\n");
        }
        // Now, continue listening
        radio.startListening();

        // Wait here until we get a response, or timeout (250ms)
        try {
            var b = await readTimeout();
            console.log(b.readUInt32LE());
        } catch (e) {
            console.log("Failed, response timed out.\n");
        }

        setTimeout(loop, 1000);
    }

} // forever loop


/*process.on('SIGINT', exitHandler);

function exitHandler() {

}*/

main();