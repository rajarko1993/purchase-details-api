const jwt = require("jsonwebtoken");
const Joi = require("joi");
const fs = require("fs");
const md5 = require("md5");
const _ = require("underscore");
const config = require("config").get("JwtToken");
const salt = require("config").get("Common");
const { jsonResponse } = require("../../controller/api/logger");
const apiModule = require("../../module/api/index");
const apiModel = new apiModule();
const {
    signup,
    signin,
    createOrder,
    updateOrder,
    cancelOrder,
    listOrder,
    listOrderDetails,
    listOrderProductCountByDate,
    listOrderProductCountByCustomer,
    validateProduct
} = require("./schema");

const moment = require("moment");
const dateFormat = require("dateformat");
const path = require('path');
const { functions } = require("underscore");

module.exports = {
    signup: async(req, res) => {
        Joi.validate(req.body, signup, async(error, value) => {
            if (error !== null) {
                jsonResponse(res, 406, "Warning", error.details[0].message, "");
                return false;
            }

            let checkEmail = await Promise.all([apiModel.checkEmail(req)]);
            if(checkEmail[0].length > 0) {
                jsonResponse(res, 401, "Warning", "Email Already Exists", "");
                return false;
            } else {
                let userInsert = await Promise.all([apiModel.saveUser(req)]);
                let data = {
                    user_id: userInsert[0].insertId
                };
                jsonResponse(res, 201, "Created", "Registered Successfully", data);
                return false;
            }
        });
    },

    signin: async(req, res) => {
        Joi.validate(req.body, signin, async(error, value) => {
            if (error !== null) {
                jsonResponse(res, 406, "Warning", error.details[0].message, "");
                return false;
            }

            let checkEmail = await Promise.all([apiModel.checkEmail(req)]);
            if(checkEmail[0].length > 0) {
                let passwordSalt = salt.get("salt") ? salt.get("salt") : "!@#$%^&*";
                let passwordHash = await md5(md5(req.body.password) + passwordSalt);
                if(checkEmail[0][0].password == passwordHash) {
                    let user_data = checkEmail[0][0]
                    let jwt_token = await jwt.sign({ user_data }, config.get("secret"), {
                        expiresIn: "1d",
                    });
                    let data = {
                        user_id: checkEmail[0].id,
                        access_token: jwt_token
                    };
                    jsonResponse(res, 200, "Success", "Login Successfully", data);
                    return false;
                } else {
                    jsonResponse(res, 401, "Warning", "Incorrect Password", "");
                    return false;
                }
            } else {
                jsonResponse(res, 401, "Warning", "Incorrect Email", "");
                return false;
            }
        });
    },

    checkToken: async(req, res) => {
        const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["Authorization"] || req.headers["authorization"];
        if (typeof token !== "undefined" && token != "undefined" && token != "" && token != null) {
            try {
                var decoded = await jwt.verify(token, config.get("secret"));
                decoded.token = token;
                req.token = token;
                req.user = decoded;
                req.userData = decoded.user_data;
                req.body.user_id = decoded.user_data.id;
                req.body.email = decoded.user_data.email;
                console.log(req.body.email);
                if(typeof req.body.email != "undefined" && req.body.email != "undefined" && req.body.email != "" && req.body.email != null) {
                  let checkEmail = await Promise.all([apiModel.checkEmail(req)]);
                  console.log(checkEmail[0]);
                  if(checkEmail[0].length > 0) {
                    // next();
                    jsonResponse(res, 200, "Success", "Token Verified Successfully", decoded);
                    return false;
                  } else {
                    jsonResponse(res, 401, "Warning", "User Not Found", "");
                    return false;
                  }
                } else {
                  jsonResponse(res, 401, "Warning", "User Not Found", "");
                  return false;
                }

                // jsonResponse(res, 200, "Success", "Token Verified Successfully", decoded);
                // return false;
            } catch (err) {
                jsonResponse(res, 401, "Warning", "Invalid Token", "");
                return false;
            }
        } else {
            jsonResponse(res, 401, "Warning", "Token Missing", "");
            return false;
        }
    },

    createOrder: async(req, res) => {
        Joi.validate(req.body, createOrder, async(error, value) => {
            if (error !== null) {
                jsonResponse(res, 406, "Warning", error.details[0].message, "");
                return false;
            }

            let checkEmail = await Promise.all([apiModel.checkEmail(req)]);
            if(checkEmail[0].length > 0) {
                req.body.product_id = _.uniq(req.body.product_id);
                if(req.body.product_id.length > 0) {
                    let getProducts = await Promise.all([apiModel.getProducts(req)]);
                    if(getProducts[0].length > 0) {
                        if(getProducts[0].length == req.body.product_id.length) {
                            req.body.status = 1;
                            let createOrder = await Promise.all([apiModel.createOrder(req)]);
                            let order_id = createOrder[0].insertId;
                            if(order_id > 0) {
                                let current_date = moment().format("YYYY-MM-DD HH:mm:ss");
                                req.body.product_id_arr = _.map(getProducts[0], function(item, id) { return [item.id, item.price, order_id, req.body.user_id, req.body.status, current_date] });

                                let createOrderDetails = await Promise.all([apiModel.createOrderDetails(req)]);

                                jsonResponse(res, 200, "Success", "Order Created Successfully", "");
                                return false;
                            } else {
                                jsonResponse(res, 401, "Warning", "Failed to Create Order", "");
                                return false;
                            }
                        } else {
                            let product_id_arr = _.map(getProducts[0], function(item, id) { return item.id });
                            let invalid_product_id = _.difference(req.body.product_id, product_id_arr);
                            jsonResponse(res, 401, "Warning", invalid_product_id.join(",") + " Product Id Not Present. Please Proceed with Valid Product Id", "");
                            return false;
                        }
                    } else {
                        jsonResponse(res, 401, "Warning", "Products Not Found", "");
                        return false;    
                    }
                } else {
                    jsonResponse(res, 401, "Warning", "Product Id Not Found", "");
                    return false;
                }
            } else {
                jsonResponse(res, 401, "Warning", "User Not Found", "");
                return false;
            }
        });
    },

    updateOrder: async(req, res) => {
        Joi.validate(req.body, updateOrder, async(error, value) => {
            if (error !== null) {
                jsonResponse(res, 406, "Warning", error.details[0].message, "");
                return false;
            }

            let checkEmail = await Promise.all([apiModel.checkEmail(req)]);
            if(checkEmail[0].length > 0) {
                req.body.product_id = _.uniq(req.body.product_id);
                if(req.body.product_id.length > 0) {
                    let getProducts = await Promise.all([apiModel.getProducts(req)]);
                    if(getProducts[0].length > 0) {
                        if(getProducts[0].length == req.body.product_id.length) {
                            req.body.status = 1;
                            let checkOrder = await Promise.all([apiModel.checkOrder(req)]);
                            let order_id = req.body.order_id;
                            if(checkOrder[0].length > 0) {
                                let updateOrder = await Promise.all([apiModel.updateOrder(req), apiModel.removeOrderDetails(req)]);
                                let current_date = moment().format("YYYY-MM-DD HH:mm:ss");
                                req.body.product_id_arr = _.map(getProducts[0], function(item, id) { return [item.id, item.price, order_id, req.body.user_id, req.body.status, current_date] });

                                let createOrderDetails = await Promise.all([apiModel.createOrderDetails(req)]);

                                jsonResponse(res, 200, "Success", "Order Updated Successfully", "");
                                return false;
                            } else {
                                jsonResponse(res, 401, "Warning", "Failed to get Order", "");
                                return false;
                            }
                        } else {
                            let product_id_arr = _.map(getProducts[0], function(item, id) { return item.id });
                            let invalid_product_id = _.difference(req.body.product_id, product_id_arr);
                            jsonResponse(res, 401, "Warning", invalid_product_id.join(",") + " Product Id Not Present. Please Proceed with Valid Product Id", "");
                            return false;
                        }
                    } else {
                        jsonResponse(res, 401, "Warning", "Products Not Found", "");
                        return false;    
                    }
                } else {
                    jsonResponse(res, 401, "Warning", "Product Id Not Found", "");
                    return false;
                }
            } else {
                jsonResponse(res, 401, "Warning", "User Not Found", "");
                return false;
            }
        });
    },

    cancelOrder: async(req, res) => {
        Joi.validate(req.body, cancelOrder, async(error, value) => {
            if (error !== null) {
                jsonResponse(res, 406, "Warning", error.details[0].message, "");
                return false;
            }

            let checkEmail = await Promise.all([apiModel.checkEmail(req)]);
            if(checkEmail[0].length > 0) {
                req.body.status = 1;
                let checkOrder = await Promise.all([apiModel.checkOrder(req)]);
                if(checkOrder[0].length > 0) {
                    req.body.status = 0;
                    await Promise.all([apiModel.updateOrder(req), apiModel.updateOrderDetails(req)]);

                    jsonResponse(res, 200, "Success", "Order Updated Successfully", "");
                    return false;
                } else {
                    jsonResponse(res, 401, "Warning", "Failed to get Order", "");
                    return false;
                }
            } else {
                jsonResponse(res, 401, "Warning", "User Not Found", "");
                return false;
            }
        });
    },

    listOrder: async(req, res) => {
        /*req.body.status = 'active'; // status = active, cancelled
        req.body.sort_by = 'desc'; // sort_by = asc, desc
        req.body.order_by = 'order_date'; // order_by = order_id, order_date, order_status
        req.body.page = 1; // page = 1
        req.body.limit = 10; // limit = 10
        req.body.search = 'pd001'; // search = product_id / product_sku / order_id / price*/

        /*"status": "cancelled",
        "sort_by": "desc",
        "order_by": "order_date",
        "page": 1,
        "limit": 10,
        "search": "pd002"*/
        Joi.validate(req.body, listOrder, async(error, value) => {
            if (error !== null) {
                jsonResponse(res, 406, "Warning", error.details[0].message, "");
                return false;
            }
            let checkEmail = await Promise.all([apiModel.checkEmail(req)]);
            if(checkEmail[0].length > 0) {
                let getOrder = await Promise.all([apiModel.getOrder(req, 1), apiModel.getOrder(req, 0)]);
                if(getOrder[0].length > 0) {
                    for(let i = 0; i < getOrder[0].length; i++) {
                        let v = getOrder[0][i];
                        req.body.order_id = v.order_id;
                        let getOrderDetails = await Promise.all([apiModel.getOrderDetails(req, '')]);
                        getOrder[0][i].order_details_count = getOrderDetails[0].length;
                        getOrder[0][i].order_details = getOrderDetails[0];
                    }
                    let data = {
                        orders: getOrder[0],
                        current_page: req.body.page,
                        page_limit: req.body.limit,
                        overall_orders_count: getOrder[1][0].totalCount
                    };
                    // jsonResponse(res, 200, "Success", "Order Details", getOrder[0]);
                    jsonResponse(res, 200, "Success", "Order List", data);
                    return false;
                } else {
                    jsonResponse(res, 401, "Warning", "Failed to get Order", "");
                    return false;
                }
            } else {
                jsonResponse(res, 401, "Warning", "User Not Found", "");
                return false;
            }
        });
    },

    listOrderDetails: async(req, res) => {
        /*req.body.status = 'active'; // status = active, cancelled
        req.body.sort_by = 'desc'; // sort_by = asc, desc
        req.body.order_by = 'order_details_date'; // order_by = order_details_id, order_id, product_id, product_sku, order_details_date, order_details_status
        req.body.page = 1; // page = 1
        req.body.limit = 10; // limit = 10
        req.body.search = 'pd001'; // search = product_id / product_sku / order_id / price*/

        /*"status": "cancelled",
        "sort_by": "desc",
        "order_by": "order_details_date",
        "page": 1,
        "limit": 10,
        "search": "pd002"*/
        Joi.validate(req.body, listOrderDetails, async(error, value) => {
            if (error !== null) {
                jsonResponse(res, 406, "Warning", error.details[0].message, "");
                return false;
            }
            let checkEmail = await Promise.all([apiModel.checkEmail(req)]);
            if(checkEmail[0].length > 0) {
                let getOrderDetails = await Promise.all([apiModel.getOrderDetails(req, 1), apiModel.getOrderDetails(req, 0)]);
                if(getOrderDetails[0].length > 0) {
                    let data = {
                        orders_details: getOrderDetails[0],
                        current_page: req.body.page,
                        page_limit: req.body.limit,
                        overall_orders_details_count: getOrderDetails[1][0].totalCount
                    };
                    // jsonResponse(res, 200, "Success", "Order Details", getOrder[0]);
                    jsonResponse(res, 200, "Success", "Order Details List", data);
                    return false;
                } else {
                    jsonResponse(res, 401, "Warning", "Failed to get Order Details", "");
                    return false;
                }
            } else {
                jsonResponse(res, 401, "Warning", "User Not Found", "");
                return false;
            }
        }); 
    },

    listOrderProductCountByDate: async(req, res) => {
        /*req.body.status = 'active'; // status = active, cancelled
        req.body.sort_by = 'desc'; // sort_by = asc, desc
        req.body.order_by = 'product_id'; // order_by = filter_date, product_id, product_sku
        req.body.group_by = 'product_id'; // group_by = filter_date, product_id, both
        req.body.page = 1; // page = 1
        req.body.limit = 10; // limit = 10
        req.body.start_date = '2022-06-09'; // start_date = 2022-06-09
        req.body.end_date = '2022-06-12'; // end_date = 2022-06-12*/

        /*"status": "cancelled",
        "sort_by": "desc",
        "order_by": "product_sku",
        "group_by": "product_id",
        "page": 1,
        "limit": 10,
        "start_date": "2022-06-09",
        "end_date": "2022-06-12"*/

        Joi.validate(req.body, listOrderProductCountByDate, async(error, value) => {
            if (error !== null) {
                jsonResponse(res, 406, "Warning", error.details[0].message, "");
                return false;
            }

            let checkEmail = await Promise.all([apiModel.checkEmail(req)]);
            if(checkEmail[0].length > 0 || typeof req.body.email == "undefined" || req.body.email == "undefined" || req.body.email == "" || req.body.email == null) {
                req.body.start_date = ((typeof req.body.start_date != "undefined" && req.body.start_date != "undefined" && req.body.start_date != "" && req.body.start_date != null) ? req.body.start_date : ""); // start_date = 2022-06-09
                req.body.end_date = ((typeof req.body.end_date != "undefined" && req.body.end_date != "undefined" && req.body.end_date != "" && req.body.end_date != null) ? req.body.end_date : ""); // start_date = 2022-06-12

                if(req.body.start_date != "")
                    req.body.start_date = dateFormat(new Date(req.body.start_date), "yyyy-mm-dd");

                if(req.body.end_date != "")
                    req.body.end_date = dateFormat(new Date(req.body.end_date), "yyyy-mm-dd");

                if(req.body.start_date != "" && req.body.end_date != "") {
                    if(new Date(req.body.start_date) > new Date(req.body.end_date)) {
                        jsonResponse(res, 401, "Warning", "Start Date should be less then End Date", "");
                        return false;
                    }
                }

                let getOrderProductCountByDate = await Promise.all([apiModel.getOrderProductCountByDate(req, 1), apiModel.getOrderProductCountByDate(req, 0)]);
                if(getOrderProductCountByDate[0].length > 0) {
                    let data = {
                        list: getOrderProductCountByDate[0],
                        current_page: req.body.page,
                        page_limit: req.body.limit,
                        overall_count: getOrderProductCountByDate[1].length
                    };
                    // jsonResponse(res, 200, "Success", "Order Details", getOrder[0]);
                    jsonResponse(res, 200, "Success", "Order Product Count By Date", data);
                    return false;
                } else {
                    jsonResponse(res, 401, "Warning", "Failed to get Order Product Count By Date", "");
                    return false;
                }
            } else {
                jsonResponse(res, 401, "Warning", "User Not Found", "");
                return false;
            }
        });
    },

    listOrderProductCountByCustomer: async(req, res) => {
        /*req.body.status = 'active'; // status = active, cancelled
        req.body.sort_by = 'desc'; // sort_by = asc, desc
        req.body.order_by = 'user_id'; // order_by = user_id, first_name, last_name, product_id, product_sku
        req.body.group_by = 'user_id'; // group_by = user_id, product_id, both
        req.body.page = 1; // page = 1
        req.body.limit = 10; // limit = 10*/

        /*"status": "cancelled",
        "sort_by": "desc",
        "order_by": "user_id",
        "group_by": "user_id",
        "page": 1,
        "limit": 10,*/

        Joi.validate(req.body, listOrderProductCountByCustomer, async(error, value) => {
            if (error !== null) {
                jsonResponse(res, 406, "Warning", error.details[0].message, "");
                return false;
            }

            let checkEmail = await Promise.all([apiModel.checkEmail(req)]);
            if(checkEmail[0].length > 0 || typeof req.body.email == "undefined" || req.body.email == "undefined" || req.body.email == "" || req.body.email == null) {
                let getOrderProductCountByCustomer = await Promise.all([apiModel.getOrderProductCountByCustomer(req, 1), apiModel.getOrderProductCountByCustomer(req, 0)]);
                if(getOrderProductCountByCustomer[0].length > 0) {
                    let data = {
                        list: getOrderProductCountByCustomer[0],
                        current_page: req.body.page,
                        page_limit: req.body.limit,
                        overall_count: getOrderProductCountByCustomer[1].length
                    };
                    jsonResponse(res, 200, "Success", "Order Product Count By Customer", data);
                    return false;
                } else {
                    jsonResponse(res, 401, "Warning", "Failed to get Order Product Count By Customer", "");
                    return false;
                }
            } else {
                jsonResponse(res, 401, "Warning", "User Not Found", "");
                return false;
            }
        });
    },

    uploadProduct: async(req, res) => {
        try {
            if (req.file == undefined) {
                jsonResponse(res, 400, "Warning", "Please Upload .xlsx Excel File", "");
                return false;
            }
            const readXlsxFile = require("read-excel-file/node");

            let file_path = path.resolve(".") + "/public/uploads/" + req.file.filename;
            let custom_header = ['Sku', 'Title', 'Description', 'Price'];
            readXlsxFile(file_path).then(async (rows) => {
                var header = [];
                if(typeof rows[0][0] != "undefined" && rows[0][0] != "undefined" && rows[0][0] != "" && rows[0][0] != null && typeof rows[0][1] != "undefined" && rows[0][1] != "undefined" && rows[0][1] != "" && rows[0][1] != null && typeof rows[0][2] != "undefined" && rows[0][2] != "undefined" && rows[0][2] != "" && rows[0][2] != null && typeof rows[0][3] != "undefined" && rows[0][3] != "undefined" && rows[0][3] != "" && rows[0][3] != null) {
                    header.push(rows[0][0], rows[0][1], rows[0][2], rows[0][3]);
                }
                if(header.length === custom_header.length) {
                    if(header.toString().toLowerCase(), custom_header.toString().toLowerCase()) {
                        rows.shift();

                        let data = [];
                        let err = [];
                        let sql = '';
                        rows.forEach((row) => {
                            if(typeof row[0] != "undefined" && row[0] != "undefined" && row[0] != "" && row[0] != null && typeof row[1] != "undefined" && row[1] != "undefined" && row[1] != "" && row[1] != null && typeof row[2] != "undefined" && row[2] != "undefined" && row[2] != "" && row[2] != null && typeof row[3] != "undefined" && row[3] != "undefined" && row[3] != "" && row[3] != null) {
                                let d = {
                                    sku: row[0],
                                    title: row[1],
                                    description: row[2],
                                    price: row[3],
                                };
                                Joi.validate(d, validateProduct, async(error, value) => {
                                    if (error !== null) {
                                        let e = {
                                            sku: row[0],
                                            title: row[1],
                                            description: row[2],
                                            price: row[3],
                                            message: error.details[0].message 
                                        };
                                        err.push(e);
                                    } else {
                                        sql += `INSERT INTO products(sku,name,description,price) VALUES ('${d.sku}','${d.title}','${d.description}','${d.price}') ON DUPLICATE KEY UPDATE name='${d.sku}',description='${d.description}',price='${d.price}';`
                                    }
                                });
                            } else {
                                let e = {
                                    sku: row[0],
                                    title: row[1],
                                    description: row[2],
                                    price: row[3],
                                    message: "All fields are mandatory"
                                };
                                err.push(e);
                            }
                        });
                        if(err.length > 0) {
                            jsonResponse(res, 401, "Warning", "Validation Error Occured Please Correct and Upload Again", err);
                            return false;
                        } else {
                            sql += `SELECT (IFNULL(MAX(id), 0)+1) INTO @counter FROM products;  SET @sql = CONCAT('ALTER TABLE products AUTO_INCREMENT=',@counter); PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;`;

                            await Promise.all([apiModel.uploadProduct(req, sql)]);
                            jsonResponse(res, 200, "Success", "Product Successfully Uploaded", "");
                            return false;
                        }
                    } else {
                        jsonResponse(res, 401, "Warning", "Excel File Header Not Matching Upload Correct File", "");
                        return false;    
                    }
                } else {
                    jsonResponse(res, 401, "Warning", "Excel File Header Columns Not Matching", "");
                    return false;
                }
            });
        } catch (error) {
            jsonResponse(res, 500, "Failed", "Could not upload the file: " + req.file.originalname, "");
            return false;
        }
    }
};