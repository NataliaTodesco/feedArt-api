import { config } from "dotenv";
config();

// Paypal
export const PAYPAL_API_CLIENT = 'AS3T_m64SF8mvaVEGqam0_SQsfpO7c_SpAa6NufjUcVr05Nyb3G9SpVTY6DePN8JUGrNIBqG0laFOJ8Q' //process.env.PAYPAL_API_CLIENT;
export const PAYPAL_API_SECRET = 'EEgkaYBGoyzs6Hm-Jo0kviOel9cKAfgGc-CVtKit1JrQl-JO44r4TW2e4yE222oWBxmK6A17GpVOECtG' //process.env.PAYPAL_API_SECRET;
export const PAYPAL_API = 'https://api-m.sandbox.paypal.com' //process.env.PAYPAL_API;

// Server
export const PORT = process.env.PORT || 3000;
export const HOST = 'https://feedart-api.herokuapp.com'
// 'https://feedart-api.herokuapp.com' 
  // process.env.NODE_ENV === "production"
  //   ? process.env.HOST
  //   : "http://localhost:" + PORT;
