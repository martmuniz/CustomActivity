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
/*
    for (var i = 0, l = schema.length; i < l; i++) {
        var inArg = {};
        let attr = schema[i].key;
        let keyIndex = attr.lastIndexOf('.') + 1;
        inArg[attr.substring(keyIndex)] = '{{' + attr + '}}';
        payload['arguments'].execute.inArguments.push(inArg);
    }
*/


    });

    let argArr = payload['arguments'].execute.inArguments;
  
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
        payload["arguments"].execute.inArguments = [{
            message: key,
            recipients: ["{{Contact.Attribute.SMS_Subscribers.MobileNumber}}"]
        }];
        payload["metaData"].isConfigured = true;

        connection.trigger('updateActivity', payload);
    } else {
        alert('el campo no puede estar vacío');
    }
});