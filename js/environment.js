const Host = localStorage.getItem("Host");

const env = {
  ENVIRONMENT: "development",
  API_URL: "http://200.124.12.146:8097/", 
  API_IMAGE: "http://200.124.12.146:8097/" + "image",
};
const myHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
const myInit = {
  method: "GET",
  headers: myHeaders,
  mode: "cors",
  cache: "default",
};
const myInitDEL = {
  method: "DELETE", // *GET, POST, PUT, DELETE, etc.
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "application/json",
  },
};
const currencies = {
  USD: { code: "USD", symbol: "&#36;", name: "US Dollar" },
  BTC: {
    code: "BTC",
    symbol: " BTC",
    name: "Bitcoin",
    accuracy: 4,
    after: true,
  },
};
// default options
const settings = {
  checkout: { type: "PayPal", email: "you@yours.com" },
  currency: "USD",
  language: "spanish-es",
  excludeFromCheckout: ["thumb"],
  data: {},
};
