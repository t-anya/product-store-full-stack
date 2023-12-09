import express from "express";
import Transaction from '../db/transactions.js';
import Cart from '../db/cart.js';
import dotenv from "dotenv";
dotenv.config();
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const router = express.Router();

router.post("/", async(req, res) => {
    // console.log(req.body.orderID);
    try{        
        const accessToken = await generateAccessToken();

        const resp = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.body.orderID}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        const order = await handleResponse(resp);
        // console.log(order)
        const transaction = new Transaction({
            userId: req.body.user.user._id,
            orderId: req.body.orderID,
            orderData: order,
        });
        await transaction.save();

        const cart = await Cart.findOne({ userId: req.body.user.user._id })
        .then((cart) => {
            if(cart){
                cart.items = []
                cart.save();
            } 
        });
        return res.status(200).json(cart);
    }catch(error){
        throw error;
    }
});

async function generateAccessToken() {
    const base = "https://api-m.sandbox.paypal.com";
    const auth = Buffer.from(clientId + ":" + clientSecret).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "post",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const jsonData = await handleResponse(response);
    return jsonData.access_token;
  }
  
  
  async function handleResponse(response) {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    }
  
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

export default router;