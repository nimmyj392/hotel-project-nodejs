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
const { orderListHelper } = require('../helpers/userHelper')

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
                    response:{} ,
                    error: error.data
                });
            });

    }),

    editMyDish: (async (req, res) => {
        console.log("req",req)
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
                    response:{},
                    error:  error.data
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
            // }
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

    viewTodaysMenu: (async (req, res) => {

        const requestData = {
            deleted: false
        }

        userHelper.viewTodaysMenuHelper(requestData).then((response) => {

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
   

    orderList: async (req, res) => {
        try {
            console.log("Received request:", req.body);
    
            const requestData = {
                selectedDishes : req.body.selectedDishes,
                tableId : req.body.tableId,
                supplierId: req.userId
            }
            const invalidOrder = requestData.selectedDishes.find(dish => !dish.quantity);
            if (invalidOrder) {
             
                res.json({
                    isSuccess: false,
                    response: {},
                    error: "Quantity is missing for a dish." 
                });
            }
    
            const responses = [];
    
            for (const orderData of requestData.selectedDishes) {
                orderData.tableId = requestData.tableId;
                orderData.supplierId = req.userId;
              
    
                const response = await userHelper.orderListHelper(orderData);
                console.log("response",response)
                responses.push(response);
            }
    
            res.json({
                isSuccess: true,
                response: responses,
                error: false
            });
        } catch (error) {
            res.json({
                isSuccess: false,
                response: {},
                error: error.data
            });
        }
    },
    
    
    
    

    getAllOrdersForChef: (async (req, res) => {

        const requestData = {
            deleted: false
        }

        userHelper.getAllOrdersForChefHelper(requestData).then((response) => {

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


    updateStatusByChef: (async (req, res) => {

        const requestData = {
            orderId: req.body.orderId,
            status: req.body.status,
     
        };

        const validatorResponse = await userDataValidator.updateStatusByChefValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            userHelper.updateStatusByChefHelper(requestData).then((response) => {

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
        userHelper.viewOrdersServedHelper(requestData,orderListHelper)
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
                        response:{} ,
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
        try {
            console.log("req :",req.body)
            const requestData = {
                email: req.body.email,
                password: req.body.password
            };

            const validatorResponse = await userDataValidator.forgotPasswordValidator(requestData);

            if (validatorResponse && validatorResponse.error) {
                return res.json({
                    isSuccess: false,
                    response: {},
                    error: validatorResponse.error
                });
            } else if (validatorResponse && validatorResponse.value) {


                const otp = Math.floor(100000 + Math.random() * 900000);

                req.session.otp = otp;
                req.session.password = requestData.password;
                req.session.email = requestData.email;

                await transporter.sendMail({
                    from: 'nimmyj392@gmail.com',
                    to: requestData.email,
                    subject: 'OTP for Account Verification',
                    text: `Your OTP (One Time Password) is: ${otp}. Please use this OTP to verify your account.`
                });
                console.log('OTP sent to email:', requestData.email);

                return res.json({
                    isSuccess: true,
                    response: "OTP sent successfully",
                    error: false
                });

            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            return res.json({
                isSuccess: false,
                response:{} ,
                error: "Error sending OTP"
            });
        }
    },
   verifyOTPAndStoreUser: async (req, res) => {
    const otp = req.body.otp;
    const storedOTP = req.session.otp;
    console.log(storedOTP);

    if (otp != storedOTP) {
        return res.json({
            isSuccess: false,
            response: {},
            error: 'Invalid OTP',
        });
    }

    const userEmail = req.session.email;
    const newPassword = req.session.password;

    let dbResponse;
    try {
        
        dbResponse = await chefDB.findOneAndUpdate({ email: userEmail }, { password: newPassword });
        if (!dbResponse) {
            dbResponse = await managerDB.findOneAndUpdate({ email: userEmail }, { password: newPassword });
        }
        if (!dbResponse) {
            dbResponse = await supplierDB.findOneAndUpdate({ email: userEmail }, { password: newPassword });
        }
        if (!dbResponse) {
            dbResponse = await cashierDB.findOneAndUpdate({ email: userEmail }, { password: newPassword });
        }

        if (dbResponse) {
            return res.json({
                isSuccess: true,
                response: "password updated successfully!",
                error: null,
            });
        } else {
            return res.json({
                isSuccess: false,
                response: {},
                error: 'Failed to update password in any database',
            });
        }
    } catch (error) {
        return res.json({
            isSuccess: false,
            response: {},
            error: error.message || 'An error occurred while updating password in the database',
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
        const requestData = {
            userId: req.userId,
            userType: req.body.userType
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