/* MagicMirror² Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "localhost",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
									// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],	// Set [] to allow all IP addresses
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",

	modules: [
	/*	{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},*/
		{
			module: "clock",
			position: "bottom_left"
		},
		{
			module: "calendar",
			header: "kalender",
			position: "top_right",
			config: {
				calendars: [
					{
						fetchInterval: 7 * 24 * 60 * 60 * 1000,
						symbol: "calendar-check",
						url: "https://outlook.office365.com/owa/calendar/e1b52cee1eef4e128ff296b747048a6c@nhn.no/18915dbc70f8400ba306ab6a01315be2553357828016458506/calendar.ics"
					}
				]
			}
		},
	
		/*{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openweathermap",
				type: "current",
				location: "New York",
				locationID: "5128581", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				apiKey: "YOUR_OPENWEATHER_API_KEY"
			}
		},*/
		{
			module: "weather",
			position: "bottom_center",
			header: "Weather Forecast",
			config: {
				weatherProvider: "openweathermap",
				type: "forecast",
				location: "Trondheim",
				locationID: "3133880", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				apiKey: "89c47de4c4b27cda9ef145cfd39c968a"
			}
		},
		  {
		    module: "MMM-Entur-tavle",
		    position: "top_left",
		    config: {
		        stopId: '41620',
		        stopType: 'StopPlace',
		        numResults: 8,
		        showHeader: true,
		        highlightRealtime: true,
		        timeOffset: [5, 'minutes'],
		        exclusions: [ 'a1', 'a2', 'a3' ],
		    }
		},
			 {
		    module: 'MMM-bitcoin',
		    position: 'top_center',
		    config: {
		      fiat: 'usd',          // 'usd' and 'eur' available, defaults to 'usd'
		      showBefore: 'Bitcoin',    // will display before the bitcoin price, default 'Bitstamp'
		      updateInterval: 30000 // update interval in milliseconds
		    }
		  }, 
		      {
		       module: "MMM-network-signal",
		       position: "bottom_right",
		       config: {
		           // Configuration of the module goes here
		       }
		   }, 
			{
			module: "MMM-cryptocurrency",
			position: "center",
			config: {
				apikey: '4dbf7d77-40bd-48a9-816b-160aa661bae7',
				apiDelay: 1 ,
				currency: ['ethereum','bitcoin','cardano','chainlink'],
				conversion: 'USD',
				headers: ['change24h', 'change1h', 'change7d'],
				displayType: 'logoWithChanges + showGraphs',
				showGraphs: true
			}
		},

	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
