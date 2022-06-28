"use strict";

//var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start();
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

async function close() {
    try {
        await connection.stop();
        console.log("SignalR Disconnected.");
        //Disable the send button until connection is established.
        document.getElementById("sendButton").disabled = true;
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
}

connection.onclose(async () => {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = "Disconnected!"
    await start(); // keep the user always connected
});


//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

var li = document.createElement("li");
document.getElementById("messagesList").appendChild(li);
li.textContent = "Connected!"

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;

    // Testing purposes
    // close(); //Uncomment for test purposes to see the disconnect message
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
