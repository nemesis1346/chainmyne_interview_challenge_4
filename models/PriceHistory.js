const mongoose = require('mongoose');

// Create a schema for the historical data of cryptocurrency prices
const priceHistorySchema = new mongoose.Schema({
    coin_id: { 
        type: String, 
        required: true, 
        index: true,  // Index on coin_id to speed up lookups
    },
    symbol: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    prices: [{
        timestamp: { 
            type: Date, 
            required: true,
            index: true,  // Index on timestamp for efficient range queries
        },
        price_usd: { 
            type: Number, 
            required: true,
        },
        market_cap: {
            type: Number,
            required: true,
        },
        volume: {
            type: Number,
            required: true,
        },
        high_24h: {
            type: Number,
            required: true,
        },
        low_24h: {
            type: Number,
            required: true,
        }
    }],
}, { timestamps: true });

// Create an index on coin_id and timestamp for efficient querying by coin_id and time range
priceHistorySchema.index({ coin_id: 1, 'prices.timestamp': 1 });

const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);

module.exports = PriceHistory;
