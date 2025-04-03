const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

app.post("/", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) throw new Error("Invalid amount");

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: "INR",
        payment_capture: 1
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
