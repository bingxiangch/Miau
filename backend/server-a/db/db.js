const mongoose = require('mongoose');
let Sandwich = require('../service/SandwichService');

module.exports = function () {
    const db = 'mongodb://mongodb:27017/sandwich_order';
    mongoose.connect(db)
        .then(() => {
            console.log(`Connected to ${db}...`);

            let preDefinedSandwichList = [
                {
                    name: "Bacon, egg and cheese",
                    toppings: [
                        {
                            name: "Beacon",
                        },
                        {
                            name: "lettuce",
                        },
                    ],
                    breadType: "oat"
                },
                {
                    "name": "Beef, egg and salad",
                    "toppings": [
                        {
                            "name": "Beef",
                            "order_id": 3
                        },
                        {
                            "name": "peas & mint",
                            "order_id": 4
                        },
                    ],
                    "breadType": "wheat"
                },
                {
                    "name": "Cheese, Chicken and cheese",
                    "toppings": [
                        {
                            "name": "Cheese",
                            "order_id": 5
                        }
                    ],
                    "breadType": "rye"
                },
            ];

            // Get all toppings from db
            Sandwich.getSandwiches().then((sandwiches) => {
                let sandwich_list = sandwiches.map(function(item) {
                    return item.name;
                });

                preDefinedSandwichList.forEach((name) => {
                    let temp_name = name.name;
                    if(!sandwich_list.includes(temp_name)){
                        Sandwich.addSandwich(name)
                        .then((i) => {
                            console.log('sandwich saved');
                        }).catch((error) => {
                            console.log(error);
                        });
                    }
                });
            }).catch();
        }).catch(err => console.log('Could not connect to MongooDB...', err));
};