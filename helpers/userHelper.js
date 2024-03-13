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
const otpDB = require("../models/otpSchema")
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const razorpay = new Razorpay({
    key_id: 'rzp_test_fqGYcI1F5zA6Va',
    key_secret: 'nWo0nqR4Mr8lE39vmQR0KmIE'
});

module.exports = {
    addFoodByChefHelper: (requestData) => {
        return new Promise(async (resolve, reject) => {

            if (!requestData.name || !requestData.description || !requestData.category) {
                const response = {
                    success: false,

                    data: "missing required fields",
                    error: true
                }
                reject(response);
            }


            const existingFood = await foodDB.findOne({ name: requestData.name });

            if (existingFood) {
                const response = {
                    success: false,
                    data: "Food with this name already exists.",
                    error: true
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
                        error: true
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
            if (requestData.stock <= 0) {
                const response = {
                    isSuccess: false,
                    data: "Stock value must be greater than zero",
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

    viewTodaysMenuHelper: () => {
        return new Promise(async (resolve, reject) => {
            try {
                // Get today's date
                const today = new Date();
                // Set the start of the day
                const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                // Set the end of the day
                const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
                // Query the database for menu items created today
                const menus = await todaysMenuDB.find({
                    createdAt: { $gte: startOfDay, $lt: endOfDay },
                    deleted: false
                });
    
                const response = {
                    success: true,
                    data: menus,
                };
                resolve(response);
            } catch (error) {
                const response = {
                    success: false,
                    message: 'Error fetching menu.',
                    error: error,
                };
                reject(response);
            }
        });
    },
    
    
        orderListHelper: (requestDataFormatted) => {

       
        return new Promise(async (resolve, reject) => {

            const foodItem = await todaysMenuDB.findOne({ foodId: requestDataFormatted.foodId });
            console.log("fooditem", foodItem)
            if (!foodItem) {
                const response = {
                    success: false,
                    data: "Food item not found.",
                    error: true
                };
                reject(response);

            }

            if (foodItem.stock <requestDataFormatted.quantity) {
                const response = {
                    success: false,
                    data: "Insufficient stock for the requested quantity.",
                    error: true
                };
                reject(response);

            }

            await todaysMenuDB.updateOne({ _id: foodItem._id }, { $inc: { stock: -requestDataFormatted.quantity } });

            const totalPrice = requestDataFormatted.quantity * foodItem.price;


            const items = [{
                foodId: requestDataFormatted.foodId,
                foodName: foodItem.name,
                quantity: requestDataFormatted.quantity,
                price: foodItem.price,
                totalPriceForItem: requestDataFormatted.quantity * foodItem.price
            }];


            const newOrder = new orderDB({
                tableId: requestDataFormatted.tableId,
                items: items,
                supplierId: requestDataFormatted.supplierId,
                supplierStatus: 'ready_to_payment',
                totalPrice: totalPrice
            });
            const dbResponse = await newOrder.save();

            if (!dbResponse) {
                const response = {
                    success: false,
                    data: "Failed to insert data into the database.",
                    error: true
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
                    },
                    error: false
                };
                resolve(response)
            }


        });
    },
    getAllOrdersForChefHelper: (requestData, today) => {
        return new Promise(async (resolve, reject) => {
            try {
                const orderList = await orderDB.find({ deleted: requestData.deleted, createdAt: { $gte: today } });
    
                if (orderList.length === 0) {
                    const response = {
                        success: false,
                        data: "No orders found for today.",
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
                            __v: order.__v
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
    



 addFoodInOrderListHelper:(orderId, foodId, quantity)=> {
        return new Promise(async (resolve, reject) => {
        try {
            const existingOrder = await orderDB.findById(orderId);
            
            if (!existingOrder) {
                const response = {
                    success: false,
                    data: "Order not found",
                    error: true
                };
                reject(response) ;
            }
        
            const foodItem = await todaysMenuDB.findOne({ foodId });
            if (!foodItem) {
                const response = {
                    success: false,
                    data: "Food item not found",
                    error: true
                };
                reject(response) ;
            }
        
            if (foodItem.stock < quantity) {
                const response = {
                    success: false,
                    data: "Insufficient stock",
                    error: true
                };
                reject(response) ;
            }
        
            existingOrder.items.push({
                foodId,
                quantity,
                price: foodItem.price,
                totalPriceForItem: quantity * foodItem.price
            });
        
            // Update total price by summing prices of all items in the order
            existingOrder.totalPrice = existingOrder.items.reduce((total, item) => {
                return total + item.totalPriceForItem;
            }, 0);
        
            foodItem.stock -= quantity;
            await foodItem.save();
        
            const savedOrder = await existingOrder.save();
        
            const response = {
                success: true,
                data: savedOrder,
                error: false
            };
            resolve(response) ;
        } catch (error) {
            const response = {
                success: false,
                data: error.message,
                error: true
            };
            reject(response) ;
        }
    })
    },
viewOrderListHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {
        try {
            const orderList = await orderDB.find({
                createdAt: requestData.createdAt,
                deleted: requestData.deleted
            });
    
            if (orderList.length === 0) {
                const response = {
                    success: true,
                    data: "no orders found",
                    error:true
                }

                reject(response)
                return;
            } else {
                const ordersWithDetails = await Promise.all(orderList.map(async (order) => {
                    const supplier = await supplierDB.findById(order.supplierId);
                    const table = await tableDB.findById(order.tableId);
                    return {
                        ...order.toObject(),
                        supplierName: supplier ? supplier.name : 'Unknown Supplier',
                        tableName: table ? table.name : 'Unknown Table'
                    };
                }));
    
                const response = {
                    success: true,
                    data:ordersWithDetails,
                    error:false
                }

                resolve(response)
                return;
            }
        } catch (error) {
            const response = {
                success: false,
                data:error.message,
                error:true
            }

            reject(response)
        }
    })
    },
    updateStatusBySupplierHelper:(orderId, newStatus) =>{
        return new Promise(async (resolve, reject) => {
        try {
            // Find the order by its ID
            const order = await orderDB.findById(orderId);
            if (!order) {
                const response = {
                    success: false,
                    data: "Order not found",
                    error: true
                };
                reject(response) ;
            }
    
            // Update the supplier status
            order.supplierStatus = newStatus;
    
            // Save the updated order
            await order.save();
            const response = {
                success: true,
                data: order,
                error: false
            };
            resolve(response) ;
        } catch (error) {
            const response = {
                success: false,
                data: error.message,
                error: true
            };
            reject(response) ;
        }
    })
    },
    
   getServedOrdersHelper: async () => {
        try {
            // Query the database for orders with "served" status
            const servedOrders = await orderDB.find({ supplierStatus: 'served' });
    
            const response = {
                success: true,
                data:servedOrders,
                error: false
            };
            resolve(response) ;
        } catch (error) {
            const response = {
                success: false,
                data: error.message,
                error: true
            };
            reject(response) ;
        }
    },
    getReadyToPaymentOrdersHelper: async () => {
        try {
            
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            
           
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            
            const orders = await orderDB.find({
                supplierStatus: 'ready_to_payment',
                createdAt: { $gte: today, $lt: tomorrow }
            });
    
            return {
                success: true,
                data: orders,
                error: false
            };
        } catch (error) {
            return {
                success: false,
                data: error.message,
                error: true
            };
        }
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
                const tables = await tableDB.find();
    
                let responseArray = []; // Array to store responses for each table
    
                for (const table of tables) {
                    const orders = await orderDB.find({ tableId: table._id, supplierStatus: 'ready_to_payment' }).sort({ createdAt: -1 });
    
                    let tableResponse = {
                        success: true,
                        data: `Bill calculated successfully for table ${table.name}.`,
                        error: false
                    };
    
                    let paidAllOrders = true; // Flag to track if all orders for this table are paid
    
                    for (const order of orders) {
                        const totalBillAmount = order.totalPrice;
    
                        if (totalBillAmount < 1) {
                            tableResponse = {
                                success: false,
                                data: `Total bill amount for table ${table.name} must be at least INR 1.00`,
                                error: true
                            };
                            continue;
                        }
    
                        let unpaidItem;
                        for (let i = order.items.length - 1; i >= 0; i--) {
                            if (!order.items[i].paid) {
                                unpaidItem = order.items[i];
                                break;
                            }
                        }
    
                        if (!unpaidItem) {
                            // If there are no unpaid items in the order, mark paidAllOrders as false and continue to the next order
                            paidAllOrders = false;
                            continue;
                        }
    
                        // Process payment for the unpaid item
                        const payment = new paymentDB({
                            orderId: order._id,
                            totalAmount: totalBillAmount,
                            amountPaid: totalBillAmount,
                            currency: 'INR',
                            receipt: razorpayOrder.id,
                            dishId: unpaidItem.foodId
                        });
    
                        await payment.save();
    
                        // Mark the unpaid item as paid
                        unpaidItem.paid = true;
                        await order.save();
    
                        // Prepare response for successful payment
                        tableResponse.razorpayOrder = {
                            id: razorpayOrder.id,
                            amount_paid: totalBillAmount
                        };
                    }
    
                    // If all orders for this table are already paid, update the response accordingly
                    if (paidAllOrders) {
                        tableResponse.data = `All orders for table ${table.name} are already paid.`;
                    }
    
                    responseArray.push(tableResponse); // Push the response for this table to the array
                }
    
                resolve(responseArray); // Resolve with the array containing responses for all tables
    
            } catch (error) {
                console.error('Error:', error);
                const response = {
                    success: false,
                    data: "An error occurred. Details: " + error.message,
                    error: true
                };
                resolve(response); // Resolve with the error response
            }
        })
    },
    
    collectPaymentByCashHelper: async () => {
        return new Promise(async (resolve, reject) => {

            const order = await orderDB.findOne({ 'chefUpdates.status': 'served' }).sort({ createdAt: -1 });

            if (!order) {
                const response = { success: false, data: "No served orders found.", error: true };
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
                const response = { success: false, data: "No unpaid items found in the order.", else: false };
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

            const response = { success: true, data: "Payment received in cash. Order marked as paid.", else: false };
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
    forgotPasswordHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const userExists = {
                    chef: await chefDB.exists({ email: requestData.email }),
                    supplier: await supplierDB.exists({ email: requestData.email }),
                    manager: await managerDB.exists({ email: requestData.email }),
                    cashier: await cashierDB.exists({ email: requestData.email })
                };


                if (!Object.values(userExists).some(exists => exists)) {
                    const response = { success: false, data: "User not found.", error: true }

                    resolve(response)
                }
                const otp = Math.floor(100000 + Math.random() * 900000);
                await otpDB.create({ email: requestData.email, otp: otp });

                await transporter.sendMail({
                    from: 'nimmyj392@gmail.com',
                    to: requestData.email,
                    subject: 'OTP for Account Verification',
                    text: `Your OTP (One Time Password) is: ${otp}. Please use this OTP to verify your account.`
                });

                console.log('OTP sent to email:', requestData.email);

                const response = { success: true, data: "Otp sent successfully", error: false }
                resolve(response)
            } catch (error) {
                console.error('Error sending OTP:', error);
                const response = { success: false, data: "Error sending otp", error: true }
                reject(response)
            }
        })
    },
    verifyOTPHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const otpDocument = await otpDB.findOne({ email: requestData.email }).sort({ createdAt: -1 });

                if (!otpDocument) {
                    const response = { success: false, data: "Document not found", error: true }
                    reject(response)
                }

                if (otpDocument.otp !== requestData.otp) {
                    const response = { success: false, data: "Invalid otp", error: true }
                    reject(response)
                }


                const response = { success: true, data: "Otp verified successfully!", error: false }
                resolve(response)
            } catch (error) {
                console.error('Error verifying OTP:', error);
                const response = { success: false, data: "Error verifying otp", error: true }
                reject(response)
            }


        })
    },

    storeNewPasswordHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {

            try {
                let userModel;

                if (await chefDB.exists({ email: requestData.email })) {
                    userModel = chefDB;
                } else if (await supplierDB.exists({ email: requestData.email })) {
                    userModel = supplierDB;
                } else if (await managerDB.exists({ email: requestData.email })) {
                    userModel = managerDB;
                } else if (await cashierDB.exists({ email: requestData.email })) {
                    userModel = cashierDB;
                } else {
                    const response = { success: false, data: "User not found", error: true }
                    reject(response)
                }

                const user = await userModel.findOne({ email: requestData.email });
                if (user) {
                    const hashedPassword = await bcrypt.hash(requestData.newPassword, 10);
                    user.password = hashedPassword;

                    await user.save();
                    const response = { success: true, data: "Password updated", error: false }
                    resolve(response)

                } else {
                    const response = { success: false, data: "User not found", error: true }
                    reject(response)

                }
            } catch (error) {
                console.error('Error storing new password:', error);
                const response = { success: false, data: "Error storing new password", error: true }
                reject(response)
            }
        })
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
                return { success: false, data: "Invalid user type", error: true };
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

        const response = { success: true, data: "Logout successfull", error: false };
        resolve(response)

    }
}




