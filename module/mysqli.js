module.exports = class mysqli {
    async mysqli(data, row) {
        let k = mysqliq[row];
        for (var i in data) {
            k = k.replace(new RegExp("{{" + i + "}}", "g"), data[i]);
        }
        return k;
    }
};
var mysqliq = [];
mysqliq["checkEmail"] = "SELECT * FROM users WHERE email = '{{email}}' ";
mysqliq["saveUser"] = "INSERT INTO users (first_name, last_name, email, password, created_on) VALUES ('{{first_name}}', '{{last_name}}', '{{email}}', '{{password}}', '{{current_date}}') ";
mysqliq["getProducts"] = "SELECT * FROM products WHERE id IN ({{product_id}})";
mysqliq["createOrder"] = "INSERT INTO orders (user_id, status, created_on) VALUES ({{user_id}}, {{status}}, '{{current_date}}')";
mysqliq["createOrderDetails"] = "INSERT INTO orders_details (product_id, price, order_id, user_id, status, created_on) VALUES ?";
mysqliq["checkOrder"] = "SELECT * FROM orders WHERE id = {{order_id}} AND user_id = {{user_id}} AND status = {{status}}";
mysqliq["updateOrder"] = "UPDATE orders SET updated_on = '{{current_date}}', status = {{status}} WHERE id = {{order_id}} AND user_id = {{user_id}}";
mysqliq["removeOrderDetails"] = "DELETE FROM orders_details WHERE order_id = {{order_id}} AND user_id = {{user_id}} AND status = {{status}}";
mysqliq["updateOrderDetails"] = "UPDATE orders_details SET updated_on = '{{current_date}}', status = {{status}} WHERE order_id = {{order_id}} AND user_id = {{user_id}}";
mysqliq["getOrder"] = "SELECT o.id AS order_id, DATE_FORMAT(o.created_on, '%m/%d/%Y %H:%i:%s') AS created_on, DATE_FORMAT(o.updated_on, '%m/%d/%Y %H:%i:%s') AS updated_on, CASE WHEN o.status = 1 THEN 'Active' ELSE 'Cancelled' END AS status FROM orders AS o WHERE {{where}} {{order}} {{sort}} {{limit}}";
mysqliq["getOrderCount"] = "SELECT COUNT(o.id) AS totalCount FROM orders AS o WHERE {{where}}";
mysqliq["getOrderDetails"] = "SELECT od.product_id, od.price, DATE_FORMAT(od.created_on, '%m/%d/%Y %H:%i:%s') AS created_on, DATE_FORMAT(od.updated_on, '%m/%d/%Y %H:%i:%s') AS updated_on, p.sku {{custom_fields}} FROM orders_details AS od JOIN products AS p ON p.id = od.product_id WHERE {{where}} {{order}} {{sort}} {{limit}}";
mysqliq["getOrderDetailsCount"] = "SELECT COUNT(od.id) AS totalCount FROM orders_details AS od JOIN products AS p ON p.id = od.product_id WHERE {{where}} ";
mysqliq["getOrderProductCountByDate"] = "SELECT COUNT(od.id) AS totalCount, DATE_FORMAT(od.created_on, '%m/%d/%Y') AS date {{custom_fields}} FROM orders_details AS od JOIN products AS p ON p.id = od.product_id WHERE {{where}} {{group}} {{order}} {{limit}}";
mysqliq["getOrderProductCountByDateCount"] = "SELECT od.id FROM orders_details AS od JOIN products AS p ON p.id = od.product_id WHERE {{where}} {{group}}";
mysqliq["getOrderProductCountByCustomer"] = "SELECT COUNT(od.user_id) AS totalCount {{custom_fields}} FROM orders_details AS od JOIN products AS p ON p.id = od.product_id JOIN users AS u ON u.id = od.user_id WHERE {{where}} {{group}} {{order}} {{limit}}";
mysqliq["getOrderProductCountByCustomerCount"] = "SELECT od.id FROM orders_details AS od JOIN products AS p ON p.id = od.product_id JOIN users AS u ON u.id = od.user_id WHERE {{where}} {{group}}";
mysqliq["uploadProduct"] = `{{query}}`;