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
            verb: "POST",
            "timeout": 1000
        };

        payload["metaData"].isConfigured = true;

        // Registrar los datos enviados en Marketing Cloud
        logDataToMarketingCloud(newInArguments, payload["arguments"].execute.headers, payload["arguments"].execute.body);

        console.log("Payload enviado:", JSON.stringify(payload));

        connection.trigger('updateActivity', payload);
    } else {
        alert('El campo no puede estar vacío');
    }
});

function logDataToMarketingCloud(data, headers, body) {
    var url = 'https://mcv5ds5nvm20y2s8n6j10cpqx3k0.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:34B6EEC8-827F-4A05-8B04-1D58D3EC9A2D/rows';
    var token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjQiLCJ2ZXIiOiIxIiwidHlwIjoiSldUIn0.eyJhY2Nlc3NfdG9rZW4iOiJXOFRmdkxLV3FzQ1RIbHdNdmdCRWg4OVciLCJjbGllbnRfaWQiOiJpbjI4NHM5MTA3dzB2Zm95d2xhNHJjdzMiLCJlaWQiOjUzNjAwNzAyNSwic3RhY2tfa2V5IjoiUzUxIiwicGxhdGZvcm1fdmVyc2lvbiI6MiwiY2xpZW50X3R5cGUiOiJTZXJ2ZXJUb1NlcnZlciIsInBpZCI6NDEwfQ.En5s3AVZp3St71wP7v2ltGy0lPr5rHE-nxa7PzuWSYA.s8BA9HlUt4yA-3kx59TyIqIne3lK0ChmlSRPIGsrJLptgpVOuUSS6oRAUX2mmwPWL79C627kFuKX2l5UBJcgVNe_w2Q_pGhdlJD1CX-rv_kgefCs6TlLiWyytt_lPeXtIP2m59eelotW5Vbd7wxj7BplNIumdGqeczr4j'; // Asegúrate de obtener un token de acceso válido

    var payload = {
        "items": data.map(item => ({
            "keys": {
                "SubscriberKey": item.recipients[0]
            },
            "values": {
                "Message": item.message,
                "Headers": headers,
                "Body": body
            }
        }))
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Datos registrados en la Data Extension:', data);
    })
    .catch(error => {
        console.error('Error al registrar los datos en la Data Extension:', error);
    });
}