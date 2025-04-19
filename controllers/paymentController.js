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
  try {
    let vnp_ResponseCode = req.query.vnp_ResponseCode;
    const txnRef = req.query.vnp_TxnRef;
    if (vnp_ResponseCode === "00") {
      return res.redirect(
        `http://localhost:3000/order-detail/${txnRef}?status=success`
      );
    } else {
      return res.redirect(
        `http://localhost:3000/order-detail/${txnRef}?status=fail`
      );
    }
  } catch (error) {
    return res.redirect(
      `http://localhost:3000/order-detail/${txnRef}?status=error`
    );
  }
};

module.exports = { createPayment, vnpayReturn };
