
const managerDB = require("../models/managerModels/managerSchema")
const chefDB = require("../models/userModels/chefSchema")
const dishDB = require("../models/foodModels/foodSchema")
const cashierDB = require("../models/userModels/cashierSchema")
const supplierDB = require("../models/userModels/supplierSchema")
const tableDB = require("../models/tableSchema")
const orderDB = require("../models/orderSchema")
const paymentDB = require("../models/paymentSchema")
const generateToken = require('./tokenUtils')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




module.exports = {

    createManagerHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            const existingUser = await managerDB.findOne({ email: requestData.email, deleted: false });

            if (existingUser !== null) {
                const response = {
                    success: false,
                    data: "This email-Id is taken, try another one",
                };
                resolve(response);
                return;
            }
            else {
                const hashedPassword = await bcrypt.hash(requestData.password, 10);
                let insertData = {
                    name: requestData.name,
                    password: hashedPassword,
                    email: requestData.email,
                    gender: requestData.gender,
                    phoneNumber: requestData.phoneNumber,
                    userType: requestData.userType,
                    experience: requestData.experience,
                    deleted: requestData.deleted
                }
                const dbResponse = await managerDB.insertMany(insertData).then((res) => {

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
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    },

    loginHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            try {
                let user;

                switch (requestData.userType) {
                    case 'manager':
                        user = await managerDB.findOne({ email: requestData.email, deleted: false });
                        break;
                    case 'chef':
                        user = await chefDB.findOne({ email: requestData.email, deleted: false });
                        break;
                    case 'cashier':
                        user = await cashierDB.findOne({ email: requestData.email, deleted: false });
                        break;
                    case 'supplier':
                        user = await supplierDB.findOne({ email: requestData.email, deleted: false });
                        break;
                    default:
                        console.log('Invalid usertype');
                }

                if (!user) {
                    const response = {
                        success: false,
                        data: "User not found",
                    };
                    reject(response);
                    return;
                }

                const passwordMatch = await bcrypt.compare(requestData.password, user.password);

                if (passwordMatch) {
                    const token = generateToken(user, requestData.userType);
                    user.tokens.push(token);
                    await user.save();

                    const response = {
                        success: true,
                        data: user
                    };
                    resolve(response);
                    return;
                } else {
                    const response = {
                        success: false,
                        data: "Incorrect Password",
                    };
                    resolve(response);
                    return;
                }
            } catch (error) {
                const response = {
                    success: false,
                    data: error,
                };

                reject(response);
            }
        });

    },
    managerEditHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            try {
                const User = await managerDB.findOne({ email: requestData.email });

                if (!User) {

                    const response = {
                        success: false,
                        data: "User not found",
                    };
                    resolve(response);
                    return;
                }

                const newData = {
                    email: requestData.email,
                    phoneNumber: requestData.phoneNumber,
                    experience: requestData.experience,
                    name: requestData.name,
                    password: requestData.password,
                };


                await managerDB.findOneAndUpdate({ email: User.email }, { $set: newData }, { new: true }).then((res) => {
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
                        resolve(response);
                        return;
                    }
                })

            } catch (error) {

                console.log(error);

            }

        })
    },
    createChefHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            try{ 
            const existingUser = await chefDB.findOne({ email: requestData.email, deleted: false });

            if (existingUser !== null) {
                const response = {
                    success: false,
                    data: "This email-Id is taken, try another one",
                };
                resolve(response);
                return;
            }
            else {
                const hashedPassword = await bcrypt.hash(requestData.password, 10);
                let insertData = {
                    name: requestData.name,
                    password: hashedPassword,
                    email: requestData.email,
                    gender: requestData.gender,
                    phoneNumber: requestData.phoneNumber,
                    userType: requestData.userType,
                    experience: requestData.experience,
                    deleted: requestData.deleted
                }
          

                        resolve(insertData)
                        return;
                    }
                 } catch (error) {
                    const errorResponse = {
                        success: false,
                        data: error.message || "Internal Server Error"
                    };
                    resolve(errorResponse);
                
        }
        });
        },
    


    viewChefHelper: async (requestData) => {
        
        return new Promise(async (resolve, reject) => {
        try {
            const chefs = await chefDB.aggregate([
                { $match: { deleted: requestData.deleted } }, 
                {
                    $lookup: {
                        from: "dishes",
                        localField: "_id",
                        foreignField: "preparedBy",
                        as: "dishes"
                    }
                },
                {
                    $addFields: {
                        dishes: {
                            $filter: {
                                input: "$dishes",
                                as: "dish",
                                cond: { $eq: ["$$dish.deleted", false] } 
                            }
                        }
                    }
                }
            ]);
    
            const response = {
                success: true,
                data: { chefs },
                error:false
            };
           resolve(response)
            return 
        } catch (error) {
            console.error("Error:", error);
            const response = {
                success: false,
                data: error,
                errore:true
            };
           reject(response)
            return ;
        }
    })
},

    chefEditHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            try {
                const User = await chefDB.findOne({ email: requestData.email });

                if (!User) {

                    const response = {
                        success: false,
                        data: "User not found",
                    };
                    resolve(response);
                    return;
                }

                const newData = {
                    email: requestData.email,
                    phoneNumber: requestData.phoneNumber,
                    experience: requestData.experience,
                    name: requestData.name,
                    password: requestData.password,
                };


                await chefDB.findOneAndUpdate({ email: User.email }, { $set: newData }, { new: true }).then((res) => {
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
                        resolve(response);
                        return;
                    }
                })

            } catch (error) {

                console.log(error);

            }

        })
    },
    createSupplierHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            const existingUser = await supplierDB.findOne({ email: requestData.email, deleted: false });

            if (existingUser !== null) {
                const response = {
                    success: false,
                    data: "This email-Id is taken, try another one",
                };
                resolve(response);
                return;
            }
            else {
                const hashedPassword = await bcrypt.hash(requestData.password, 10);
                let insertData = {
                    name: requestData.name,
                    password: hashedPassword,
                    email: requestData.email,
                    gender: requestData.gender,
                    phoneNumber: requestData.phoneNumber,
                    userType: requestData.userType,
                    experience: requestData.experience,
                    deleted: requestData.deleted
                }
                const dbResponse = await supplierDB.insertMany(insertData).then((res) => {

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
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    },

    viewSupplierHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            try {

                const chefs = await supplierDB.find({ deleted: requestData.deleted });
                if (chefs) {
                    const response = {
                        success: true,
                        data: chefs,
                    }

                    resolve(response)
                    return;
                }
            } catch (error) {
                console.log("error", error);
                const response = {
                    success: false,
                    data: error
                };
                resolve(response);

            }
        });

    },

    supplierEditHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            try {
                const User = await supplierDB.findOne({ email: requestData.email });

                if (!User) {

                    const response = {
                        success: false,
                        data: "User not found",
                    };
                    resolve(response);
                    return;
                }

                const newData = {
                    email: requestData.email,
                    phoneNumber: requestData.phoneNumber,
                    experience: requestData.experience,
                    name: requestData.name,
                    password: requestData.password,
                };


                await supplierDB.findOneAndUpdate({ email: User.email }, { $set: newData }, { new: true }).then((res) => {
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
                        resolve(response);
                        return;
                    }
                })

            } catch (error) {

                console.log(error);

            }

        })
    },
    createCashierHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            const existingUser = await cashierDB.findOne({ email: requestData.email, deleted: false });

            if (existingUser !== null) {
                const response = {
                    success: false,
                    data: "This email-Id is taken, try another one",
                };
                resolve(response);
                return;
            }
            else {
                const hashedPassword = await bcrypt.hash(requestData.password, 10);
                let insertData = {
                    name: requestData.name,
                    password: hashedPassword,
                    email: requestData.email,
                    gender: requestData.gender,
                    phoneNumber: requestData.phoneNumber,
                    userType: requestData.userType,
                    experience: requestData.experience,
                    deleted: requestData.deleted
                }
                const dbResponse = await cashierDB.insertMany(insertData).then((res) => {

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
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    },


    viewCashierHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            try {

                const chefs = await cashierDB.find({ deleted: requestData.deleted });
                if (chefs) {
                    const response = {
                        success: true,
                        data: chefs,
                    }

                    resolve(response)
                    return;
                }
            } catch (error) {
                console.log("error", error);
                const response = {
                    success: false,
                    data: error
                };
                resolve(response);

            }
        });

    },
    cashierEditHelper: (requestData) => {

        return new Promise(async (resolve, reject) => {
            try {
                const User = await cashierDB.findOne({ email: requestData.email });

                if (!User) {

                    const response = {
                        success: false,
                        data: "User not found",
                    };
                    resolve(response);
                    return;
                }

                const newData = {
                    email: requestData.email,
                    phoneNumber: requestData.phoneNumber,
                    experience: requestData.experience,
                    name: requestData.name,
                    password: requestData.password,
                };


                await cashierDB.findOneAndUpdate({ email: User.email }, { $set: newData }, { new: true }).then((res) => {
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
                        resolve(response);
                        return;
                    }
                })

            } catch (error) {

                console.log(error);

            }

        })
    },
    cashierSoftDeleteHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {

            try {
                const result = await cashierDB.findOneAndUpdate({ email: requestData.email }, { deleted: true }, { new: true }
                );

                if (!result) {
                    const response = {
                        success: false,
                        data: "document not found"
                    }
                    resolve(response)
                    return;
                } else {

                    const response = {
                        success: true,
                        data: result
                    }
                    resolve(response)

                }
            } catch (error) {
                console.error('Error soft deleting document:', error);
            }
        })



    },
    managerSoftDeleteHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {

            try {
                const result = await managerDB.findOneAndUpdate({ email: requestData.email }, { deleted: true }, { new: true }
                );

                if (!result) {
                    const response = {
                        success: false,
                        data: "document not found"
                    }
                    resolve(response)
                    return;
                } else {

                    const response = {
                        success: true,
                        data: result
                    }
                    resolve(response)

                }
            } catch (error) {
                console.error('Error soft deleting document:', error);
            }
        })



    },
    chefSoftDeleteHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {

            try {
                const result = await chefDB.findOneAndUpdate({ email: requestData.email }, { deleted: true }, { new: true }
                );

                if (!result) {
                    const response = {
                        success: false,
                        data: "document not found"
                    }
                    resolve(response)

                } else {

                    const response = {
                        success: true,
                        data: result
                    }
                    resolve(response)

                }
            } catch (error) {
                console.error('Error soft deleting document:', error);
            }
        })



    },

    supplierSoftDeleteHelper: async (requestData) => {
        return new Promise(async (resolve, reject) => {

            try {
                const result = await supplierDB.findOneAndUpdate({ email: requestData.email }, { deleted: true }, { new: true }
                );

                if (!result) {
                    const response = {
                        success: false,
                        data: "document not found"
                    }
                    resolve(response)

                } else {

                    const response = {
                        success: true,
                        data: result
                    }
                    resolve(response)

                }
            } catch (error) {
                console.error('Error soft deleting document:', error);
            }
        })



    },
    addPriceHelper : async (requestData) => {
        return new Promise(async (resolve, reject) => {
        try {
         
            const dish = await dishDB.findOne({ _id: requestData.dishId, deleted: false });
    
            if (!dish) {
                const response = {
                    success: false,
                    data: "document not found",
                    error: true
                }
                resolve(response)
                return;
            }
    
            
            dish.price = requestData.price;
            await dish.save();
    
            const response = {
                success: false,
                data: dish,
                error: true
            }
            resolve(response)
            return;
        } catch (error) {
            console.error("Error in addPriceHelper:", error);
            const response = {
                success: false,
                data: error,
                error: true
            }
            reject(response)
            return;
        }
    })


},
viewTableHelper: (requestData) => {

    return new Promise(async (resolve, reject) => {
        try {

            const tables = await tableDB.find({ deleted: requestData.deleted });
            if (tables) {
                const response = {
                    success: true,
                    data: tables,
                }

                resolve(response)
                return;
            }
        } catch (error) {
            console.log("error", error);
            const response = {
                success: false,
                data: error
            };
            resolve(response);

        }
    });

},
 
orderListHelper: (requestData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orderList = await orderDB.find({ deleted: requestData.deleted });
            
            if (orderList.length === 0) {
                const response = {
                    success: false,
                    data: "No orders found."
                };
                resolve(response);
                return;
            }

            const response = {
                success: true,
                data: orderList
            };
            resolve(response);
            return;
        } catch (error) {
            console.log("Error:", error);
            const response = {
                success: false,
                data: "An error occurred while fetching orders."
            };
            resolve(response);
        }
    });
},
paymentHelper: (requestData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payments = await paymentDB.find({ deleted: requestData.deleted });
            
            if (orderList.length === 0) {
                const response = {
                    success: false,
                    data: "No payments found."
                };
                resolve(response);
                return;
            }

            const response = {
                success: true,
                data:  payments
            };
            resolve(response);
            return;
        } catch (error) {
            console.log("Error:", error);
            const response = {
                success: false,
                data: "An error occurred while fetching orders."
            };
            resolve(response);
        }
    });
},
}