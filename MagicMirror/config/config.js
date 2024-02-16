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
	   /* {
	        module: "compliments",
		position: "center",
	        config: {
			updateInterval: 15000,
		compliments: {
			anytime: [
				 "🚨 MogAlert from Prof. J. Barrett of Mogwarts' Magical Guidance 🚨",
	                "🔥 Stay chill, stay sharp! 🔥 Mastery of your arcane prowess isn't just grind and hustle—it's about keeping your cool and commanding your mental game.",
	                "Facing the fire? Inhale the chaos, exhale the power, and mog through the madness.",
	                "Mogging = Magic + Logic. It's our elite strat to crush dilemmas with wit and wizardry.",
	                "Feeling the heat? Hit pause, deep-dive into zen mode, and unleash your inner mogul.",
	                "You're equipped to wreck any roadblocks.",
	                "Lock in, level up"
		],
	 }
}    },
	*/	{
			module: "clock",
			position: "bottom_left"
		},
	/*	{
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
		},*/
			{
			module: "weather",
			position: "right",
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
			    module: "MMM-OnSpotify",
			    position: "bottom_right",
			    config: {
			        // Spotify authentication (Authentication Service)
			        clientID: "0052f3dce2a44b1eb1c07ae3abaa143a",
			        clientSecret: "51a87c1d7a904b33b55ec8f70878d260",
			        accessToken: "BQA0JV6A7ozSg9UCJyjhm2qVu7ijMb6WzXYkl0Y41B3C7zBJsFt83SI9k",
			        refreshToken: "AQARQFoA29-3xe2uHlGJNEKBvrHb-QPqUU92mA7W_9T_gyNWDnuGA9ei4aQVicyLxDrviLXdau1DH-UmN5AnW47VGXKzpVhBK1AjYJnOPqLpjcw0AEzPQNMTbNtR_SrJWUQ",
			        // General module options [SEE BELOW]
			        advertisePlayerTheme: true,
			        displayWhenEmpty: "both",
			        userAffinityUseTracks: false,
			        prefersLargeImageSize: false,
			        hideTrackLenghtAndAnimateProgress: false,
			        showDebugPalette: false,
			        userDataMaxAge: 14400,
			        userAffinityMaxAge: 36000,
			        deviceFilter: [],
			        deviceFilterExclude: false,
			        filterNoticeSubtitle: true,
			       // language: config.language,
			        // Update intervals [SEE BELOW]
			        isPlaying: 1,
			        isEmpty: 2,
			        isPlayingHidden: 2,
			        isEmptyHidden: 4,
			        onReconnecting: 4,
			        onError: 8,
			        // Animations [SEE BELOW]
			        mediaAnimations: false,
			        fadeAnimations: false,
			        textAnimations: true,
			        transitionAnimations: true,
			        // Spotify Code (EXPERMIENTAL)
			        spotifyCodeExperimentalShow: true,
			        spotifyCodeExperimentalUseColor: true,
			        spotifyCodeExperimentalSeparateItem: true,
			        // Theming General
			        roundMediaCorners: true,
			        roundProgressBar: true,
			        showVerticalPipe: true, 
			        useColorInProgressBar: true,
			        useColorInTitle: true,
			        useColorInUserData: true,
			        showBlurBackground: true,
			        blurCorrectionInFrameSide: false,
			        blurCorrectionInAllSides: false,
			        alwaysUseDefaultDeviceIcon: false,
			        experimentalCSSOverridesForMM2: false, // [SEE BELOW]
			    }
	},
		  {
		    module: "MMM-Entur-tavle",
		    position: "bottom_center",
		    config: {
		        stopId: '41620',
		        stopType: 'StopPlace',
		        numResults: 8,
		        showHeader: true,
		        highlightRealtime: true,
		        timeOffset: [5, 'minutes'],
		        exclusions: [ 'a1', 'a2', 'a3' ],
			size: "small",
		    }
		},
			/* {
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
			{
			    module: "MMM-AVStock",
			    position: "bottom_center", //"bottom_bar" is better for `mode:ticker`
			    config: {
				//apiKey: "FFWEPZGY8H44GXUJ"
			        timeFormat: "DD-MM HH:mm",
			        width: null,
			        symbols : ["AAPL", "GOOGL", "TSLA", "NVDA"],
			        alias: ["APPLE", "GOOGLE", "TESLA", "NVIDIA"],
			        purchasePrice: [123.45, 1234.56, 12.34],
			        //locale: config.language,
			        tickerDuration: 20,
			        chartDays: 90,
			        maxTableRows: null,
			        mode: "table",                  // "table" or "ticker/ grid"
			        // direction: "row",
				showChart: true,
			        pureLine: false,
			        chartWidth: 1500,
			        showVolume: true,
			        chartInterval: "daily",          // choose from ["intraday", "daily", "weekly", "monthly"]
			        decimals : 2,
			        chartType: 'line',                // 'line', 'candlestick', or 'ohlc'
			        chartLineColor: '#eee',
			        chartLabelColor: '#eee',
			        coloredCandles: true,
			        showPurchasePrices: true,
			        showPerformance2Purchase: true,
			        debug: false
			    }
			}, */
			  {
			    module: "MMM-Wallpaper",
			    position: "fullscreen_below",
			    config: { // See "Configuration options" for more information.
			      source: "https://cdn.discordapp.com/attachments/1123363475050205264/1142027217673650186/IMG_0005.jpg?ex=65e19fba&is=65cf2aba&hm=1e3cc4faa6248e9a39b790715923983dd486338a432aed054c3f6e2355b2391a&",
			      slideInterval: 20 * 1000 , // Change slides every minute
			      size: "auto" ,
				 }
			  },
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
