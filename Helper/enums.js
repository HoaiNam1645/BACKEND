const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
};

const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELED: "canceled",
};

const PAYMENT_METHOD = {
  COD: "cod",
  CREDIT_CARD: "credit_card",
  PAYPAL: "paypal",
};

const TRANSACTION_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
};

const STATUS_CODE = {
  SUCCESS: 201,
  BAD_REQUEST: 401,
  ERROR: 501,
};

module.exports = {
  USER_ROLE,
  ORDER_STATUS,
  PAYMENT_METHOD,
  TRANSACTION_STATUS,
  STATUS_CODE,
};
