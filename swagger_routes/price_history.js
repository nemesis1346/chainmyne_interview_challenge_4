/**
 * @swagger
 * /api/price_history/{coinId}:
 *   get:
 *     summary: Fetch cryptocurrency price history for a specific coin
 *     description: Fetches historical price data for the specified cryptocurrency by its coin ID.
 *     parameters:
 *       - name: coinId
 *         in: path
 *         required: true
 *         description: |
 *           The ID of the cryptocurrency (e.g., 'bitcoin', 'ethereum'). 
 *           **Note:** This is the full CoinGecko ID, not the symbol. 
 *           For example, use 'bitcoin' instead of 'BTC', and 'ethereum' instead of 'ETH'.
 *           You can find the full CoinGecko IDs for all supported cryptocurrencies on the [CoinGecko API documentation](https://www.coingecko.com/en/api/documentation).
 *         schema:
 *           type: string
 *           example: "bitcoin"
 *       - name: startDate
 *         in: query
 *         required: false
 *         description: |
 *           The start date in the format YYYY-MM-DD (e.g., 2024-01-01). 
 *           Note: The start date can only be up to 1 year in the past, due to CoinGecko API constraints.
 *         schema:
 *           type: string
 *           example: "2024-01-01"
 *       - name: endDate
 *         in: query
 *         required: false
 *         description: The end date in the format YYYY-MM-DD (e.g., 2024-12-31)
 *         schema:
 *           type: string
 *           example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Successfully fetched cryptocurrency price history for the coin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coin_id:
 *                   type: string
 *                 symbol:
 *                   type: string
 *                 name:
 *                   type: string
 *                 prices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       price_usd:
 *                         type: number
 *                       market_cap:
 *                         type: number
 *                       volume:
 *                         type: number
 *                       high_24h:
 *                         type: number
 *                       low_24h:
 *                         type: number
 *       404:
 *         description: No data available for the specified coin
 *       500:
 *         description: Server error
 */
