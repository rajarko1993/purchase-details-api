var express = require("express");
const app = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config").get("JwtToken");
const { jsonResponse } = require("../../controller/api/logger");
const apiCtrl = require("../../controller/api/index");
const apiModel = require("../../module/api/index");
const multer = require("../../middleware/multer");

app.use(async (req, res, next) => {
  if (req.originalUrl === "/api/signin" || req.originalUrl === "/api/signup" || req.originalUrl === "/api/checkToken" || req.originalUrl === "/api/uploadProduct") {
      next();
  } else if (req.originalUrl === "/api/listOrderProductCountByDate" || req.originalUrl === "/api/listOrderProductCountByCustomer") {
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["Authorization"] || req.headers["authorization"];
    if (typeof token !== "undefined") {
      try {
        var decoded = await jwt.verify(token, config.get("secret"));
        req.token = token;
        req.user = decoded;
        req.userData = decoded.user_data;
        req.body.user_id = decoded.user_data.id;
        req.body.email = decoded.user_data.email;
        if(typeof req.body.email != "undefined" && req.body.email != "undefined" && req.body.email != "" && req.body.email != null) {
          next();
        } else {
          jsonResponse(res, 401, "Warning", "User Not Found", "");
          return false;
        }
      } catch (err) {
        jsonResponse(res, 401, "Warning", "Invalid Token", "");
        return false;
      }
    } else
      next();
  } else {
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["Authorization"] || req.headers["authorization"];
    if (typeof token !== "undefined") {
      try {
        var decoded = await jwt.verify(token, config.get("secret"));
        req.token = token;
        req.user = decoded;
        req.userData = decoded.user_data;
        req.body.user_id = decoded.user_data.id;
        req.body.email = decoded.user_data.email;
        if(typeof req.body.email != "undefined" && req.body.email != "undefined" && req.body.email != "" && req.body.email != null) {
          next();
        } else {
          jsonResponse(res, 401, "Warning", "User Not Found", "");
          return false;
        }
      } catch (err) {
        jsonResponse(res, 401, "Warning", "Invalid Token", "");
        return false;
      }
    } else {
      jsonResponse(res, 401, "Warning", "Token Missing", "");
      return false;
    }
  }
});

/*1. Create an API to upload the product information into the database. All products should be created via upload only. - Done
2. If product info already exist in the database , should update it else insert the product - Done
3. Api for Basic login and registration setup - Done
4. JWT token should be properly handled for all the API. - Done
5. Create an API to create order, update order, cancel order. - Done
6. Create an api to list ordered products based on the customer. (Should include search and sort functionality) - Done
7. Api to list ordered product count based on date. - Done
8. Api to list customers based on the number of products purchased. - Done*/

/* AUTHENTICATION START */
app.post('/signup', apiCtrl.signup);
app.post('/signin', apiCtrl.signin);
app.post('/checkToken', apiCtrl.checkToken);
/* AUTHENTICATION END */

/* ORDER START */
app.post('/createOrder', apiCtrl.createOrder);
app.post('/updateOrder', apiCtrl.updateOrder);
app.post('/cancelOrder', apiCtrl.cancelOrder);

app.post('/listOrder', apiCtrl.listOrder);
app.post('/listOrderDetails', apiCtrl.listOrderDetails);

app.post('/listOrderProductCountByDate', apiCtrl.listOrderProductCountByDate);
app.post('/listOrderProductCountByCustomer', apiCtrl.listOrderProductCountByCustomer);
/* ORDER START */

/* PRODUCT UPLOAD START */
app.post("/uploadProduct", multer.single("file"), apiCtrl.uploadProduct);
/* PRODUCT UPLOAD END */

module.exports = app;