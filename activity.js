var connection = new Postmonger.Session();
var payload = {};

// Startup Sequence 
connection.trigger('ready');

connection.on('initActivity', function(data) { 
    if (data) {
        payload = data;
    }
    // Check if customerKey exists before assigning
    if (payload["arguments"] && payload["arguments"].execute && payload["arguments"].execute.inArguments[0].customerKey) {
        document.getElementById('key').value = payload["arguments"].execute.inArguments[0].customerKey;
    }
});

// Save Sequence
connection.on('clickedNext', function() {
    var key = document.getElementById('key').value.trim();

    // Ensure key is not empty
    if (key) {
        payload["arguments"].execute.inArguments[0].customerKey = key;
        connection.trigger('updateActivity', payload);
    } else {
        alert('Customer Key cannot be empty');
    }
});