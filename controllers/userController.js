const { model } = require("mongoose");
const userHelper = require("../helpers/userHelper");
const userDataValidator = require("../controllers/validator/userValidator");
// const userDB = require("../models/userModels/userSchema")



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
                        response: response.data,
                        error: true
                    })
                }
            })
        }


    }),


    getMyDishes: (async (req, res) => {
        const requestData = {
            preparedBy: req.userId

        }

        // const validatorResponse = await managerDataValidator.viewChefValidator(requestData);
        // if (validatorResponse && validatorResponse.error) {
        //     res.json({
        //         isSuccess: false,
        //         response: validatorResponse.error,
        //         error: true
        //     })
        // } else if (validatorResponse && validatorResponse.value) {
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
                        response: response.data,
                        error: true
                    })
                }
            }).catch(error => {
                console.error('Error fetching dish', error);
                res.json({
                    isSuccess: false,
                    response: error,
                    error: true
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
        const requestData = {
            foodId: req.body.foodId,
            category: req.body.category,
            stock: req.body.stock,
            preparedBy: req.userId
        }
        const validatorResponse = await userDataValidator.addTodaysMenuValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            userHelper.addTodaysMenuHelper(requestData).then((response) => {

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
        }
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
            })
        }
    }),

    addTable: (async (req, res) => {
        const requestData = {
            name: req.body.name,
            status: req.body.status,
            deleted:false
        }

        const validatorResponse = await userDataValidator.addTableValidator(requestData);
        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: validatorResponse.error,
                error: true
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
                        response: response.data,
                        error: true
                    })
                }
            })
        }


    }),

    viewTable: (async (req, res) => {

        const requestData = {
            deleted:false
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
                response: validatorResponse.error,
                error: true
            })
        } else if (validatorResponse && validatorResponse.value) {
            userHelper. selectOrDeselectTableHelper(requestData).then((response) => {

                if (response) {
                    res.json({

                        isSuccess: true,
                        response: response,
                        error: false
                    })
                } else {

                    res.json({
                        isSuccess: false,
                        response: response.data,
                        error: true
                    })
                }
            })
        }


    }),

    viewTodaysMenu: (async (req, res) => {

        const requestData = {
            deleted:false
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
            })
         
        
    }),
    orderList: (async (req, res) => {
        const requestData = {
            tableId: req.body.tableId,
            foodId: req.body.foodId,
            supplierId: req.userId,
            quantity: req.body.quantity
        }

        const validatorResponse = await userDataValidator.orderListValidator(requestData);
        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: validatorResponse.error,
                error: true
            })
        } else if (validatorResponse && validatorResponse.value) {
            userHelper.orderListHelper(requestData).then((response) => {

                if (response) {
                    res.json({

                        isSuccess: true,
                        response: response,
                        error: false
                    })
                } else {

                    res.json({
                        isSuccess: false,
                        response: response.data,
                        error: true
                    })
                }
            })
        }


    }),

    getAllOrdersForChef: (async (req, res) => {

        const requestData = {
            deleted:false
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
            })
         
        
    }),

     
    updateStatusByChef: (async (req, res) => {
        
            const requestData = {
                orderId: req.body.orderId,
                status: req.body.status,
                preparationTime: req.body.preparationTime 
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
        userHelper. viewOrdersServedHelper(requestData)
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
                        response: response.data,
                        error: true
                    })
                }
            }).catch(error => {
                console.error('Error fetching dish', error);
                res.json({
                    isSuccess: false,
                    response: error,
                    error: true
                });
            });

    }),
    viewOrdersPending: (async (req, res) => {
        

        userHelper. viewOrdersPendingHelper()
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
                        response: response.data,
                        error: true
                    })
                }
            }).catch(error => {
                console.error('Error fetching dish', error);
                res.json({
                    isSuccess: false,
                    response: error,
                    error: true
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
        userHelper. calculateBillHelper()
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
                        response: response.data,
                        error: true
                    })
                }
            }).catch(error => {
                console.error('Error fetching dish', error);
                res.json({
                    isSuccess: false,
                    response: error,
                    error: true
                });
            });

 
}),
collectPaymentInCash: (async (req, res) => {
    
    userHelper. collectPaymentInCashHelper()
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
                    response: response.data,
                    error: true
                })
            }
        }).catch(error => {
            console.error('Error fetching dish', error);
            res.json({
                isSuccess: false,
                response: error,
                error: true
            });
        });


}),
forgotPassword: (async (req, res) => {
        
    const requestData = {
        email: req.body.email,
        newPassword: req.body.newPassword
    };

const validatorResponse = await userDataValidator.forgotPasswordValidator(requestData);

if (validatorResponse && validatorResponse.error) {
    res.json({
        isSuccess: false,
        response: {},
        error: validatorResponse.error
    })
}
else if (validatorResponse && validatorResponse.value) {
    userHelper.forgotPasswordHelper(requestData).then((response) => {

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
}
}),

 
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
        })
    }
}),
}