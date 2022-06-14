let Joi = require('joi');
const Extension = require('joi-date-extensions');
Joi = Joi.extend(Extension);
 
const signup = Joi.object().keys({
    first_name: Joi.string().trim().min(3).max(50).regex(/^[a-zA-Z ]+$/).required(),
    last_name: Joi.string().trim().min(3).max(50).regex(/^[a-zA-Z ]+$/).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required()
});

const signin = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required()
});

const createOrder = Joi.object().keys({
    product_id: Joi.alternatives().try(Joi.array().items(Joi.number()), Joi.number()).required(),
    user_id: Joi.number(),
    email: Joi.string().trim().email()
});

const updateOrder = Joi.object().keys({
    product_id: Joi.alternatives().try(Joi.array().items(Joi.number()), Joi.number()).required(),
    order_id: Joi.number().required(),
    user_id: Joi.number(),
    email: Joi.string().trim().email()
});

const cancelOrder = Joi.object().keys({
    order_id: Joi.number().required(),
    user_id: Joi.number(),
    email: Joi.string().trim().email()
});

const listOrder = Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    status: Joi.string().trim().valid('','active','cancelled').insensitive(),
    sort_by: Joi.string().trim().valid('','asc','desc').insensitive(),
    order_by: Joi.string().trim().valid('','order_id','order_date','order_status').insensitive(),
    search: Joi.string().trim().allow(''),
    user_id: Joi.number(),
    email: Joi.string().trim().email()
});

const listOrderDetails = Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    status: Joi.string().trim().valid('','active','cancelled').insensitive(),
    sort_by: Joi.string().trim().valid('','asc','desc').insensitive(),
    order_by: Joi.string().trim().valid('','order_details_id','order_id','product_id','product_sku','order_details_date','order_details_status').insensitive(),
    search: Joi.string().trim().allow(''),
    user_id: Joi.number(),
    email: Joi.string().trim().email()
});

const listOrderProductCountByDate = Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    status: Joi.string().trim().valid('','active','cancelled').insensitive(),
    sort_by: Joi.string().trim().valid('','asc','desc').insensitive(),
    order_by: Joi.string().trim().valid('','filter_date','product_id','product_sku').insensitive(),
    group_by: Joi.string().trim().valid('','filter_date','product_id','both').insensitive(),
    start_date: Joi.date().empty().format('YYYY/MM/DD').allow(['','0000/00/00']),
    end_date: Joi.date().empty().format('YYYY/MM/DD').allow(['','0000/00/00']),
    user_id: Joi.number(),
    email: Joi.string().trim().email().allow('')
});

const listOrderProductCountByCustomer = Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    status: Joi.string().trim().valid('','active','cancelled').insensitive(),
    sort_by: Joi.string().trim().valid('','asc','desc').insensitive(),
    order_by: Joi.string().trim().valid('','user_id','first_name','last_name','product_id','product_sku').insensitive(),
    group_by: Joi.string().trim().valid('','user_id','product_id','both').insensitive(),
    user_id: Joi.number(),
    email: Joi.string().trim().email().allow('')
});

const validateProduct = Joi.object().keys({
    sku: Joi.string().trim().min(3).max(15).regex(/^[a-zA-Z0-9-_]+$/).required(),
    title: Joi.string().trim().min(3).max(50).regex(/^[a-zA-Z0-9,. ]+$/).required(),
    description: Joi.string().trim().min(3).max(200).regex(/^[a-zA-Z0-9,. ]+$/).required(),
    price: Joi.number().min(1).precision(2).max(10).greater(0).positive().required()
});

module.exports = {
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
}