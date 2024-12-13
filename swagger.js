const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ChainMyne Challenge 4',
    version: '1.0.0',
    description: `
  For this challenge I created a node js server too that calls axios request to the CoinGecko API to fetch the historical price of a coin by its coind id(not its symbol: VERY IMPORTANT)
    
  #### Features:
      
  * it runs with swagger UI so anyone can interact with the api endpoint for the coins
      
  * it runs in a heroku app. 
      
  * it uses mongo db atlas for storing the information and reading from it
      
  * it uses mongo db model for fetching the data of the historical price of the coin, then to do specific market data requests by coin id string (eg. ethereum, bitcoin...)
      
  * it prevents lowercase capital case param entries.
      
  * it cleans up the data obtained from coingeckp price history by coin id and make it readable for the user, the results are nested json of prices by day
      
  ### Algorithm for fetching the price history data:
      
  1. listen to the server
  2. connect to mongo db atlas cluster
  3. do a request through swagger to the endpoint /api/price_history/:coindId
  5. prevent upper case from the entries: coinId, startDate, endDate
  4. fetch data from https://api.coingecko.com/api/v3/coins/{coinID}/market_chart/range?(IMPORTANT: it needs to be coin id) and store it in PriceHistory schema
  6. read coin price_history data from mongo db atlas
  9. filter unnecesary attributes and present to the user`
  }
};

// Options for Swagger JSDoc
const options = {
  swaggerDefinition,
  apis: ['./swagger_routes/*.js'], // Point to where your API routes are
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
