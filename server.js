const express = require('express');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const swaggerSpec = require('./swagger');  // Import the swagger definition
const axios = require('axios');  // Axios for making requests to the API
const PriceHistory = require('./models/PriceHistory'); // The model for the coin data
require('dotenv').config();
const app = express();

// Use the port from the environment, or fallback to 5000 for local development
const port = process.env.PORT || 5000;

// MongoDB connection string (replace with your actual connection string)
// const mongoURI = 'mongodb://localhost:27017/coins_db';  // for use locally DB
const mongoURI = "mongodb+srv://marcomaigua1346:"+process.env.MONGO_DB_ATLAS+"@cluster0.a99up.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true";

const fetchHistoricalData = async (coinId, startDate, endDate) => {    
	try {
		let url_body = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${startDate}&to=${endDate}`
		console.log('URL: ', url_body)
		const options = {
			method: 'GET',
			url: url_body,
			headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-AJjQFzrZCQX2muGyMuh1ZjBf'}
		};
		
		const response = await axios.request(options);
		// console.log('Response: ', response.data.prices)
		return response.data.prices;  // Return the price history data
	} catch (error) {
		console.error('Error fetching historical data:', error);
		return [];
	}
};

const populatePriceHistory = async (coinId, startDate, endDate) => {
    const prices = await fetchHistoricalData(coinId, startDate, endDate);
	
	if (prices.length === 0) {
		console.log(`No data available for ${coinId}`);
		return;
	}
	
	// Prepare the data to be inserted
	const formattedPrices = prices.map(priceData => ({
		timestamp: new Date(priceData[0]),
		price_usd: priceData[1],
		market_cap: Math.random() * 1000000000,  // Just an example, real market cap would come from the API
		volume: Math.random() * 1000000,  // Example, replace with real data from CoinGecko
		high_24h: priceData[1] * 1.1,  // Example data
		low_24h: priceData[1] * 0.9,  // Example data
	}));
	
	// Insert data into MongoDB
	const existingCoin = await PriceHistory.findOne({ coin_id: coinId });
	
	if (existingCoin) {
		// If coin already exists, update it
		await PriceHistory.updateOne(
			{ coin_id: coinId },
			{ $push: { prices: { $each: formattedPrices } } }
		);
	} else {
		// If it's a new coin, create a new document
		const newCoinData = new PriceHistory({
			coin_id: coinId,
			symbol: coinId.toUpperCase(),
			name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
			prices: formattedPrices,
		});
		await newCoinData.save();
	}
	
	console.log(`Data for ${coinId} has been added to the database.`);
	
};

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Example API route
app.get('/api/price_history/:coinId', async (req, res) => {
	
	try {		
		const { coinId } = req.params;
    	const { startDate, endDate } = req.query;  // Extract query parameters

		// Default to start of 2024 for startDate and current date for endDate
		const defaultStartDate = Math.floor(new Date('2024-01-01').getTime() / 1000);
		const defaultEndDate = Math.floor(new Date().getTime() / 1000);
		
		const startTimestamp = startDate ? Math.floor(new Date(startDate).getTime() / 1000) : defaultStartDate;
		const endTimestamp = endDate ? Math.floor(new Date(endDate).getTime() / 1000) : defaultEndDate;

        await populatePriceHistory(coinId, startTimestamp, endTimestamp);

		// Fetch the price history data from the database
		const priceHistoryData = await PriceHistory.findOne({ coin_id: coinId });
		
		if (!priceHistoryData || priceHistoryData.length === 0) {
			return res.status(404).json({ message: 'No price history data available' });
		}
		
		// Respond with the fetched data
		res.json(priceHistoryData);
	} catch (error) {
		console.error('Error fetching price history data:', error);
		res.status(500).json({ message: 'Error fetching coins data' });
	}
});

// Start the server
app.listen(port, async () => {
	// Connect to MongoDB
	console.log('Attempting to connect to mongo uri: '+mongoURI)
	await mongoose.connect(mongoURI, 
		{ 
			useNewUrlParser: true, 
			useUnifiedTopology: true,
			ssl: true
		})
		console.log('MongoDB connected')
		console.log(`Server running at http://localhost:${port}`);
		
	});
	