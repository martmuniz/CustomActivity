var connection = new Postmonger.Session();
var payload = {};

// Startup Sequence 
connection.trigger('ready');
connection.trigger('requestSchema');
connection.on('requestedSchema', function (data) {
    // save schema
    console.log('*** Schema ***', JSON.stringify(data['schema']));
 });

connection.on('initActivity', function(data) { 
    if (data) {
        payload = data;
    }
    // Check if customerKey exists before assigning
    if (payload["arguments"] && payload["arguments"].execute && payload["arguments"].execute.inArguments[0].message) {
        document.getElementById('key').value = payload["arguments"].execute.inArguments[0].message;
    }
});

// Save Sequence
connection.on('clickedNext', function() {
    var key = document.getElementById('key').value.trim();

    // Ensure key is not empty
    if (key) {
        payload["arguments"].execute.inArguments[0].message = key;
        payload["arguments"].execute.inArguments[
            {
                "mobilePhone" : "{{Contact.Attribute.SMSCustomActivity.MobileNumber}}"
            }
        ]
        connection.trigger('updateActivity', payload);
    } else {
        alert('el campo no puede estar vacío');
    }
});