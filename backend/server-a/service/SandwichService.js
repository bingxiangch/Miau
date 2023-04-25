'use strict';
const mongoose = require('mongoose');
let Sandwich = require('../db/Sandwich');

/**
 * Add a new sandwich to the store. Needs an API key.
 **/
exports.addSandwich = function(body) {
    return new Promise(function(resolve, reject) {
        const new_sandwich = new Sandwich.Sandwich(body);
        new_sandwich.save().then(() => {
            resolve(body);
        }).catch((err) => {
            console.log('error save sandwich');
            reject(err)
        });
    });
};

/**
 * Deletes a sandwich
 **/
exports.deleteSandwich = function(sandwichId,api_key) {
    return new Promise(function(resolve, reject) {
        resolve();
    });
};


/**
 * Find sandwich by ID
 **/
exports.getSandwichById = function(sandwichId) {
    return new Promise(function(resolve, reject) {
        var examples = {};
        examples['application/json'] = {
            "name" : "my-super-sandwich",
            "toppings" : [ {
                "name" : "name",
                "order_id" : 6
            }, {
                "name" : "name",
                "order_id" : 6
            } ],
            "order_id" : 0,
            "breadType" : "oat"
        };
        if (Object.keys(examples).length > 0) {
            resolve(examples[Object.keys(examples)[0]]);
        } else {
            resolve();
        }
    });
};


/**
 * Get a list of all sandwiches. Empty array if no sandwiches are found.
 **/
exports.getSandwiches = function() {
    return new Promise(function(resolve, reject) {
        Sandwich.Sandwich.find(function (err, sandwiches) {
            if (err) {
                reject(err);
                return;
            }
            resolve(sandwiches);
        });
    });
};


/**
 * Updates a sandwich in the store with JSON in body
 **/
exports.updateSandwich = function(sandwichId,body) {
    return new Promise(function(resolve, reject) {
        resolve();
    });
};

