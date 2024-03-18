const { model } = require("mongoose");
const userHelper = require("../helpers/userHelper");
const userDataValidator = require("../controllers/validator/userValidator");
// const userDB = require("../models/userModels/userSchema")
const nodemailer = require('nodemailer');
require('dotenv').config();
const managerDB = require("../models/managerModels/managerSchema")
const supplierDB = require("../models/userModels/supplierSchema")
const chefDB = require("../models/userModels/chefSchema")
const cashierDB = require("../models/userModels/cashierSchema")
const otpDB = require("../models/otpSchema")
const mongoose = require('mongoose');

const { orderListHelper } = require('../helpers/userHelper')

var otpValidator;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = {
    addFoodByChef: (async (req, res) => {
        const requestData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            preparedBy: req.userId
        }

        const validatorResponse = await userDataValidator.addFoodByChefValidator(requestData);
        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: validatorResponse.error,
                error: true
            })
        } else if (validatorResponse && validatorResponse.value) {
            userHelper.addFoodByChefHelper(requestData).then((response) => {

                if (response) {
                    res.json({

                        isSuccess: true,
                        response: response,
                        error: false
                    })
                } else {

                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch((error) => {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: error.data
                })


            })
        }


    }),


    getMyDishes: (async (req, res) => {
        const requestData = {
            preparedBy: req.userId

        }

        userHelper.getMyDishHelper(requestData)
            .then((response) => {

                if (response) {

                    res.json({

                        isSuccess: true,
                        response: response,
                        error: false
                    })
                } else {

                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch(error => {
                console.error('Error fetching dish', error);
                res.json({
                    isSuccess: false,
                    response: {},
                    error: error.data
                });
            });

    }),

    editMyDish: (async (req, res) => {
       
        const requestData = {
            dishId: req.body.dishId,
            name: req.body.name,
            description: req.body.description,
            preparedBy: req.userId
        }
        const validatorResponse = await userDataValidator.editMyDishValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            userHelper.editMyDishHelper(requestData).then((response) => {

                if (response.success) {
                    res.json({
                        isSuccess: true,
                        response: response.data,
                        error: false
                    })
                } else {
                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch((error) => {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: error.data
                })


            })
        }
    }),

    deleteFoodByChef: (async (req, res) => {
        const requestData = {
            dishId: req.body.dishId,
            preparedBy: req.userId
        }
        const validatorResponse = await userDataValidator.deleteFoodByChefValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            }) 
        }
        else if (validatorResponse && validatorResponse.value) {
            userHelper.deleteFoodByChefHelper(requestData).then((response) => {

                if (response.success) {
                    res.json({
                        isSuccess: true,
                        response: response.data,
                        error: false
                    })
                } else {
                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch((error) => {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: error.data
                })


            })
        }
    }),

    dailyDish: (async (req, res) => {

        const requestData = {
            preparedBy: req.userId
        }

        userHelper.dailyDishHelper(requestData).then((response) => {

            if (response.success) {
                res.json({
                    isSuccess: true,
                    response: response.data,
                    error: false
                })
            } else {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                })
            }
        }).catch((response) => {
            res.json({
                isSuccess: false,
                response: {},
                error: response.data
            })


        })

    }),


    addTodaysMenu: (async (req, res) => {
        const requestDataArray = Array.isArray(req.body) ? req.body : [req.body];

        const responses = [];

        for (const requestData of requestDataArray) {

            try {

                const response = await userHelper.addTodaysMenuHelper(requestData);

                if (response) {
                    responses.push({
                        isSuccess: true,
                        response: response.data,
                        error: false
                    });
                } else {
                    responses.push({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    });
                }
            } catch (error) {
                responses.push({
                    isSuccess: false,
                    response: {},
                    error: error.data
                });
            }
          
        }

        res.json(responses);
    }),
    deleteMenuItem: (async (req, res) => {
        const requestData = {
            menuId: req.body.menuId,
            preparedBy: req.userId
        }
        const validatorResponse = await userDataValidator.deleteFoodByChefValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            userHelper.deleteFoodByChefHelper(requestData).then((response) => {

                if (response.success) {
                    res.json({
                        isSuccess: true,
                        response: response.data,
                        error: false
                    })
                } else {
                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch((response) => {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                })


            })
        }
    }),

    addTable: (async (req, res) => {
        const requestData = {
            name: req.body.name,
            status: req.body.status,
            deleted: false
        }

        const validatorResponse = await userDataValidator.addTableValidator(requestData);
        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        } else if (validatorResponse && validatorResponse.value) {
            userHelper.addTableHelper(requestData).then((response) => {

                if (response) {
                    res.json({

                        isSuccess: true,
                        response: response,
                        error: false
                    })
                } else {

                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch((response) => {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                })


            })
        }


    }),

    viewTable: (async (req, res) => {

        const requestData = {
            deleted: false
        }

        userHelper.viewTableHelper(requestData).then((response) => {

            if (response.success) {
                res.json({
                    isSuccess: true,
                    response: response.data,
                    error: false
                })
            } else {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                })
            }
        })
        // .catch((response) => {
        //     res.json({
        //         isSuccess: false,
        //         response: {},
        //         error: response.data
        //     })


        // })

    }),
    selectOrDeselectTable: (async (req, res) => {
        const requestData = {
            tableId: req.body.tableId,
            status: req.body.status
        }

        const validatorResponse = await userDataValidator.selectOrDeselectTableValidator(requestData);
        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        } else if (validatorResponse && validatorResponse.value) {
            userHelper.selectOrDeselectTableHelper(requestData).then((response) => {

                if (response) {
                    res.json({

                        isSuccess: true,
                        response: response,
                        error: false
                    })
                } else {

                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch((response) => {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                })


            })
        }


    }),

    viewTodaysMenu: async (req, res) => {
        try {
         
            const currentDate = new Date();
          
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
      
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    
            
            const response = await userHelper.viewTodaysMenuHelper(startDate, endDate);
    
            if (response.success) {
                res.json({
                    isSuccess: true,
                    response: response.data,
                    error: false
                });
            } else {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                });
            }
        } catch (error) {
            res.json({
                isSuccess: false,
                response: {},
                error: error.message 
            });
        }
    },
    


    editTodaysMenu: async (req, res) => {
        try {
            const requestData = {
                menuId: req.body.menuId,
                name: req.body.name,
                stock:req.body.stock
            }
           
        const validatorResponse = await userDataValidator.editTodaysMenuValidator(requestData);
        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        } else if (validatorResponse && validatorResponse.value) {
            const response = await userHelper.editTodaysMenuHelper(requestData );
    
            if (response.success) {
                res.json({
                    isSuccess: true,
                    response: response.data,
                    error: false
                });
            }
        }} catch (error) {
            console.error("Error editing today's menu:", error);
            res.status(500).json({ success: false, error: true, data: "Internal server error" });
        }
    },
    deleteTodaysMenu: async (req, res) => {
        try {
            console.log("req", req.body);
            const menuId = req.body.menuId;
    
            // Ensure menuId is valid
            if (!menuId) {
                return res.status(400).json({
                    isSuccess: false,
                    response: "Menu ID is required.",
                    error: true
                });
            }
    
            // Check if menuId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(menuId)) {
                return res.status(400).json({
                    isSuccess: false,
                    response: "Invalid menu ID.",
                    error: true
                });
            }
    
            const response = await userHelper.deleteTodaysMenuHelper(menuId);
    
            if (response.success) {
                return res.json({
                    isSuccess: true,
                    response: response.data,
                    error: false
                });
            } else {
                console.log("Error deleting today's menu item:", response.error);
                return res.status(500).json({
                    isSuccess: false,
                    response: "Error deleting today's menu item.",
                    error: response.error
                });
            }
        } catch (error) {
            console.error("Error deleting today's menu item:", error);
            return res.status(500).json({
                isSuccess: false,
                response: "Internal server error.",
                error: error.message
            });
        }
    },
    orderList: async (req, res) => {
        try {
            const requestData = {
                selectedDishes: req.body.selectedDishes,
                tableId: req.body.tableId,
                supplierStatus: re.body.supplierStatus,
                supplierId: req.userId
            };
    
            const invalidOrder = requestData.selectedDishes.find(dish => !dish.quantity);
            if (invalidOrder) {
                return res.json({
                    isSuccess: false,
                    response: {},
                    error: "Quantity is missing for a dish."
                });
            }
    
            const response = await userHelper.orderListHelper(requestData);
            
            if (response.success) {
                return res.json({
                    isSuccess: true,
                    response: response.data,
                    error: false
                });
            } else {
                return res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                });
            }
        } catch (error) {
            return res.json({
                isSuccess: false,
                response: {},
                error: error.data
            });
        }
    },
    
    updateSupplierStatus: async (req, res) => {
        try {
            const requestData = {
                supplierId: req.userId,
                newStatus: req.body.newStatus, 
            };
    
            const response = await userHelper.updateSupplierStatusHelper(requestData);
    
            if (response.success) {
                return res.json({
                    isSuccess: true,
                    response: response.data,
                    error: false
                });
            } else {
                return res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                });
            }
        } catch (error) {
            return res.json({
                isSuccess: false,
                response: {},
                error: error.data
            });
        }
    },    
    getAllOrdersForChef: async (req, res) => {
        const requestData = {
            deleted: false
        }
        
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        userHelper.getAllOrdersForChefHelper(requestData, today).then((response) => {
            if (response.success) {
                res.json({
                    isSuccess: true,
                    response: response.data,
                    error: false
                });
            } else {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                });
            }
        }).catch((response) => {
            res.json({
                isSuccess: false,
                response: {},
                error: response.data
            });
        });
    },
    
 addFoodInOrderList:async (req, res)  =>{
        try {
            const { orderId, foodId, quantity } = req.body;
    
            if (!orderId || !foodId || !quantity) {
                return res.status(400).json({
                    success: false,
                    error: "Missing required fields: orderId, foodId, quantity"
                });
            }
    
            const updatedOrder = await userHelper.addFoodInOrderListHelper(orderId, foodId, quantity);
    
            return res.status(200).json({
                success: true,
                data: updatedOrder,
                message: "Food item added to order successfully"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    viewOrderList: async (req, res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 
    console.log("hdhd")
        const requestData = {
            createdAt: {
                $gte: today, 
                $lt: tomorrow 
            },
            deleted: false
        };
    
        try {
            const response = await userHelper.viewOrderListHelper(requestData);
            if (response.success) {
                res.json({
                    isSuccess: true,
                    response: response.data,
                    error: false
                });
            } else {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                });
            }
        } catch (error) {
            res.json({
                isSuccess: false,
                response: {},
                error: error.message 
            });
        }
    },

    updateStatusBySupplier:async(req, res) =>{
        try {
            const { orderId, newStatus } = req.body;
    
            if (!orderId || !newStatus) {
                return res.status(400).json({
                    success: false,
                    response:{},
                    error: "Missing required fields: orderId, newStatus"
                });
            }
    
            const result = await userHelper.updateStatusBySupplierHelper(orderId, newStatus);
    
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    response: result.data,
                    error:{}
                });
            } else {
                return res.status(404).json({
                    success: false,
                    response:{},
                    error: result.error
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                response:{},
                error: error.message
            });
        }
    },
  getServedOrders:async(req, res) =>{
        try {
         
            const servedOrders = await userHelper.getServedOrdersHelper();
    
            return res.status(200).json({
                success: true,
                data: servedOrders,
                error:false          
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                response:{},
                error: error.message
            });
        }
    },
    getReadyToPaymentOrders:async(req, res) =>{
        try {
           
            const orders = await userHelper.getReadyToPaymentOrdersHelper();
    
            return res.status(200).json({
                success: true,
                data: orders,
                error:false          
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                response:{},
                error: error.message
            });
        }
    },
    viewOrdersServed: (async (req, res) => {
        const requestData = {
            cashierId: req.userId

        }

        // const validatorResponse = await managerDataValidator.viewChefValidator(requestData);
        // if (validatorResponse && validatorResponse.error) {
        //     res.json({
        //         isSuccess: false,
        //         response: validatorResponse.error,
        //         error: true
        //     })
        // } else if (validatorResponse && validatorResponse.value) {
        userHelper.viewOrdersServedHelper(requestData, orderListHelper)
            .then((response) => {

                if (response) {

                    res.json({

                        isSuccess: true,
                        response: response,
                        error: false
                    })
                } else {

                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch(error => {
                console.error('Error fetching dish', error);
                res.json({
                    isSuccess: false,
                    response: {},
                    error: error
                });
            });

    }),
    viewOrdersPending: (async (req, res) => {


        userHelper.viewOrdersPendingHelper()
            .then((response) => {

                if (response) {

                    res.json({

                        isSuccess: true,
                        response: response,
                        error: false
                    })
                } else {

                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch(error => {
                console.error('Error fetching dish', error);
                res.json({
                    isSuccess: false,
                    response: {},
                    error: error
                });
            });

    }),
    calculateBill: (async (req, res) => {
        // const requestData = {
        //     orderId: req.body.orderId

        // }

        // const validatorResponse = await userDataValidator.calculateBillValidator(requestData);

        // if (validatorResponse && validatorResponse.error) {
        //     res.json({
        //         isSuccess: false,
        //         response: {},
        //         error: validatorResponse.error
        //     })
        // }
        // else if (validatorResponse && validatorResponse.value) {
        userHelper.calculateBillHelper()
            .then((response) => {

                if (response) {

                    res.json({

                        isSuccess: true,
                        response: response,
                        error: false
                    })
                } else {

                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch(error => {
                console.error('Error fetching dish', error);
                res.json({
                    isSuccess: false,
                    response: {},
                    error: error
                });
            });


    }),
    collectPaymentByCash: (async (req, res) => {

        userHelper.collectPaymentByCashHelper()
            .then((response) => {

                if (response) {

                    res.json({

                        isSuccess: true,
                        response: response,
                        error: false
                    })
                } else {

                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch(error => {
                console.error('Error fetching dish', error);
                res.json({
                    isSuccess: false,
                    response: {},
                    error: error
                });
            });


    }),
    forgotPassword: async (req, res) => {
        const requestData = {
            email: req.body.email
        };

        try {
            const validatorResponse = await userDataValidator.forgotPasswordValidator(requestData);

            if (validatorResponse && validatorResponse.error) {
                return res.json({
                    isSuccess: false,
                    response: {},
                    error: validatorResponse.error
                });
            } else if (validatorResponse && validatorResponse.value) {
                userHelper.forgotPasswordHelper(requestData).then((response) => {
                    if (response.success) {
                        return res.json({
                            isSuccess: true,
                            response: response.data,
                            error: false
                        });
                    } else {
                        return res.json({
                            isSuccess: false,
                            response: {},
                            error: response.data
                        });
                    }
                }).catch((response) => {
                    return res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    });
                });
            }
        } catch (error) {
            console.error('Error in forgot password:', error);
            return res.json({
                isSuccess: false,
                response: {},
                error: "Error in forgot password"
            });
        }
    },




    verifyOTPAndStoreUser: async (req, res) => {
        const requestData = {
            email: req.body.email,
            otp: req.body.otp
        };

        try {
            const validatorResponse = await userDataValidator.verifyOTPAndStoreUserValidator(requestData);

            if (validatorResponse && validatorResponse.error) {
                return res.json({
                    isSuccess: false,
                    response: {},
                    error: validatorResponse.error
                });
            } else if (validatorResponse && validatorResponse.value) {
                userHelper.verifyOTPHelper(requestData).then((response) => {
                    if (response.success) {
                        return res.json({
                            isSuccess: true,
                            response: response.data,
                            error: false
                        });
                    } else {
                        return res.json({
                            isSuccess: false,
                            response: {},
                            error: response.data
                        });
                    }
                }).catch((response) => {
                    return res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    });
                });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return res.json({
                isSuccess: false,
                response: {},
                error: "Error verifying OTP"
            });
        }
    },
    storeNewPassword: async (req, res) => {
        try {

            const requestData = {
                email: req.body.email,
                otp: req.body.otp,
                newPassword: req.body.newPassword
            };


            const otpDocument = await otpDB.findOne({ email: requestData.email }).sort({ createdAt: -1 });
            if (!otpDocument) {
                return res.json({
                    isSuccess: false,
                    response: {},
                    error: 'Document not found or expired'
                });
            }

            if (otpDocument.otp !== requestData.otp) {
                return res.json({
                    isSuccess: false,
                    response: {},
                    error: 'Invalid OTP'
                });
            }

            await otpDB.deleteOne({ _id: otpDocument._id });


            const response = await userHelper.storeNewPasswordHelper(requestData);

            return res.json({
                isSuccess: response.success,
                response: response.data,
                error: response.error
            });
        } catch (error) {
            console.error('Error storing new password:', error);
            return res.json({
                isSuccess: false,
                response: {},
                error: "Error storing new password"
            });
        }
    },

    cancelOrder: (async (req, res) => {
        const requestData = {
            orderId: req.body.orderId
        }
        const validatorResponse = await userDataValidator.cancelOrderValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            userHelper.cancelOrderHelper(requestData).then((response) => {

                if (response.success) {
                    res.json({
                        isSuccess: true,
                        response: response.data,
                        error: false
                    })
                } else {
                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch((response) => {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                })


            })
        }
    }),
    logOut: (async (req, res) => {
        console.log("req",req.body)
        const requestData = {
          
            userId: req.userId,
            userType: req.userType
        }
        const validatorResponse = await userDataValidator.logOutValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            userHelper.logOutHelper(requestData, req).then((response) => {

                if (response.success) {
                    res.json({
                        isSuccess: true,
                        response: response.data,
                        error: false
                    })
                } else {
                    res.json({
                        isSuccess: false,
                        response: {},
                        error: response.data
                    })
                }
            }).catch((response) => {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: response.data
                })


            })
        }
    }),

}