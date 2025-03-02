var connection = new Postmonger.Session();
var payload = {};

// Startup Sequence 
connection.trigger('ready');

connection.on('initActivity', function(data) { 
    if (data) {
        payload = data;
    }
    connection.trigger('requestSchema');
    connection.on('requestedSchema', function (data) {
        
        // save schema
        console.log('*** Schema ***', JSON.stringify(data['schema']));

        // add entry source attributes as inArgs
        const schema = data['schema'];

        for (var i = 0, l = schema.length; i < l; i++) {
            var inArg = {};
            let attr = schema[i].key;
            let keyIndex = attr.lastIndexOf('.') + 1;
            inArg[attr.substring(keyIndex)] = '{{' + attr + '}}';
            payload['arguments'].execute.inArguments.push(inArg);
        }
    });

    let argArr = payload['arguments'].execute.inArguments;
    
    // Check if message and recipients exist before assigning
    if (payload["arguments"] && payload["arguments"].execute && payload["arguments"].execute.inArguments[0].message) {
        document.getElementById('message').value = payload["arguments"].execute.inArguments[0].message;
    }
    if (payload["arguments"] && payload["arguments"].execute && payload["arguments"].execute.inArguments[0].recipients) {
        document.getElementById('recipients').value = payload["arguments"].execute.inArguments[0].recipients;
    }
});

// Save Sequence
connection.on('clickedNext', function() {
    var message = document.getElementById('message').value.trim();
    var recipients = document.getElementById('recipients').value.trim();

    // Ensure message and recipients are not empty
    if (message && recipients) {
        payload["arguments"].execute.inArguments[0].message = message;
        payload["arguments"].execute.inArguments[0].recipients = recipients;
        connection.trigger('updateActivity', payload);
    } else {
        alert('Los campos no pueden estar vacíos');
    }
});