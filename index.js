const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// POST /send-otp
app.post("/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        to: [{ email }],
        templateId: Number(process.env.BREVO_TEMPLATE_ID),
        params: { otp },
        headers: { "X-Mailin-custom": "otp_email" }, // This is okay to include here
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Brevo Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.get("/", (req, res) => {
  res.send("OTP API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
