var connection = new Postmonger.Session();
var payload = {};

//Startup Sequence 
connection.trigger('ready');

connection.on('initActivity', function(data) { 
    if (data) {
        payload = data;
    }
    document.getElementById('key').value = payload["arguments"].execute.inArguments[0].customerKey;
});

// Save Sequence
connection.on('clickedNext', function() {
    var key = document.getElementById('key').value.trim();

    payload["arguments"].execute.inArguments[0].customerKey = key;

    connection.trigger('updateActivity', payload);
});

