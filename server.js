var express = require('express');
var bodyParser = require('body-parser');
var data = require('./data.js');
var app = express();
app.use(express.static('views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*
It's landing page for UI.
 */
app.get('/', function (request, response) {
    response.render("index", {services: data.services, catalogServices: data.catalogServices});
});

/*
It's landing page for Create Service.
 */
app.get('/create', function (request, response) {
    data.formsMessage = "";
    response.render("create", {formsMessage: data.formsMessage, catalogServices: data.catalogServices});
});

/*
It's page after Service Creation is Successful.
 */
app.get('/created', function (request, response) {
    data.formsMessage = "Service Creation Started. Please Monitor Dashboard to verify the Status of Service Creation."
    response.render("create", {formsMessage: data.formsMessage, catalogServices: data.catalogServices});
});


/*
It's landing page for Create Service.
 */
app.post('/edit', function (request, response) {
    data.formsMessage = "";
    var serviceName = request.body.selectedService;
    response.render("edit", {serviceName: serviceName, formsMessage: data.formsMessage, catalogServices: data.catalogServices});
});

/*
It's page after Service Creation is Successful.
 */
app.get('/edited', function (request, response) {
    var serviceName = request.query.name;
    data.formsMessage = "Service Edited. Please Monitor Dashboard to verify the Status of Service."
    response.render("edit", {serviceName: serviceName, formsMessage: data.formsMessage, catalogServices: data.catalogServices});
});

/*
It's page for error handling during Service Creation.
 */
app.get('/error', function (request, response) {
    data.formsMessage = "Service with Same name already exists. Please try with different name."
    response.render("create", {formsMessage: data.formsMessage});
});

/*
REST - List Services.
 */
app.get('/api/services', function (request, response) {
    response.send(data.services);
});

/*
REST - Get Service Details.
 */
app.get('/api/services/:name', function (request, response) {
    for (var index = 0; index < data.services.length; index++) {
        if (data.services[index].name === request.params.name) {
            response.send(data.services[index]);
            return;
        }
    }
});

/*
REST - Create Service.
 */
app.post('/api/services', function (request, response) {
    var service = request.body;
    service.status = "In-Progress";
    for (var index = 0; index < data.services.length; index++) {
        if (data.services[index].name === service.name) {
            response.status(409).send({error: "Service already exists"});
            return;
        }
    }
    data.services.push(service);
    response.send(data.services);
});

/*
REST - Update Service. You should allow to change only the Shape for your Service.
 */
app.put('/api/services/:name', function (request, response) {
    var service = request.body;
    for (var index = 0; index < data.services.length; index++) {
        if (data.services[index].name == request.params.name) {
            if(!service.shape) {
                data.services[index].endpoint = service.endpoint;
                data.services[index].status = service.status;
            } else {
                data.services[index].shape = service.shape;
                data.services[index].status = "In-Progress";
                data.services[index].endpoint = "";
            }
            response.send(data.services[index]);
            return;
        }
    }
    response.status(404).send({error: 'Service not found'});
});

/*
REST - Delete Service.
 */
app.delete('/api/services/:name', function (request, response) {
    var service;
    var found = 0;
    for (var index = 0; index < data.services.length; index++) {
        if (data.services[index].name === request.params.name) {
            found = index;
            service = data.services[index];
            break;
        }
    }
    if (!service) {
        response.status(404).send({error: 'Service not found'});
    } else {
        data.services.splice(found,1);
        response.send(data.services);
        return;
    }
});

/*
It's landing page for Submit from UI
 */
app.post('/api/services/ui/create', function (request, response) {
    var service = request.body;
    service.status = "In-Progress";
    for (var index = 0; index < data.services.length; index++) {
        if (data.services[index].name === service.name) {
            response.redirect("/error");
            return;
        }
    }
    data.services.push(service);
    response.redirect("/created");
});

/*
It's landing page for Delete from UI
 */
app.post('/api/services/ui/delete', function (request, response) {
    var serviceName = request.body.selectedService;
    var found = 0
    for (var index = 0; index < data.services.length; index++) {
        if (data.services[index].name === serviceName) {
            found = index;
            break;
        }
    }
    data.services.splice(found,1);
    response.redirect("/");
});

/*
It's landing page for Submit from UI
 */
app.post('/api/services/ui/edit', function (request, response) {
    var found = 0;
    var service = request.body;
    for (var index = 0; index < data.services.length; index++) {
        if (data.services[index].name == service.name) {
            found = index;
            break;
        }
    }
    data.services.splice(found,1);
    service.status = "In-Progress";
    data.services.push(service);
    response.redirect("/edited?name="+service.name);
});



/*
Starting HTTP Server.
 */
app.listen(8090, function () {
    console.log("Listening on port 8090.");
    var catalog = require('./resource/catalog.json');
    data.catalogServices = catalog.services;
});
