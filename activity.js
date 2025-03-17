var connection = new Postmonger.Session();
var payload = {};

// Startup Sequence 
connection.trigger('ready');

connection.on('initActivity', function (data) {
    if (data) {
        payload = data;
    }
    connection.trigger('requestSchema');

    connection.on('requestedSchema', function (schemaData) {
        console.log('*** Schema ***', JSON.stringify(schemaData['schema']));
    });

    if (payload["arguments"] && payload["arguments"].execute && payload["arguments"].execute.inArguments) {
        let messageValue = payload["arguments"].execute.inArguments[0].message;
        if (messageValue) {
            document.getElementById('key').value = messageValue;
        }
    }
});

// Save Sequence
connection.on('clickedNext', function () {
    var key = document.getElementById('key').value.trim();

    if (key) {
        let newInArguments = [{
            message: key,
            recipients: ["{{Contact.Attribute.SMS_Subscribers.MobileNumber}}"]
        }];

        // Mantener la estructura de "execute" pero filtrando solo "inArguments"
        payload["arguments"].execute = {
            inArguments: newInArguments,
            url: payload["arguments"].execute.url, // Mantiene la URL de ejecución
            verb: "POST" ,
            "timeout": 1000
        };

        payload["metaData"].isConfigured = true;

        console.log("Payload enviado:", JSON.stringify(payload));

        connection.trigger('updateActivity', payload);
    } else {
        alert('El campo no puede estar vacío');
    }
});
