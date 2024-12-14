# ChainMyne Challenge 4

For this challenge I created a node js server too that calls axios request to the CoinGecko API to fetch the historical price of a coin by its coind id(not its symbol: VERY IMPORTANT)

The server app is running in the following url:

https://chainmyne-challenge4-8f41f237d962.herokuapp.com/api-docs/#/default/get_api_price_history__coinId_


#### Features:

* It runs with swagger UI so anyone can interact with the api endpoint for the coins

* It runs in a heroku app. 

* It uses mongo db atlas for storing the information and reading from it

* It uses mongo db model for fetching the data of the historical price of the coin, then to do specific market data requests by coin id string (eg. ethereum, bitcoin...)

* It prevents lowercase capital case param entries.

* It cleans up the data obtained from coingeckp price history by coin id and make it readable for the user, the results are nested json of prices by day

### Algorithm for fetching the price history data:

1. Listen to the server
2. Connect to mongo db atlas cluster
3. Do a request through swagger to the endpoint /api/price_history/:coindId
5. Prevent upper case from the entries: coinId, startDate, endDate
4. Fetch data from https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?  and store it in PriceHistory schema
(IMPORTANT: it needs to be coin id) 
6. Read coin price_history data from mongo db atlas
9. Filter unnecesary attributes and present to the user

### Assumptions:

Since the coingecko endpoint https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range? gives a subjson of items that have only the price and the timestamp, our current schema simulates the fetching of additional data attributes like this:

```
const formattedPrices = prices.map(priceData => ({
		timestamp: new Date(priceData[0]),
		price_usd: priceData[1],
		market_cap: Math.random() * 1000000000,  // Just an example, real market cap would come from the API
		volume: Math.random() * 1000000,  // Example, replace with real data from CoinGecko
		high_24h: priceData[1] * 1.1,  // Example data
		low_24h: priceData[1] * 0.9,  // Example data
	}));

    // Important: just priceData[1] (price) and priceData[0] (timestamp) are given in this endpoint	
```

### If you want to run the project locally:

nvm use 18.20.0
npm install
node server.js

check the browse locaohost:5000