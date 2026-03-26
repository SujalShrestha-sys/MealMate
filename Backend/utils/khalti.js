import axios from "axios";

// Khalti API URLs for Web Checkout (KPG-2)
const KHALTI_SANDBOX_URL = "https://dev.khalti.com/api/v2";
const KHALTI_LIVE_URL = "https://khalti.com/api/v2";

// Use sandbox for development, live for production
const KHALTI_API_URL =
  process.env.NODE_ENV === "production"
    ? KHALTI_SANDBOX_URL
    : KHALTI_SANDBOX_URL;
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

// Initiate Khalti Payment (Step 1)
// Creates payment request and returns payment_url to redirect user to
// orderData should have: orderId, amountInPaisa, customerName, customerEmail, customerPhone
export const initiateKhaltiPayment = async (orderData) => {
  try {
    // Get the first origin from the list as the primary frontend URL
    const origins = (process.env.FRONTEND_URL || "http://localhost:5173")
      .split(",")
      .map((u) => u.trim().replace(/\/$/, ""));
    const primaryOrigin = origins[0];

    const payload = {
      return_url: orderData.returnUrl || `${primaryOrigin}/payment/verify`, // Frontend should handle this route
      website_url: primaryOrigin,
      amount: orderData.amountInPaisa, // Must be in paisa (rupees * 100)
      purchase_order_id: orderData.orderId,
      purchase_order_name: `MealMate Order ${orderData.orderId}`,
      customer_info: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
      },
    };

    const response = await axios.post(
      `${KHALTI_API_URL}/epayment/initiate/`,
      payload,
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Returns: { pidx, payment_url, expires_at, expires_in }
    return response.data;
  } catch (error) {
    throw new Error(
      `Khalti initiate failed: ${error.response?.data?.detail || error.message}`,
    );
  }
};

// Verify Payment Status (Step 2)
// Call this after user returns from payment
// Use pidx from initial response to check payment status
export const lookupKhaltiPayment = async (pidx) => {
  try {
    const response = await axios.post(
      `${KHALTI_API_URL}/epayment/lookup/`,
      { pidx },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Returns: { pidx, total_amount, status, transaction_id, fee, refunded }
    // status can be: Completed, Pending, Expired, Initiated, User canceled, Refunded
    return response.data;
  } catch (error) {
    throw new Error(
      `Khalti lookup failed: ${error.response?.data?.detail || error.message}`,
    );
  }
};

// Convert rupees to paisa
// 1 rupee = 100 paisa
// Example: 500 rupees = 50000 paisa
export const rupeesToPaisa = (rupees) => rupees * 100;

// Check if payment is successful
// Only "Completed" status means payment was successful
export const isPaymentSuccessful = (status) => {
  return status === "Completed";
};
