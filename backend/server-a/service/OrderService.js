'use strict';
let Order = require('../db/Order');
let Sandwich = require('../db/Sandwich');
let order_enque = require('../utils/addMq.js');

/**
 * Add an order for an sandwich
 **/
exports.addOrder = function(order) {
  return new Promise(function(resolve, reject) {
      Sandwich.Sandwich.findOne({sandwich_id: order.sandwichId}, function (err, found_order) {
          if (err) {
              console.log(err);
              return;
          }
          if (isEmpty(found_order)) {
              reject('No sandwich found for given ID...')
          } else {
              const new_order = new Order.Order({sandwichId: found_order._id, status: order.status});
              new_order.save().then((added_order) => {
                  console.log('yes');
                  resolve({sandwichId: found_order.sandwich_id, order_id: added_order.order_id, status: added_order.status});
                  order_enque.getInitOrder();
              }).catch((err) => {
                  console.log('no');
                  reject(err);
              });
          }
      });
  });
};

function isEmpty(obj) {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

/**
 * Find an order by its ID
 **/
exports.getOrderById = function(orderId) {
    return new Promise(function(resolve, reject) {
        Order.Order.findOne({order_id: orderId}, function (err, found_order) {
            if (err) {
                console.log(err)
                return;
            }

            if (isEmpty(found_order)) {
                reject('No sandwich found for given ID...');
            } else {
                console.log(found_order);
                console.log('search by id');
                Sandwich.Sandwich.findOne({_id: found_order.sandwichId}, function (err, found_sandwich) {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    if(!isEmpty(found_sandwich)){
                        resolve({order_id: found_order.order_id, sandwichId: found_sandwich.sandwich_id, status: found_order.status});
                    } else {
                        reject('No sandwich found for given ID...');
                    }
                });
            }
        });
    });
};


/**
 * Find all order by a status
 **/
exports.getOrderByStatus = function(status) {
    return new Promise(function(resolve, reject) {
        Order.Order.find({status: status}, function (err, orders) {
            if (err) {
                console.log(err);
                return;
            }
            if (!orders.length) {
                reject('No sandwich found for '+status+' status...');
            } else {
                resolve(orders);
            }
        });
    });
};


/**
 * Get a list of all orders. Empty array if no orders are found.
 **/
exports.getOrders = function() {
  return new Promise(function(resolve, reject) {
      Order.Order.find(function (err, orders) {
          if (err) {
              reject(err);
              return;
          }
          resolve(orders);
      });
  });
};

/**
 * Update an order
 **/
exports.updateOrder = function (orderId, body) {
    console.log('update order from A');
    console.log(body);
    return new Promise(function (resolve, reject) {
        Order.Order.findOneAndUpdate({_id: orderId}, body, {new: true}, function (err, order) {
            if (err) {
                reject(err);
                return;
            }
            resolve(body);
        })
    });
};

