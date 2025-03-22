const paymentService = require("../services/paymentService");

const createPayment = (req, res) => {
  try {
    let result = paymentService.createPaymentUrl(req);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi tạo thanh toán" });
  }
};

const vnpayReturn = (req, res) => {
  let vnp_ResponseCode = req.query.vnp_ResponseCode;
  let status = vnp_ResponseCode === "00" ? "success" : "failed";
  res.json({ success: true, status });
};

module.exports = { createPayment, vnpayReturn };
