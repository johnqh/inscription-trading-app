
## Inscription Trading App Frontend
This frontend application is part of the Inscription Trading system, designed to interact with the Inscription Trading API. It provides a interface for trading inscriptions defined by the BRC-20 standard on a blockchain system. The application allows users to have a platform for trading inscriptions—assets encoded directly within the memos field of Bitcoin transactions, adhering to the BRC-20 standard. The application allows users to view, create, and manage orders and transactions efficiently.

## Installation and Running

NodeJS is required to install and run the API and order matching.

From a clone or archive of the repository, run `npm install` to install the dependencies.

A `.env` file will need to be made in order to store secrets, or else the API cannot communicate to the database or UniSat. The following variables are required:

```
DATABASE_URL=<url to mysql database>
API_KEY=<unisat api key>
EXCHANGE_WALLET=<exchange wallet for holding assets before order fulfillment>
```

1. Start the API: Before starting the frontend, ensure that the [API](https://github.com/johnqh/inscription-trading-api) is running:
   ```bash
   npm start
   ```
   This will start the API on port 3000 by default.
2. Start the Frontend Application: Once the API is up and running, you can start the frontend application:
   ```bash
   npm start
   ```
   Visit http://localhost:3001 in your browser to view the application.

## Components and Features
* Dashboard (Home.tsx): Provides a snapshot of the market and active orders.
* Market Analysis (Market.tsx and MarketIcon.tsx): Displays real-time market trends and icons representing different market states.
* Order Management (Orders.tsx): Enables users to create, view, and manage their orders.
* Transaction Records (Records.tsx): Allows users to view detailed transaction history.
* User Management (User.tsx): Handles user account settings and preferences.
* Wallet Integration (Wallet.tsx): Connects users' blockchain wallets for transaction execution.
* Asset Holdings (Holdings.tsx): Displays users' current asset holdings.
