import axios from "axios";
const apiPrefix = "http://localhost:3000"

// Get The Spot Price for both Buyer & Seller
async function getSpotPrice(selectedToken: string) {
  try {
    // Retrieing Orders from Order Book (Database)
    const response = await axios.get(apiPrefix + "/orders");
    const orders = response.data;

    // Spot Price
    let sellerSpotPrice = Number.MIN_SAFE_INTEGER;
    let buyerSpotPrice = Number.MAX_SAFE_INTEGER;

    console.log(selectedToken);
    // Loop through Order Book
    for (let order of orders) {
      if (!order.fulfilled && order.tick === selectedToken) {
        // Spot Price for Buyer is Lowest Price Seller is Willing to Sell
        if (order.side === 0) {
          console.log(order);

          if (order.price < buyerSpotPrice) {
            buyerSpotPrice = order.price;
          }
          console.log("---- Buyer Spot Price in FOr Loop -----");
          console.log(buyerSpotPrice);
        }

        // Spot Price for Seller is Greatest Price Buyer is Willing to Buy
        if (order.side === 1) {
          if (order.price > sellerSpotPrice) {
            sellerSpotPrice = order.price;
          }
        }
      }
    }

    console.log("NUmber MIN: " + Number.MIN_SAFE_INTEGER);

    if (buyerSpotPrice === Number.MAX_SAFE_INTEGER) {
      buyerSpotPrice = 0;
    }

    if (sellerSpotPrice === Number.MIN_SAFE_INTEGER) {
      sellerSpotPrice = 0;
    }

    return [sellerSpotPrice, buyerSpotPrice];
  } catch (error: any) {
    console.error("Error:", error.message);
    return null;
  }
}

export default getSpotPrice;
