var mysqli = require("../mysqli");
const mysqclass = new mysqli();
var dateFormat = require("dateformat");
const moment = require("moment");
const md5 = require("md5");
const _ = require("underscore");
const config = require("config").get("Common");
class apiModule {
    constructor() {}

    async checkEmail(req) {
        let mysql = {
            'email': typeof req.body.email != "undefined" ? req.body.email : ""
        };
        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "checkEmail");
        // console.log(" checkEmail ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async saveUser(req) {
        let passwordSalt = config.get("salt") ? config.get("salt") : "!@#$%^&*";
        let passwordHash = md5(md5(req.body.password) + passwordSalt);
        let currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        let mysql = {
            'first_name': typeof req.body.first_name != "undefined" ? req.body.first_name : "",
            'last_name': typeof req.body.last_name != "undefined" ? req.body.last_name : "",
            'email': typeof req.body.email != "undefined" ? req.body.email : "",
            'password': passwordHash ? passwordHash : "",
            'current_date': currentDate
        };
        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "saveUser");
        // console.log(" saveUser ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async getProducts(req) {
        let mysql = {
            'product_id': ((typeof req.body.product_id != "undefined" && req.body.product_id != "undefined" && req.body.product_id != "" && req.body.product_id.length > 0) ? req.body.product_id.join(",") : "")
        };
        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "getProducts");
        // console.log(" getProducts ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async createOrder(req) {
        let currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        let mysql = {
            'user_id': typeof req.body.user_id != "undefined" ? req.body.user_id : 0,
            'status': typeof req.body.status != "undefined" ? req.body.status : 1,
            'current_date': currentDate
        };
        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "createOrder");
        // console.log(" createOrder ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async createOrderDetails(req) {
        let mysql = {};
        let escape_data = [req.body.product_id_arr];
        let strQuery = await mysqclass.mysqli(mysql, "createOrderDetails");
        // console.log(" createOrderDetails ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async checkOrder(req) {
        let mysql = {
            'order_id': typeof req.body.order_id != "undefined" ? req.body.order_id : 0,
            'user_id': typeof req.body.user_id != "undefined" ? req.body.user_id : 0,
            'status': typeof req.body.status != "undefined" ? req.body.status : 1
        };
        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "checkOrder");
        // console.log(" checkOrder ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async updateOrder(req) {
        let currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        let mysql = {
            'order_id': typeof req.body.order_id != "undefined" ? req.body.order_id : 0,
            'user_id': typeof req.body.user_id != "undefined" ? req.body.user_id : 0,
            'status': typeof req.body.status != "undefined" ? req.body.status : 1,
            'current_date': currentDate
        };
        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "updateOrder");
        // console.log(" updateOrder ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async removeOrderDetails(req) {
        let mysql = {
            'order_id': typeof req.body.order_id != "undefined" ? req.body.order_id : 0,
            'user_id': typeof req.body.user_id != "undefined" ? req.body.user_id : 0,
            'status': typeof req.body.status != "undefined" ? req.body.status : 1
        };
        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "removeOrderDetails");
        // console.log(" removeOrderDetails ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async updateOrderDetails(req) {
        let currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        let mysql = {
            'order_id': typeof req.body.order_id != "undefined" ? req.body.order_id : 0,
            'status': typeof req.body.status != "undefined" ? req.body.status : 1,
            'user_id': typeof req.body.user_id != "undefined" ? req.body.user_id : 0,
            'current_date': currentDate
        };
        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "updateOrderDetails");
        // console.log(" updateOrderDetails ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async getOrder(req, flag) {
        req.body.search = ((typeof req.body.search != "undefined" && req.body.search != "undefined" && req.body.search != "" && req.body.search != null) ? req.body.search : ''); // search = product_id / product_sku / order_id / price
        req.body.status = ((typeof req.body.status != "undefined" && req.body.status != "undefined" && req.body.status != "" && req.body.status != null) ? req.body.status.toString().toLowerCase() : ''); // status = active, cancelled
        req.body.sort_by = ((typeof req.body.sort_by != "undefined" && req.body.sort_by != "undefined" && req.body.sort_by != "" && req.body.sort_by != null) ? req.body.sort_by.toString().toLowerCase() : ''); // sort_by = asc, desc
        req.body.order_by = ((typeof req.body.order_by != "undefined" && req.body.order_by != "undefined" && req.body.order_by != "" && req.body.order_by != null) ? req.body.order_by.toString().toLowerCase() : ''); // order_by = order_id, order_date
        req.body.page = ((typeof req.body.page != "undefined" && req.body.page != "undefined" && req.body.page != "" && req.body.page != null && Number(req.body.page) > 0 && !isNaN(req.body.page)) ? Number(req.body.page) : 1); // page = 1
        req.body.limit = ((typeof req.body.limit != "undefined" && req.body.limit != "undefined" && req.body.limit != "" && req.body.limit != null && Number(req.body.limit) > 0 && !isNaN(req.body.limit)) ? Number(req.body.limit) : 10); // limit = 10

        let page = (req.body.page - 1) * req.body.limit;
        let limit = " LIMIT " + page + "," + req.body.limit;

        let order = ' ORDER BY ';
        if (req.body.order_by == "order_id")
            order = order + ' o.id ';
        else if (req.body.order_by == "order_date")
            order = order + ' o.created_on ';
        else if (req.body.order_by == "order_status")
            order = order + ' o.status ';
        else
            order = order + ' o.id ';

        let sort = ' ASC ';
        if (req.body.sort_by == "asc")
            sort = ' ASC ';
        else if (req.body.sort_by == "desc")
            sort = ' DESC ';

        if (req.body.order_by == "order_status") {
            if (req.body.sort_by == "asc")
                sort = ' DESC ';
            else if (req.body.sort_by == "desc")
                sort = ' ASC ';
            else
                sort = ' DESC ';
        }

        let where = ' 1 = 1 ';

        if (typeof req.body.user_id != "undefined" && req.body.user_id != "undefined" && req.body.user_id != "" && req.body.user_id != null)
            where += ' AND o.user_id = ' + req.body.user_id;

        if(req.body.status == "active")
            where += ' AND o.status = 1 ';
        else if(req.body.status == "cancelled")
            where += ' AND o.status = 0 ';

        if(req.body.search != "") {
            if (isNaN(req.body.search)) {
                where += ' AND FIND_IN_SET(o.id, (SELECT IFNULL(GROUP_CONCAT(od.order_id), 0) FROM orders_details AS od JOIN products AS p ON od.product_id = p.id WHERE LOWER(p.sku) = LOWER("' + req.body.search.toString().toLowerCase() + '")) ) ';
            } else if (!isNaN(req.body.search) && (parseInt(req.body.search) || parseFloat(req.body.search))) {
                where += ' AND ( o.id = ' + req.body.search + ' OR o.id IN (SELECT IFNULL(od.order_id, 0) FROM orders_details AS od WHERE od.product_id = ' + req.body.search + ')  OR o.id IN (SELECT IFNULL(od.order_id, 0) FROM orders_details AS od WHERE od.price = "' + req.body.search + '") ) ';
            }
        }
        let mysql = {
            'where': where,
            'limit': limit,
            'order': order,
            'sort': sort
        };

        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "getOrderCount");
        if(flag == 1)
            strQuery = await mysqclass.mysqli(mysql, "getOrder");
        else if(flag == 0)
            strQuery = await mysqclass.mysqli(mysql, "getOrderCount");

        // console.log(" getOrder ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async getOrderDetails(req, flag) {
        let where = ' 1 = 1 ';
        let order = ' ORDER BY ';
        let sort = ' ASC ';
        let limit = '';
        let custom_fields = '';
        if(flag != "") {
            where = ' 1 = 1 ';
            req.body.search = ((typeof req.body.search != "undefined" && req.body.search != "undefined" && req.body.search != "" && req.body.search != null) ? req.body.search : ''); // search = product_id / product_sku / order_id / price
            req.body.status = ((typeof req.body.status != "undefined" && req.body.status != "undefined" && req.body.status != "" && req.body.status != null) ? req.body.status.toString().toLowerCase() : ''); // status = active, cancelled
            req.body.sort_by = ((typeof req.body.sort_by != "undefined" && req.body.sort_by != "undefined" && req.body.sort_by != "" && req.body.sort_by != null) ? req.body.sort_by.toString().toLowerCase() : ''); // sort_by = asc, desc
            req.body.order_by = ((typeof req.body.order_by != "undefined" && req.body.order_by != "undefined" && req.body.order_by != "" && req.body.order_by != null) ? req.body.order_by.toString().toLowerCase() : ''); // order_by = order_details_id, order_id, product_id, order_details_date, order_details_status
            req.body.page = ((typeof req.body.page != "undefined" && req.body.page != "undefined" && req.body.page != "" && req.body.page != null && Number(req.body.page) > 0 && !isNaN(req.body.page)) ? Number(req.body.page) : 1); // page = 1
            req.body.limit = ((typeof req.body.limit != "undefined" && req.body.limit != "undefined" && req.body.limit != "" && req.body.limit != null && Number(req.body.limit) > 0 && !isNaN(req.body.limit)) ? Number(req.body.limit) : 10); // limit = 10

            let page = (req.body.page - 1) * req.body.limit;
            limit = " LIMIT " + page + "," + req.body.limit;

            if (req.body.order_by == "order_id")
                order = order + ' od.order_id ';
            else if (req.body.order_by == "order_details_date")
                order = order + ' od.created_on ';
            else if (req.body.order_by == "order_details_status")
                order = order + ' od.status ';
            else if (req.body.order_by == "product_id")
                order = order + ' od.product_id ';
            else if (req.body.order_by == "product_sku")
                order = order + ' p.sku ';
            else
                order = order + ' od.id ';

            if (req.body.sort_by == "asc")
                sort = ' ASC ';
            else if (req.body.sort_by == "desc")
                sort = ' DESC ';

            if (req.body.order_by == "order_details_status") {
                if (req.body.sort_by == "asc")
                    sort = ' DESC ';
                else if (req.body.sort_by == "desc")
                    sort = ' ASC ';
                else
                    sort = ' DESC ';
            }

            if (typeof req.body.user_id != "undefined" && req.body.user_id != "undefined" && req.body.user_id != "" && req.body.user_id != null)
                where += ' AND od.user_id = ' + req.body.user_id;

            if(req.body.status == "active")
                where += ' AND od.status = 1 ';
            else if(req.body.status == "cancelled")
                where += ' AND od.status = 0 ';

            if(req.body.search != "") {
                if (isNaN(req.body.search)) {
                    where += ' AND LOWER(p.sku) = LOWER("' + req.body.search.toString().toLowerCase() + '") ';
                } else if (!isNaN(req.body.search) && (parseInt(req.body.search) || parseFloat(req.body.search))) {
                    where += ' AND ( od.id = ' + req.body.search + ' OR od.product_id = ' + req.body.search + ' OR od.price = "' + req.body.search + '") ) ';
                }
            }

            custom_fields += ", od.id AS order_details_id, od.order_id, CASE WHEN od.status = 1 THEN 'Active' ELSE 'Cancelled' END AS status ";
        } else {
            where = ' 1 = 1 ';
            if (typeof req.body.order_id != "undefined" && req.body.order_id != "undefined" && req.body.order_id != "" && req.body.order_id != null)
                where += ' AND od.order_id = ' + req.body.order_id;

            if (typeof req.body.user_id != "undefined" && req.body.user_id != "undefined" && req.body.user_id != "" && req.body.user_id != null)
                where += ' AND od.user_id = ' + req.body.user_id;

            order = order + ' od.id ';
        }
        let mysql = {
            'where': where,
            'limit': limit,
            'order': order,
            'sort': sort,
            'custom_fields': custom_fields
        };
        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "getOrderDetails");
        if(flag == 1)
            strQuery = await mysqclass.mysqli(mysql, "getOrderDetails");
        else if(flag == 0)
            strQuery = await mysqclass.mysqli(mysql, "getOrderDetailsCount");

        // console.log(" getOrderDetails ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async getOrderProductCountByDate(req, flag) {
        let where = ' 1 = 1 ';
        let order = ' ORDER BY ';
        let sort = ' ASC ';
        let limit = '';
        let group = ' GROUP BY ';
        let custom_fields = '';
        where = ' 1 = 1 ';
        req.body.status = ((typeof req.body.status != "undefined" && req.body.status != "undefined" && req.body.status != "" && req.body.status != null) ? req.body.status.toString().toLowerCase() : ''); // status = active, cancelled
        req.body.sort_by = ((typeof req.body.sort_by != "undefined" && req.body.sort_by != "undefined" && req.body.sort_by != "" && req.body.sort_by != null) ? req.body.sort_by.toString().toLowerCase() : ''); // sort_by = asc, desc
        req.body.order_by = ((typeof req.body.order_by != "undefined" && req.body.order_by != "undefined" && req.body.order_by != "" && req.body.order_by != null) ? req.body.order_by.toString().toLowerCase() : ''); // order_by = filter_date, product_id, product_sku
        req.body.group_by = ((typeof req.body.group_by != "undefined" && req.body.group_by != "undefined" && req.body.group_by != "" && req.body.group_by != null) ? req.body.group_by.toString().toLowerCase() : ''); // group_by = filter_date, product_id, both
        req.body.page = ((typeof req.body.page != "undefined" && req.body.page != "undefined" && req.body.page != "" && req.body.page != null && Number(req.body.page) > 0 && !isNaN(req.body.page)) ? Number(req.body.page) : 1); // page = 1
        req.body.limit = ((typeof req.body.limit != "undefined" && req.body.limit != "undefined" && req.body.limit != "" && req.body.limit != null && Number(req.body.limit) > 0 && !isNaN(req.body.limit)) ? Number(req.body.limit) : 10); // limit = 10
        req.body.start_date = ((typeof req.body.start_date != "undefined" && req.body.start_date != "undefined" && req.body.start_date != "" && req.body.start_date != null) ? req.body.start_date : ""); // start_date = 2022-06-09
        req.body.end_date = ((typeof req.body.end_date != "undefined" && req.body.end_date != "undefined" && req.body.end_date != "" && req.body.end_date != null) ? req.body.end_date : ""); // start_date = 2022-06-12

        let page = (req.body.page - 1) * req.body.limit;
        limit = " LIMIT " + page + "," + req.body.limit;

        if (req.body.order_by == "filter_date")
            order = order + ' od.created_on ';
        else if (req.body.order_by == "product_id")
            order = order + ' od.product_id ';
        else if (req.body.order_by == "product_sku")
            order = order + ' p.sku ';
        else
            order = order + ' od.created_on ';

        if (req.body.sort_by == "asc")
            sort = ' ASC ';
        else if (req.body.sort_by == "desc")
            sort = ' DESC ';

        if (req.body.order_by == "order_details_status") {
            if (req.body.sort_by == "asc")
                sort = ' DESC ';
            else if (req.body.sort_by == "desc")
                sort = ' ASC ';
            else
                sort = ' DESC ';
        }

        if (req.body.group_by == "filter_date")
            group = group + ' DATE(od.created_on) ';
        else if (req.body.group_by == "product_id")
            group = group + ' od.product_id ';
        else if (req.body.group_by == "both")
            group = group + ' DATE(od.created_on), od.product_id ';
        else
            group = group + ' DATE(od.created_on) ';

        if(req.body.status == "active")
            where += ' AND od.status = 1 ';
        else if(req.body.status == "cancelled")
            where += ' AND od.status = 0 ';

        if(req.body.start_date != "" && req.body.end_date != "")
            where += ' AND DATE(od.created_on) BETWEEN "' + req.body.start_date + '" AND "' + req.body.end_date + '" ';
        else if(req.body.start_date != "" && req.body.end_date == "")
            where += ' AND DATE(od.created_on) >= "' + req.body.start_date + '" ';
        else if(req.body.start_date == "" && req.body.end_date != "")
            where += ' AND DATE(od.created_on) <= "' + req.body.end_date + '" ';

        custom_fields += ", od.product_id, p.sku, p.name ";
        
        if (typeof req.body.user_id != "undefined" && req.body.user_id != "undefined" && req.body.user_id != "" && req.body.user_id != null)
            where += ' AND od.user_id = ' + req.body.user_id;

        let mysql = {
            'status': typeof req.body.status != "undefined" ? req.body.status : 1,
            'user_id': typeof req.body.user_id != "undefined" ? req.body.user_id : 0,
            'where': where,
            'limit': limit,
            'order': order,
            'group': group,
            'sort': sort,
            'custom_fields': custom_fields
        };

        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "getOrderProductCountByDate");
        if(flag == 1)
            strQuery = await mysqclass.mysqli(mysql, "getOrderProductCountByDate");
        else if(flag == 0)
            strQuery = await mysqclass.mysqli(mysql, "getOrderProductCountByDateCount");

        // console.log(" getOrderProductCountByDate ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async getOrderProductCountByCustomer(req, flag) {
        let where = ' 1 = 1 ';
        let order = ' ORDER BY ';
        let sort = ' ASC ';
        let limit = '';
        let group = ' GROUP BY ';
        let custom_fields = '';
        where = ' 1 = 1 ';
        req.body.status = ((typeof req.body.status != "undefined" && req.body.status != "undefined" && req.body.status != "" && req.body.status != null) ? req.body.status.toString().toLowerCase() : ''); // status = active, cancelled
        req.body.sort_by = ((typeof req.body.sort_by != "undefined" && req.body.sort_by != "undefined" && req.body.sort_by != "" && req.body.sort_by != null) ? req.body.sort_by.toString().toLowerCase() : ''); // sort_by = asc, desc
        req.body.order_by = ((typeof req.body.order_by != "undefined" && req.body.order_by != "undefined" && req.body.order_by != "" && req.body.order_by != null) ? req.body.order_by.toString().toLowerCase() : ''); // order_by = user_id, first_name, last_name, product_id, product_sku
        req.body.group_by = ((typeof req.body.group_by != "undefined" && req.body.group_by != "undefined" && req.body.group_by != "" && req.body.group_by != null) ? req.body.group_by.toString().toLowerCase() : ''); // group_by = user_id, product_id, both
        req.body.page = ((typeof req.body.page != "undefined" && req.body.page != "undefined" && req.body.page != "" && req.body.page != null && Number(req.body.page) > 0 && !isNaN(req.body.page)) ? Number(req.body.page) : 1); // page = 1
        req.body.limit = ((typeof req.body.limit != "undefined" && req.body.limit != "undefined" && req.body.limit != "" && req.body.limit != null && Number(req.body.limit) > 0 && !isNaN(req.body.limit)) ? Number(req.body.limit) : 10); // limit = 10

        let page = (req.body.page - 1) * req.body.limit;
        limit = " LIMIT " + page + "," + req.body.limit;

        if (req.body.order_by == "user_id")
            order = order + ' od.user_id ';
        else if (req.body.order_by == "first_name")
            order = order + ' u.first_name ';
        else if (req.body.order_by == "last_name")
            order = order + ' u.last_name ';
        else if (req.body.order_by == "product_id")
            order = order + ' od.product_id ';
        else if (req.body.order_by == "product_sku")
            order = order + ' p.sku ';
        else
            order = order + ' od.created_on ';

        if (req.body.sort_by == "asc")
            sort = ' ASC ';
        else if (req.body.sort_by == "desc")
            sort = ' DESC ';

        if (req.body.group_by == "user_id") {
            group = group + ' od.user_id ';
            custom_fields += ", od.user_id, u.first_name, u.last_name ";
        } else if(req.body.group_by == "product_id" || req.body.group_by == "both") {
            group = group + ' od.user_id, od.product_id ';
            custom_fields += ", od.user_id, u.first_name, u.last_name, od.product_id, p.sku, p.name ";
        } else {
            group = group + ' od.user_id ';
            custom_fields += ", od.user_id, u.first_name, u.last_name ";
        }

        if(req.body.status == "active")
            where += ' AND od.status = 1 ';
        else if(req.body.status == "cancelled")
            where += ' AND od.status = 0 ';
        
        if (typeof req.body.user_id != "undefined" && req.body.user_id != "undefined" && req.body.user_id != "" && req.body.user_id != null)
            where += ' AND od.user_id = ' + req.body.user_id;

        let mysql = {
            'where': where,
            'limit': limit,
            'order': order,
            'group': group,
            'sort': sort,
            'custom_fields': custom_fields
        };

        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "getOrderProductCountByCustomer");
        if(flag == 1)
            strQuery = await mysqclass.mysqli(mysql, "getOrderProductCountByCustomer");
        else if(flag == 0)
            strQuery = await mysqclass.mysqli(mysql, "getOrderProductCountByCustomerCount");

        // console.log(" getOrderProductCountByCustomer ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }

    async uploadProduct(req, sql) {
        let mysql = {
            'query': sql
        };
        let escape_data = [];
        let strQuery = await mysqclass.mysqli(mysql, "uploadProduct");
        // console.log(" uploadProduct ", strQuery)
        return await global.mysql.query(strQuery, escape_data);
    }
}

module.exports = apiModule;