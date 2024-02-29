const dishDB = require("../models/foodModels/foodSchema")
const { Response } = require("aws-sdk");
const foodDB = require("../models/foodModels/foodSchema")
const tableDB = require("../models/tableSchema")
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

            if (!requestData.name || !requestData.description || !requestData.category || !requestData.preparedBy) {
                const response = {
                    success: false,

                    data: "Food with this name already exists."
                };
                reject(response);
            }


            const existingFood = await foodDB.findOne({ name: requestData.name });

            if (existingFood) {
                const response = {
                    success: false,
                    message: "Food with this name already exists.",
                    data: existingFood
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
                        message: "Failed to insert food into the database."
                    };
                    resolve(response);
                } else {
                    const response = {
                        success: true,
                        data: dbResponse
                    };
                    reject(response);
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
            console.log("req",requestData)
            if (!requestData.foodId || !requestData.category || !requestData.stock || !requestData.preparedBy) {
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
               
    
                const foodItem = await dishDB.findById(requestData.foodId);
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
                    foodId: requestData.foodId,
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
                        menu: {
                            ...savedMenu.toObject(),
                            price: foodItem.price,
                            ...foodItem.toObject()
                        }
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

    orderListHelper: (requestData) => {
        return new Promise(async (resolve, reject) => {

            const foodItem = await todaysMenuDB.findOne({ foodId: requestData.foodId });
            if (!foodItem) {
                const response = {
                    success: false,
                    message: "Food item not found."
                };
                reject(response);

            }

            if (foodItem.stock < requestData.quantity) {
                const response = {
                    success: false,
                    message: "Insufficient stock for the requested quantity."
                };
                reject(response);

            }

            await todaysMenuDB.updateOne({ _id: foodItem._id }, { $inc: { stock: -requestData.quantity } });

            const totalPrice = requestData.quantity * foodItem.price;

            const items = [{
                foodId: requestData.foodId,
                quantity: requestData.quantity,
                price: foodItem.price
            }];

            const newOrder = new orderDB({
                tableId: requestData.tableId,
                items: items,
                supplierId: requestData.supplierId,
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
                        order: dbResponse,
                        totalPrice: totalPrice
                    }
                };
                resolve(response);
            }


        });
    },


    getAllOrdersForChefHelper: (requestData) => {
        return new Promise(async (resolve, reject) => {

            const orderList = await orderDB.find({ deleted: requestData.deleted });

            if (orderList.length === 0) {
                const response = {
                    success: false,
                    data: "No orders found."
                };
                reject(response);
                return;
            }

            const response = {
                success: true,
                data: orderList
            };
            resolve(response);
            return;


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


            const orders = await orderDB.find({ 'chefUpdates.status': 'served' });


            if (!orders || orders.length === 0) {
                const response = {
                    success: true,
                    data: "No orders served by chef found."
                };
                reject(response);
                return;
            }

            else {
                const response = {
                    success: true,
                    data: orders,

                };
                resolve(response);
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

            const order = await orderDB.findOne({ 'chefUpdates.status': 'served' }).sort({ createdAt: -1 });

            if (!order) {
                const response = { success: false, data: "No served orders found." };
                reject(response)

            }
            const totalBillAmount = order.totalPrice;

            const razorpayOrder = await razorpay.orders.create({
                amount: totalBillAmount * 100,
                currency: 'INR',
                receipt: `order_${order._id}`,
                payment_capture: '1'
            });

            let unpaidItem;


            for (let i = order.items.length - 1; i >= 0; i--) {
                if (!order.items[i].paid) {
                    unpaidItem = order.items[i];
                    break;
                }
            }


            if (!unpaidItem) {
                const response = { success: false, data: "No unpaid items found in the order." };
                reject(response)
                return
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
            }
            resolve(response)
            return;

        });
    },




    collectPaymentInCashHelper: async () => {
        return new Promise(async (resolve, reject) => {

            const order = await orderDB.findOne({ 'chefUpdates.status': 'served' }).sort({ createdAt: -1 });

            if (!order) {
                const response = { success: false, data: "No served orders found." };
                reject(response);

            }

            let unpaidItem = null;
            for (let i = order.items.length - 1; i >= 0; i--) {
                if (!order.items[i].paid) {
                    unpaidItem = order.items[i];
                    break;
                }
            }

            if (!unpaidItem) {
                const response = { success: false, data: "No unpaid items found in the order." };
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

            const response = { success: true, data: "Payment received in cash. Order marked as paid." };
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
                UserDB = ManagerDB;
                break;
            case 'chef':
                UserDB = ChefDB;
                break;
            case 'supplier':
                UserDB = SupplierDB;
                break;
            case 'cashier':
                UserDB = CashierDB;
                break;
            default:
                return { success: false, data: "Invalid user type" };
        }


        const user = await UserDB.findById(requestData.userId);

        if (!user) {
            const response = { success: false, data: "User not found", error: false };
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

        const response = { success: true, data: "Logout successful" };
        resolve(response)

    }
}




