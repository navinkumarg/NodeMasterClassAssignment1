// We are going to create and export configuration variables

//Container for all the environments

var environments = {};


//Staging (default) environment

environments.staging  =
{
	'httpPort' : 3000,
	'httpsPort': 3001,
	'envName' : 'staging'

};


//Production Object

environments.production = 
{
	'httpPort' : 5000,
	'httpsPort': 5001,
	'envName' : 'production'
}


//Decision of which one needs to be exported out from the Command Line Argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check that the current environmnent is one of the above ones, if not, default to staging
var environmentToExport =  typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging ;

//Export the module


module.exports = environmentToExport; 


