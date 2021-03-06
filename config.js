// Here you can configure your oauthd instance

var config = {
	base: "/",								// add a base url path. e.g: "/auth"
	base_api: "/api",
	
	debug: true,
	
	host_url: process.env.oauthd_host_url || "http://localhost:6284",						// mounted on this url
	port: process.env.oauthd_port || 6284,					// The port your instance is supposed to run on
	// http_port: 6285,										// HTTP port for redirection if using SSL
	// bind: "127.0.0.1",									// Bind to an ip


	staticsalt: 'i m a random string, change me.',			// used in hash generation, change for more security
	publicsalt: 'i m another random string, change me.',	// used in hash generation, change for more security

	redis: {												// your redis configuration
		port: 6379,
		host: '127.0.0.1',
		// password: 'my redis password',
		// database: 0										// The Redis Database (a number between 0 & 15)
		// options: {...other options...}
	},

	// SSL is disabled by default. You can put your own key and certificate in a 'keys' folder
	//ssl: {
	//	key: __dirname + '/keys/yourkey.key',
	//	certificate: __dirname + '/keys/yourcertificate.crt'
	//},
};

module.exports = config;