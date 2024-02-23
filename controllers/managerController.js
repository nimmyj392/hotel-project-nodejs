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
      
       if(validatorResponse && validatorResponse.error){
        res.json({
            isSuccess: false,
            response: validatorResponse.error,
            error : true
        })
       }else if (validatorResponse && validatorResponse.value){
        managerHelper.createManagerHelper(requestData).then((response)=>{
            
            if(response.success){
                res.json({
                    isSuccess: true,
                    response: response.data,
                    error : false
                })
            }else{
                res.json({
                    isSuccess: false,
                    response: response.data,
                    error : true
                })
            }
        }).catch((error)=>{
            res.json({
             isSuccess: false,
             response: error.data,
             error:true
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
              response: validatorResponse.error,
              error: true
            });
          } else if (validatorResponse && validatorResponse.value) {
            managerHelper.loginHelper(requestData)
              .then((response) => {
                req.session.token=response.data.tokens[response.data.tokens.length-1]

                if (response) {
                  res.json({
                    isSuccess: true,
                    response: response,
                    error: false
                  });
                } else {
                  res.json({
                    isSuccess: false,
                    response: 'User not found', 
                    error: true
                  });
                }
              })
              .catch(error => {
                console.error('Error fetching user details:', error);
                res.json({
                  isSuccess: false,
                  response: error,
                  error: true
                });
              });
          }
        } catch (error) {
          console.error('Error validating user:', error);
          res.json({
            isSuccess: false,
            response: error,
            error: true
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

      

       const validatorResponse = await managerValidator.createChefValidator(requestData);
      
       if(validatorResponse && validatorResponse.error){
        res.json({
            isSuccess: false,
            response: validatorResponse.error,
            error : true
        })
       }else if (validatorResponse && validatorResponse.value){
        managerHelper.createChefHelper(requestData).then((response)=>{
            
            if(response.success){
                res.json({
                    isSuccess: true,
                    response: response.data,
                    error : false
                })
            }else{
                res.json({
                    isSuccess: false,
                    response: response.data,
                    error : true
                })
            }
        }).catch((error)=>{
            res.json({
             isSuccess: false,
             response: error.data,
             error:true
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
                    response: response.data,
                    error: true
                })
            }
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
      
       if(validatorResponse && validatorResponse.error){
        res.json({
            isSuccess: false,
            response: validatorResponse.error,
            error : true
        })
       }else if (validatorResponse && validatorResponse.value){
        managerHelper.createSupplierHelper(requestData).then((response)=>{
            
            if(response.success){
                res.json({
                    isSuccess: true,
                    response: response.data,
                    error : false
                })
            }else{
                res.json({
                    isSuccess: false,
                    response: response.data,
                    error : true
                })
            }
        }).catch((error)=>{
            res.json({
             isSuccess: false,
             response: error.data,
             error:true
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
                    response: response.data,
                    error: true
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
      
       if(validatorResponse && validatorResponse.error){
        res.json({
            isSuccess: false,
            response: validatorResponse.error,
            error : true
        })
       }else if (validatorResponse && validatorResponse.value){
        managerHelper.createCashierHelper(requestData).then((response)=>{
            
            if(response.success){
                res.json({
                    isSuccess: true,
                    response: response.data,
                    error : false
                })
            }else{
                res.json({
                    isSuccess: false,
                    response: response.data,
                    error : true
                })
            }
        }).catch((error)=>{
            res.json({
             isSuccess: false,
             response: error.data,
             error:true
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
                    response: response.data,
                    error: true
                })
            }
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
            password: req.body.password,
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
            managerHelper. addPriceHelper (requestData).then((response) => {

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
                    response: response.data,
                    error: error.data
                })


            })
        }
    }),
    viewTable: (async (req, res) => {

        const requestData = {
            deleted:false
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
    orderList: (async (req, res) => {

        const requestData = {
            deleted:false
        }
       
            managerHelper.orderListHelper(requestData).then((response) => {

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
    payments: (async (req, res) => {

        const requestData = {
            deleted:false
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
            })
         
        
    }),
}