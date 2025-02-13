var connection = new Postmonger.Session();

//Startup Sequence 
connection.trigger('ready');

connection.on('initActivity', function(data) { 
    if (data) {
        payload = data;
    }
    document.getElementById('configuration').value = payload["arguments"].execute.inArguments[0].customerKey;
});

// Save Sequence
connection.on('clickedNext', function() {
    var key = document.getElementById('configuration').value.trim();

    payload["arguments"].execute.inArguments[0].customerKey = key;

    connection.trigger('updateActivity', payload);
});

