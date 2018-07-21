/*
* Primary file for the API
*
*
*/
//Dependencies
var config = require('./config');
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');

//Instantiating the http server
var httpServer = http.createServer(function(req,res)
	{
		unifiedServer(req,res);
	});

	//Start the HTTP server
	httpServer.listen(config.httpPort,function(){
		console.log("This server is listening on "+config.httpPort + " in "+ config.envName+ " mode now. ");
	});

//Instantiating the https server
	var httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert' : fs.readFileSync('./https/cert.pem')
	};
	var httpsServer = https.createServer(httpsServerOptions,function(req,res)
	{
		unifiedServer(req,res);
	});

	//Start the HTTPS server
	httpsServer.listen(config.httpsPort,function(){
		console.log("This server is listening on "+config.httpsPort + " in "+ config.envName+ " mode now. ");
	});





	//Unified Server : All the server logic for http and https

	var unifiedServer = function(req,res)
	{

		// Get the URL and parse it
		var parsedUrl = url.parse(req.url,true);


		//Get the path from the URL
		var path = parsedUrl.pathname;
		var trimmedPath = path.replace(/^\/+|\/+$/g,'');

		//Get the query string as an object
		var queryStringObject = parsedUrl.query; 


		//Get the http method
		var method = req.method.toLowerCase();


		//Get the headers as an object  
		var headers = req.headers;

		//Get the payload, if any
		var decoder = new StringDecoder('utf-8');

		var buffer = '';

		req.on('data',function(data){
			buffer += decoder.write(data);
		});

		req.on('end',function(){
			buffer+= decoder.end();

		//Choose the handler this request should go to. If not found send to not found handler.

		var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound ;

		//Construct the data handler to send to the object
		
	/*	var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method':method,
			'headers' : headers,
			'payload' : buffer
		}*/

		var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };

		//Route the request to the specified handler in the router
		choosenHandler(data,function(statusCode,payload){
			//Use the status code calledback by the handler or default 200
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			
			//Use the payload called by the hanlder or return an emply object
			payload = typeof(payload) == 'object' ? payload : {}; 

			//Covert the payload to a string
			var payloadString = JSON.stringify(payload);

			//Return the response
			res.setHeader('Content-Type','Application/JSON');
			res.writeHead(statusCode);
			res.end(payloadString);


			//Log the path user has asked for
		//console.log("Request received on path: "+trimmedPath+" with method "+method+' with these query string parameters',queryStringObject);
		//console.log("Request receive d with these headers",headers);
		console.log('Returning the response',statusCode,payloadString);
	});
	});



	};





	//Define the handlers
	var handlers = {};

	//Ping Handler
	handlers.ping = function(data,callback){
	// Callback a HTTP status code and a payload object
	callback(200,{"Status":"Alive"});
	};

	//Hello Handler
	handlers.hello = function(data,callback){
	// Callback a HTTP status code and a payload object
	callback(200,{"Status":"Hello World"});
	};


	//Not found hanlder

	handlers.notFound = function(data,callback ){
	callback(404);
	};

	//Define a request router

	var router = {
	 'sample' : handlers.sample,
	 'ping' : handlers.ping,
	 'hello' : handlers.hello,
	};









