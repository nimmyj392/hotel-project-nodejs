const { model } = require("mongoose");
const userHelper = require("../helpers/userHelper");
const userDataValidator = require("../controllers/validator/userValidator");
// const userDB = require("../models/userModels/userSchema")
const nodemailer = require('nodemailer');
require('dotenv').config();

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
    // Assuming middleware or function extracts supplierId from token and returns it


orderList: async (req, res) => {
    console.log("giiii");
    const requestData = req.body;
    console.log("requestArray", requestData);
    console.log(typeof requestData);

    if (!Array.isArray(requestData)) {
        res.json({
            isSuccess: false,
            response: {},
            error: "Request data must be an array of objects"
        });
        return; // Exit the function if request data is not an array
    }

    try {
        const responses = []; // Store individual responses for each order

        // Inject extracted supplierId into each object
        for (const orderData of requestData) {
            orderData.supplierId = req.userId; // Assuming orderData is an object
            const response = await userHelper.orderListHelper(orderData);
            responses.push(response);
        }

        res.json({
            isSuccess: true,
            response: responses, // Send an array of responses
            error: false
        });
    } catch (error) {
        res.json({
            isSuccess: false,
            response: {},
            error: error.message
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
        const userType = req.body.userType;
        const storedOTP = req.session.otp;


        if (otp !== storedOTP) {
            return res.json({
                isSuccess: false,
                response: {},
                error: 'Invalid OTP',
            });
        }

        let userData;
        switch (userType) {
            case 'chef':
            case 'manager':
            case 'supplier':
            case 'cashier':
                userData = req.session.userObject;
                break;
            default:
                return res.json({
                    isSuccess: false,
                    response: {},
                    error: 'Invalid userType',
                });
        }

        let dbResponse;
        try {

            switch (userType) {
                case 'chef':

                    dbResponse = await chefDB.findOneAndUpdate({ email: userData.email }, { password: req.session.password });
                    break;
                case 'manager':
                    dbResponse = await managerDB.findOneAndUpdate({ email: userData.email }, { password: req.session.password });
                    break;
                case 'supplier':
                    dbResponse = await supplierDB.findOneAndUpdate({ email: userData.email }, { password: req.session.password });
                    break;
                case 'cashier':
                    dbResponse = await cashierDB.findOneAndUpdate({ email: userData.email }, { password: req.session.password });
                    break;
            }

            if (dbResponse) {
                return res.json({
                    isSuccess: true,
                    response: "passord updated successfully!",
                    error: null,
                });
            } else {
                return res.json({
                    isSuccess: false,
                    response: {},
                    error: 'Failed to update password in the database',
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