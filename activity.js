var connection = new Postmonger.Session();

//Startup Sequence 
connection.trigger('ready');

connection.on('initActivity', function(data) { 
    document.getElementById('message').value = JSON.stringify( data, null, 2);
});

// Save Sequence
connection.on('clickedNext', function() {
    var configuration = JSON.parse(document.getElementById('message').value);
    connection.trigger('updateActivity', configuration);
});

