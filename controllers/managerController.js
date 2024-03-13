const { model } = require("mongoose");
const managerHelper = require("../helpers/managerHelper");
const managerDataValidator = require("../controllers/validator/managerValidator");
const cashierDB = require("../models/userModels/cashierSchema")
const supplierDB = require("../models/userModels/supplierSchema")
const managerDB = require("../models/managerModels/managerSchema")
const chefDB = require("../models/userModels/chefSchema")


module.exports = {
    createManager: async (req, res) => {
        const requestData = {
            name: req.body.name,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            email: req.body.email,
            experience: req.body.experience,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            userType: req.body.userType,
            deleted: false
        };


        if (requestData.password !== requestData.confirmPassword) {
            return res.json({
                isSuccess: false,
                response: {},
                error: 'Passwords do not match',
            });
        }



        const validatorResponse = await managerDataValidator.createManagerValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        } else if (validatorResponse && validatorResponse.value) {
            managerHelper.createManagerHelper(requestData).then((response) => {

                if (response.success) {
                    res.json({
                        isSuccess: true,
                        response: response.data,
                        error: false
                    })
                } else {
                    res.json({
                        isSuccess: false,
                        response:{} ,
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
    },

    login: async (req, res) => {
        const requestData = {
            email: req.body.email,
            password: req.body.password,
            userType: req.body.userType
        };

        try {
            const validatorResponse = await managerDataValidator.loginValidator(requestData);
            if (validatorResponse && validatorResponse.error) {
                res.json({
                    isSuccess: false,
                    response: {},
                    error:validatorResponse.error
                });
            } else if (validatorResponse && validatorResponse.value) {
                managerHelper.loginHelper(requestData)
                    .then((response) => {

                        if (response) {
                            res.json({
                                isSuccess: true,
                                response: response.data,
                                error: false
                            });
                        } else {
                            res.json({
                                isSuccess: false,
                                response: {},
                                error: 'User not found'
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching user details:', error);
                        res.json({
                            isSuccess: false,
                            response: {},
                            error: error
                        });
                    });
            }
        } catch (error) {
            console.error('Error validating user:', error);
            res.json({
                isSuccess: false,
                response: {},
                error: error
            });
        }
    },

    createChef: async (req, res) => {
        const requestData = {
            name: req.body.name,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            email: req.body.email,
            experience: req.body.experience,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            userType: req.body.userType,
            deleted: false
        };


        if (requestData.password !== requestData.confirmPassword) {
            return res.json({
                isSuccess: false,
                response: {},
                error: 'Passwords do not match',
            });
        }



        const validatorResponse = await managerDataValidator.createChefValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        } else if (validatorResponse && validatorResponse.value) {
            managerHelper.createChefHelper(requestData).then((response) => {

                if (response.success) {
                    res.json({
                        isSuccess: true,
                        response: response.data,
                        error: false
                    })
                } else {
                    res.json({
                        isSuccess: false,
                        response:{} ,
                        error: response.data
                    })
                }
            }).catch((error) => {
                res.json({
                    isSuccess: false,
                    response:{} ,
                    error:error.data
                })


            })
        }
    },
    viewChef: (async (req, res) => {
        const requestData = {
            deleted: false

        }

        // const validatorResponse = await managerDataValidator.viewChefValidator(requestData);
        // if (validatorResponse && validatorResponse.error) {
        //     res.json({
        //         isSuccess: false,
        //         response: validatorResponse.error,
        //         error: true
        //     })
        // } else if (validatorResponse && validatorResponse.value) {
        managerHelper.viewChefHelper(requestData).then((response) => {

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
        }).catch((error) => {
            res.json({
                isSuccess: false,
                response:{} ,
                error: error.data
            })


        })

    }),
    createSupplier: async (req, res) => {
        const requestData = {
            name: req.body.name,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            email: req.body.email,
            experience: req.body.experience,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            userType: req.body.userType,
            deleted: false
        };


        if (requestData.password !== requestData.confirmPassword) {
            return res.json({
                isSuccess: false,
                response: {},
                error: 'Passwords do not match',
            });
        }



        const validatorResponse = await managerDataValidator.createSupplierValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response:{} ,
                error: validatorResponse.error
            })
        } else if (validatorResponse && validatorResponse.value) {
            managerHelper.createSupplierHelper(requestData).then((response) => {

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
    },

    viewSupplier: (async (req, res) => {
        const requestData = {
            deleted: false

        }

        // const validatorResponse = await managerDataValidator.viewChefValidator(requestData);
        // if (validatorResponse && validatorResponse.error) {
        //     res.json({
        //         isSuccess: false,
        //         response: validatorResponse.error,
        //         error: true
        //     })
        // } else if (validatorResponse && validatorResponse.value) {
        managerHelper.viewSupplierHelper(requestData).then((response) => {

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
        })

    }),
    createCashier: async (req, res) => {
        const requestData = {
            name: req.body.name,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            email: req.body.email,
            experience: req.body.experience,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            userType: req.body.userType,
            deleted: false
        };


        if (requestData.password !== requestData.confirmPassword) {
            return res.json({
                isSuccess: false,
                response: {},
                error: 'Passwords do not match',
            });
        }



        const validatorResponse = await managerDataValidator.createCashierValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        } else if (validatorResponse && validatorResponse.value) {
            managerHelper.createCashierHelper(requestData).then((response) => {

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
    },

    viewCashier: (async (req, res) => {
        const requestData = {
            deleted: false

        }

        // const validatorResponse = await managerDataValidator.viewChefValidator(requestData);
        // if (validatorResponse && validatorResponse.error) {
        //     res.json({
        //         isSuccess: false,
        //         response: validatorResponse.error,
        //         error: true
        //     })
        // } else if (validatorResponse && validatorResponse.value) {
        managerHelper.viewCashierHelper(requestData).then((response) => {

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
                error:error.data
            })


        })

    }),

    cashierEdit: (async (req, res) => {
        const requestData = {
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            experience: req.body.experience,
            password: req.body.password,
            name: req.body.name,

        }
        const validatorResponse = await managerDataValidator.cashierEditValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            managerHelper.cashierEditHelper(requestData).then((response) => {

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
                                           
    managerEdit: (async (req, res) => {
        const requestData = {
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            experience: req.body.experience,
            name: req.body.name,
        }
        const validatorResponse = await managerDataValidator.managerEditValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            managerHelper.managerEditHelper(requestData).then((response) => {

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
    chefEdit: (async (req, res) => {
        const requestData = {
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            experience: req.body.experience,
            password: req.body.password,
            name: req.body.name,
        }
        const validatorResponse = await managerDataValidator.chefEditValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            managerHelper.chefEditHelper(requestData).then((response) => {

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
    supplierEdit: (async (req, res) => {
        const requestData = {
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            experience: req.body.experience,
            password: req.body.password,
            name: req.body.name,

        }
        const validatorResponse = await managerDataValidator.supplierEditValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            managerHelper.supplierEditHelper(requestData).then((response) => {

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
    managerSoftDelete: (async (req, res) => {
        const requestData = {
            email: req.params.email
        }
        const validatorResponse = await managerDataValidator.managerSoftDeleteValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            managerHelper.managerSoftDeleteHelper(requestData).then((response) => {

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
                    response:{} ,
                    error: error.data
                })


            })
        }
    }),
    chefSoftDelete: (async (req, res) => {
        const requestData = {
            email: req.params.email
        }
        const validatorResponse = await managerDataValidator.chefSoftDeleteValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            managerHelper.chefSoftDeleteHelper(requestData).then((response) => {

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
    supplierSoftDelete: (async (req, res) => {
        const requestData = {
            email: req.params.email
        }
        const validatorResponse = await managerDataValidator.supplierSoftDeleteValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            managerHelper.supplierSoftDeleteHelper(requestData).then((response) => {

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
    cashierSoftDelete: (async (req, res) => {
        const requestData = {
            email: req.params.email
        }
        const validatorResponse = await managerDataValidator.cashierSoftDeleteValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            managerHelper.cashierSoftDeleteHelper(requestData).then((response) => {

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

    addPrice: (async (req, res) => {
        const requestData = {
            dishId: req.body.dishId,
            price: req.body.price
        }

        const validatorResponse = await managerDataValidator.addPriceValidator(requestData);

        if (validatorResponse && validatorResponse.error) {
            res.json({
                isSuccess: false,
                response: {},
                error: validatorResponse.error
            })
        }
        else if (validatorResponse && validatorResponse.value) {
            managerHelper.addPriceHelper(requestData).then((response) => {

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
                    error: error.data
                })


            })
        }
    }),
    viewTable: (async (req, res) => {

        const requestData = {
            deleted: false
        }

        managerHelper.viewTableHelper(requestData).then((response) => {

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
    orderList: async (req, res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date
    
        const requestData = {
            createdAt: {
                $gte: today, // Greater than or equal to today
                $lt: tomorrow // Less than tomorrow
            },
            deleted: false
        };
    
        try {
            const response = await managerHelper.orderListHelper(requestData);
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
                error: error.message // You might want to handle error.message instead of error.data
            });
        }
    },
    payments: (async (req, res) => {

        const requestData = {
            deleted: false
        }

        managerHelper.paymentHelper(requestData).then((response) => {

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


    }),

    viewTodaysMenu: async (req, res) => {
        try {
            // Get the current date
            const currentDate = new Date();
            // Set the start date to the beginning of the current day
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
            // Set the end date to the end of the current day
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    
            // Call viewTodaysMenuHelper with the start and end dates
            const response = await managerHelper.viewTodaysMenuHelper(startDate, endDate);
    
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
                error: error.message // Assuming error.message contains the error message
            });
        }
    },
}