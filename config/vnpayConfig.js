require("dotenv").config();

const vnpayConfig = {
  tmnCode: process.env.VNP_TMN_CODE || "YOUR_TMN_CODE",
  hashSecret: process.env.VNP_HASH_SECRET || "YOUR_HASH_SECRET",
  returnUrl:
    process.env.VNP_RETURN_URL ||
    "http://localhost:5000/api/payment/vnpay-return",
  vnpUrl:
    process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  apiUrl:
    process.env.VNP_API ||
    "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
};

module.exports = vnpayConfig;
