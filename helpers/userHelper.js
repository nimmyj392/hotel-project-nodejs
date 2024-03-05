const dishDB = require("../models/foodModels/foodSchema")
const { Response } = require("aws-sdk");
const foodDB = require("../models/foodModels/foodSchema")
const tableDB = require("../models/tableSchema")
const managerDB = require("../models/managerModels/managerSchema")
const supplierDB = require("../models/userModels/supplierSchema")
const chefDB = require("../models/userModels/chefSchema")
const cashierDB = require("../models/userModels/cashierSchema")
const orderDB = require("../models/orderSchema")
const todaysMenuDB = require("../models/foodModels/todaysmenuSchema")
const paymentDB = require("../models/paymentSchema")
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: 'rzp_test_fqGYcI1F5zA6Va',
    key_secret: 'nWo0nqR4Mr8lE39vmQR0KmIE'
});

module.exports = {
    addFoodByChefHelper: (requestData) => {
        return new Promise(async (resolve, reject) => {

            if (!requestData.name || !requestData.description || !requestData.category ) {
                const response = {
                    success: false,

                    data: "missing required fields",
                    error:true}
                reject(response);
            }


            const existingFood = await foodDB.findOne({ name: requestData.name });

            if (existingFood) {
                const response = {
                    success: false,
                    data: "Food with this name already exists.",
                    error:true
                };
                reject(response);
            } else {
                let insertData = {
                    name: requestData.name,
                    description: requestData.description,
                    image: requestData.image,
                    category: requestData.category,
                    preparedBy: requestData.preparedBy
                };

                const dbResponse = await foodDB.insertMany(insertData);

                if (!dbResponse) {
                    const response = {
                        success: false,
                        message: "Failed to insert food into the database.",
                        error:true
                    };
                    resolve(response);
                } else {
                    const response = {
                        success: true,
                        data: dbResponse,
                        error: false
                    };
                    resolve(response);
                }
            }

        });
    },


    getMyDishHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {
            const userId = new mongoose.Types.ObjectId(requestData.preparedBy);

            const dishes = await foodDB.find({ preparedBy: userId, deleted: false });

            if (dishes && dishes.length > 0) {

                const response = {
                    success: true,
                    data: dishes
                };
                resolve(response);
            } else {

                console.log("No dishes found for the user");
                const response = {
                    success: true,
                    data: "No dishes found for the user"
                };
                reject(response);
            }
        })
    },

    editMyDishHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {



            const Dish = await dishDB.findOne({ _id: requestData.dishId, preparedBy: requestData.preparedBy });

            if (!Dish) {

                const response = {
                    success: false,
                    data: "Food item not found or unauthorized access",
                };
                reject(response);

            }

            const newData = {
                name: requestData.name,
                description: requestData.description
            };


            await dishDB.findOneAndUpdate({ _id: Dish._id }, { $set: newData }, { new: true }).then((res) => {
                if (res) {

                    const response = {
                        success: true,
                        data: res,
                    };
                    resolve(response);
                    return;
                } else {

                    const response = {
                        success: false,
                        data: "not updated",
                    };
                    reject(response);

                }
            })


        })
    },


    deleteFoodByChefHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {

            const result = await dishDB.findOneAndUpdate({ _id: requestData.dishId, preparedBy: requestData.preparedBy }, { deleted: true }, { new: true }
            );

            if (!result) {
                const response = {
                    success: false,
                    data: "document not found or unauthorized access"
                }
                reject(response)


            } else {

                const response = {
                    success: true,
                    data: result
                }
                resolve(response)
                return;
            }

        })



    },
    dailyDishHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {

            const foodItems = await dishDB.find({ preparedBy: requestData.preparedBy, price: { $exists: true, $ne: null }, deleted: false });
            if (foodItems.length === 0) {

                const response = {
                    success: true,
                    data: "zero food available",
                    error: false
                };
                resolve(response);
                return;
            } else {

                const response = {
                    success: true,
                    data: foodItems,
                    error: false
                };
                resolve(response);
                return;
            }

        });
    },



    addTodaysMenuHelper: (requestData) => {
        return new Promise(async (resolve, reject) => {
            console.log("req", requestData)
            if (!requestData.dishId || !requestData.category || !requestData.stock || !requestData.preparedBy) {
                const response = {
                    isSuccess: false,
                    data: "Missing required parameters",
                    error: true
                };
                resolve(response);
                return;
            }

            let startTime, endTime;

            switch (requestData.category) {
                case 'breakfast':
                    startTime = '09:00 AM';
                    endTime = '12:00 PM';
                    break;
                case 'lunch':
                    startTime = '12:00 PM';
                    endTime = '04:00 PM';
                    break;
                case 'dinner':
                    startTime = '06:00 PM';
                    endTime = '10:00 PM';
                    break;
                default:
                    console.log("Invalid category");
            }

            try {


                const foodItem = await dishDB.findById(requestData.dishId);
                if (!foodItem) {
                    const response = {
                        isSuccess: false,
                        data: "Food item not found.",
                        error: true
                    };
                    resolve(response);
                    return;
                }
              

                const todaysMenu = new todaysMenuDB({
                    foodId: requestData.dishId,
                    category: requestData.category,
                    stock: requestData.stock,
                    price: foodItem.price,
                    startTime: startTime,
                    endTime: endTime,
                    preparedBy: requestData.preparedBy,
                    name: foodItem.name,
                    description: foodItem.description
                });

                const savedMenu = await todaysMenu.save();

                const response = {
                    isSuccess: true,
                    data: {
                        ...savedMenu.toObject(),
                        price: foodItem.price,
                        ...foodItem.toObject()
                    },
                    error: false
                };
                resolve(response);
            } catch (error) {
                resolve({
                    isSuccess: false,
                    data: error.message || "An error occurred",
                    error: true
                });
            }
        });
    },
    addTableHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {

            const existingTable = await tableDB.findOne({ name: requestData.name });
            if (existingTable) {
                const response = {
                    success: false,
                    message: "A table with the same name already exists."
                };
                resolve(response);
                return;
            }
            let insertData = {
                name: requestData.name,
                status: requestData.status
            }
            const dbResponse = await tableDB.insertMany(insertData).then((res) => {

                if (res) {
                    const response = {
                        success: true,
                        data: res,
                    }

                    resolve(response)
                    return;

                } else {
                    const response = {
                        success: false,
                        data: dbResponse
                    }
                    resolve(response)
                    return;
                }
            })
        })
    },
    viewTableHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {


            const tables = await tableDB.find({ deleted: requestData.deleted });
            if (tables) {
                const response = {
                    success: true,
                    data: tables,
                }

                resolve(response)
                return;
            }
            else {
                console.log("error", error);
                const response = {
                    success: false,
                    data: error
                };
                resolve(response);

            }
        });

    },

    selectOrDeselectTableHelper: (requestData) => {
        return new Promise(async (resolve, reject) => {

            const table = await tableDB.findOne({ _id: requestData.tableId });
            if (!table) {
                const response = {
                    isSuccess: false,
                    data: "No table found with provided data",
                    error: true
                };
                reject(response);
                return;
            }


            table.status = !table.status;
            await table.save();

            const response = {
                success: true,
                data: `Table status updated successfully. New status: ${table.status ? 'selected' : 'deselected'}`,
            };
            resolve(response);



        });
    },

    viewTodaysMenuHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {


            const menu = await todaysMenuDB.find({ deleted: requestData.deleted });
            if (menu) {
                const response = {
                    success: true,
                    data: menu,
                }

                resolve(response)
                return;
            }


            else {
                const response = {
                    success: false,
                    data: error
                }
                reject(response);
            }

        });

    },

    orderListHelper: (requestDataFormatted) => {
        console.log("requestDataFormattedx",requestDataFormatted)
        return new Promise(async (resolve, reject) => {

            const foodItem = await todaysMenuDB.findOne({ foodId:requestDataFormatted.foodId });
            if (!foodItem) {
                const response = {
                    success: false,
                    data: "Food item not found."
                };
                reject(response);

            }

            if (foodItem.stock < requestDataFormatted.quantity) {
                const response = {
                    success: false,
                    data: "Insufficient stock for the requested quantity."
                };
                reject(response);

            }

            await todaysMenuDB.updateOne({ _id: foodItem._id }, { $inc: { stock: -requestDataFormatted.quantity } });

            const totalPrice = requestDataFormatted.quantity * foodItem.price;

            const items = [{
                foodId: requestDataFormatted.foodId,
                foodName: foodItem.name,
                quantity: requestDataFormatted.quantity,
                price: foodItem.price
            }];

            const newOrder = new orderDB({
                tableId: requestDataFormatted.tableId,
                items: items,
                supplierId: requestDataFormatted.supplierId,
                chefUpdates: [{ status: 'pending' }],
                totalPrice: totalPrice
            })
            const dbResponse = await newOrder.save();

            if (!dbResponse) {
                const response = {
                    success: false,
                    data: "Failed to insert data into the database."
                };
                reject(response);
            } else {

                const response = {
                    success: true,
                    data: {
                        order: {
                            ...dbResponse.toObject(),
                            items: dbResponse.items.map(item => ({
                                ...item.toObject(),
                                itemPrice: item.quantity * item.price 
                            }))
                        },
                        totalPrice: totalPrice
                    }
                };
                resolve(response)
            }


        });
    },
    getAllOrdersForChefHelper: (requestData) => {
        
        return new Promise(async (resolve, reject) => {
            try {
                const orderList = await orderDB.find({ deleted: requestData.deleted });
                
                if (orderList.length === 0) {
                    const response = {
                        success: false,
                        data: "No orders found.",
                        error: true
                    };
                    reject(response);
                    return;
                }
    
                for (let order of orderList) {
                    try {
                        const food = await foodDB.findById(order.items[0].foodId); 
                        order.foodName = food ? food.name : "Unknown";  
    
                      
                        order.items.forEach(item => {
                            item.foodName = order.foodName;
                        });
                    } catch (error) {
                        console.log("Error fetching food:", error);
                        order.foodName = "Unknown";
                    }
                }
            
                const response = {
                    success: true,
                    data: orderList.map(order => {
                        return {
                            _id: order._id,
                            foodName: order.foodName,
                            tableId: order.tableId,
                            items: order.items,
                            supplierId: order.supplierId,
                            chefUpdates: order.chefUpdates,
                            totalPrice: order.totalPrice,
                            deleted: order.deleted,
                            createdAt: order.createdAt,
                            __v: order.__v,
                            
                        }
                    }),
                    error: false
                };
                resolve(response);
            } catch (error) {
                console.log(error)
                const response = {
                    success: false,
                    data: error,
                    error: true
                };
                reject(response);
            }
        });
    },
    
    
    
    
    updateStatusByChefHelper: (requestData) => {
        return new Promise(async (resolve, reject) => {

            const order = await orderDB.findById(requestData.orderId);

            if (!order) {
                const response = {
                    success: false,
                    data: "Order not found"
                };
                reject(response);

            }

            const latestChefUpdate = order.chefUpdates[order.chefUpdates.length - 1];

            if (latestChefUpdate && latestChefUpdate.status !== 'pending') {
                const response = {
                    success: false,
                    data: "Order status cannot be updated. It's not in 'pending' status."
                };
                reject(response)

            }

            order.status = requestData.status;
            order.preparationTime = requestData.preparationTime;

            order.chefUpdates.push({ status: requestData.status, updatedAt: Date.now() });

            const updatedOrder = await order.save();
            const response = {
                success: true,
                data: "Order status and preparation time updated successfully.", updatedOrder,

            };
            resolve(response);



        });
    },
    viewOrdersServedHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const orders = await orderDB.find({ 'chefUpdates.status': "served" });
               
                
                const servedOrders = orders.filter(order => order.chefUpdates.some(update => update.status === "served"));
                
                if (!servedOrders || servedOrders.length === 0) {
                    const response = {
                        success: true,
                        data: "No served orders found."
                    };
                    resolve(response);
                    return;
                }
    
                
                const formattedOrders = await Promise.all(servedOrders.map(async order => {
                   
                    const supplier = await supplierDB.findById(order.supplierId);
                    const supplierName = supplier ? supplier.name : "Unknown";
    
                    const food = await foodDB.findById(order.items[0].foodId);
                    const foodName = food ? food.name : "Unknown";
    
               
                    const table = await tableDB.findById(order.tableId);
                    const tableName = table ? table.name : "Unknown";
    
                    return {
                        supplierName,
                        foodName,
                        tableName,
                        
                    };
                }));
    
                const response = {
                    success: true,
                    data: formattedOrders
                };
                resolve(response);
    
            } catch (error) {
                const response = {
                    success: false,
                    data: error
                };
                reject(response);
            }
        });
    },
    
    
    
    viewOrdersPendingHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {


            const orders = await orderDB.find({ 'chefUpdates.status': 'pending' });


            if (!orders || orders.length === 0) {
                const response = {
                    success: true,
                    data: "No orders pending found."
                };
                reject(response);
                return;
            }


            const response = {
                success: true,
                data: orders,

            };
            resolve(response)

        });
    },
    calculateBillHelper: async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const order = await orderDB.findOne({ 'chefUpdates.status': 'served' }).sort({ createdAt: -1 });
    
                if (!order) {
                    const response = { success: false, data: "No served orders found." };
                    resolve(response);
                    return;
                }
    
                const totalBillAmount = order.totalPrice;
                
                if (totalBillAmount < 1) {
                    const response = { success: false, data: "Total bill amount must be at least INR 1.00" };
                    resolve(response);
                    return;
                }
                let razorpayOrder;
                try {
                    razorpayOrder = await razorpay.orders.create({
                        amount: totalBillAmount * 100,
                        currency: 'INR',
                        receipt: `order_${order._id}`,
                        payment_capture: '1'
                    });
                } catch (razorpayError) {
                    
                    console.error('Razorpay error:', razorpayError);
                    const response = { success: false, data: "Error creating Razorpay order." };
                    resolve(response);
                    return;
                }
    
                let unpaidItem;
                for (let i = order.items.length - 1; i >= 0; i--) {
                    if (!order.items[i].paid) {
                        unpaidItem = order.items[i];
                        break;
                    }
                }
    
                if (!unpaidItem) {
                    const response = { success: false, data: "No unpaid items found in the order." };
                    resolve(response);
                    return;
                }
    
                const payment = new paymentDB({
                    orderId: order._id,
                    totalAmount: totalBillAmount,
                    amountPaid: totalBillAmount,
                    currency: 'INR',
                    receipt: razorpayOrder.id,
                    dishId: unpaidItem.foodId
                });
    
                await payment.save();
                unpaidItem.paid = true;
                await order.save();
    
                const response = {
                    success: true,
                    data: "Bill calculated successfully.",
                    totalBillAmount: totalBillAmount,
                    razorpayOrder: {
                        id: razorpayOrder.id,
                        amount_paid: totalBillAmount
                    }
                };
                resolve(response);
            } catch (razorpayError) {
                console.error('Razorpay error:', razorpayError);
                const response = { success: false, data: "Error creating Razorpay order. Details: " + razorpayError.message };
                resolve(response);
                return;
            }
        });
    },
    



    collectPaymentByCashHelper: async () => {
        return new Promise(async (resolve, reject) => {

            const order = await orderDB.findOne({ 'chefUpdates.status': 'served' }).sort({ createdAt: -1 });

            if (!order) {
                const response = { success: false, data: "No served orders found.",error:true };
                reject(response);

            }

            let unpaidItem = null;
            for (let i = order.items.length - 1; i >= 0; i--) {
                if (!order.items[i].paid) {
                    unpaidItem = order.items[i];
                    break;
                }
            }

console.log(unpaidItem)
            if (!unpaidItem) {
                const response = { success: false, data: "No unpaid items found in the order.", else:false };
                reject(response);
                return;
            }


            const paymentDetails = {
                orderId: order._id,
                totalAmount: unpaidItem.totalPrice,
                amountPaid: unpaidItem.totalPrice,
                currency: 'INR',
                dishId: unpaidItem.dishId
            };


            const payment = new paymentDB(paymentDetails);


            await payment.save();

            unpaidItem.paid = true;
            await order.save();

            const response = { success: true, data: "Payment received in cash. Order marked as paid.",else:false };
            resolve(response);

        });
    },

    forgotPasswordHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {
            try {


                const existingUser = await Chef.findOne({ email: requestData.email });

                if (!existingUser) {
                    return res.status(404).json({ success: false, data: "No user found with this email." });
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);


                existingUser.password = hashedPassword;

                await existingUser.save();

                const response = { success: true, data: "Password updated successfully.", error: false }
                resolve(response)
                return
            } catch (error) {
                console.error(error);
                const response = { success: false, data: "An error occurred while processing your request.", error: true }

                resolve(response)
            }
        });

    },
    cancelOrderHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {
            try {


                const order = await orderDB.findById(requestData.orderId);


                if (!order) {
                    const response = { success: false, data: "Order not found.", error: true }
                    resolve(response)
                }


                if (order.chefUpdates.some(update => update.status === 'cancelled')) {
                    const response = { success: false, data: "Order has already been cancelled." }
                    resolve(response)
                }

                const servedUpdate = order.chefUpdates.find(update => update.status === 'served');
                if (servedUpdate) {
                    const response = { success: false, data: "Order cannot be cancelled. It has already been served." }
                    resolve(response)
                }


                const currentTime = new Date();
                const orderCreationTime = order.createdAt;
                const timeDifference = currentTime.getTime() - orderCreationTime.getTime();
                const timeDifferenceInMinutes = timeDifference / (1000 * 60);

                if (timeDifferenceInMinutes > 2) {
                    const response = { success: false, data: "Order cannot be cancelled. It has been more than 2 minutes since it was ordered." }
                    resolve(response)
                }


                order.chefUpdates.push({ status: 'cancelled' });
                await order.save();

                const response = { success: true, data: "Order cancelled successfully." }
                resolve(response)
            } catch (error) {
                console.error(error);
                const response = { success: false, data: "An error occurred while processing your request." }

                resolve(response)
            }
        });
    },




    logOutHelper: async (requestData, req) => {

        let UserDB;


        switch (requestData.userType) {
            case 'manager':
                UserDB = managerDB;
                break;
            case 'chef':
                UserDB = chefDB;
                break;
            case 'supplier':
                UserDB = supplierDB;
                break;
            case 'cashier':
                UserDB = cashierDB;
                break;
            default:
                return { success: false, data: "Invalid user type" ,error:true};
        }


        const user = await UserDB.findById(requestData.userId);

        if (!user) {
            const response = { success: false, data: "User not found", error: true };
            reject(response)
        }


        const latestTokenIndex = user.tokens.length - 1;
        if (latestTokenIndex >= 0) {
            const latestToken = user.tokens[latestTokenIndex];
            if (latestToken === req.headers['authorization']) {
                user.tokens.splice(latestTokenIndex, 1);
            }
        }


        await user.save();

        const response = { success: true, data: "Logout successfull" ,error:false};
        resolve(response)

    }
}




