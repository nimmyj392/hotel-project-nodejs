const Joi = require("joi")

function addFoodByChefValidator(requestData) {

    try {
        const schema = Joi.object().keys({

            name: Joi.string().required(),
            description: Joi.string().required(),
            category: Joi.string().required(),
            preparedBy: Joi.string().length(24).hex()
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) { }
}
function editTodaysMenuValidator(requestData) {

    try {
        const schema = Joi.object().keys({

            name: Joi.string().required(),
            menuId: Joi.string().required(),
            stock: Joi.number().required()
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) { }
}
function deleteFoodByChefValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            dishId: Joi.string().length(24).hex().required(),
            preparedBy: Joi.string().length(24).hex()
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) {

    }
}
async function editMyDishValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            dishId: Joi.string().length(24).hex(),
            name: Joi.string(),
            description: Joi.string(),
            preparedBy: Joi.string().length(24).hex()
        })

        const { error, value } = await schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) { }
}

// function addTodaysMenuValidator(requestData) {
//     try {
//         console.log("stated validation")
//         const schema = Joi.object().keys({
//             foodId: Joi.string().required(),
//             category: Joi.string().required(),
//             stock: Joi.number().required(),
//             preparedBy: Joi.string()
//         })

//         const { error, value } = schema.validate(requestData);
// consolel.log("Proxy ERROR",error)
//         if (error) {
//             return { error: error.details.map((x) => x.message).join(", ") };
//         } else if (value) {
//             return { value: value };
//         } else {
//             return { error: "something went wrong!!" }
//         }

//     } catch (exception) {

//     }
// }

function addTableValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            status: Joi.string(),
            deleted: Joi.boolean()
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) {

    }
}
function selectOrDeselectTableValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            tableId: Joi.string().length(24).hex().required(),
            status: Joi.string().required()
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) {

    }
}

// function orderListValidator(requestData) {

//     try {
//         const schema = Joi.object().keys({

//             tableId: Joi.string().length(24).hex().required(),
//             foodId: Joi.string().length(24).hex().required(),
//             quantity: Joi.number().required(),
//             supplierId: Joi.string().length(24).hex()
//         })

//         const { error, value } = schema.validate(requestData);

//         if (error) {
//             return { error: error.details.map((x) => x.message).join(", ") };
//         } else if (value) {
//             return { value: value };
//         } else {
//             return { error: "something went wrong!!" }
//         }

//     } catch (exception) { }
// }

function updateStatusByChefValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            orderId: Joi.string().length(24).hex().required(),
            status: Joi.string().required()
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) {

    }
}

function calculateBillValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            orderId: Joi.string().length(24).hex().required()
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) {

    }
}

function forgotPasswordValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            email: Joi.string().required(),
           
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) {

    }
}
function    verifyOTPAndStoreUserValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            email: Joi.string().required(),
            otp: Joi.string().required(),
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) {

    }
}
function    storeNewPasswordValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            email: Joi.string().required(),
            otp: Joi.string().required(),
            newPassword: Joi.string().required(),
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) {

    }
}

function cancelOrderValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            dishId: Joi.string().length(24).hex().required(),
            preparedBy: Joi.string().length(24).hex()
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) {

    }
}
function logOutValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            userType: Joi.string().required()
            
        })

        const { error, value } = schema.validate(requestData);

        if (error) {
            return { error: error.details.map((x) => x.message).join(", ") };
        } else if (value) {
            return { value: value };
        } else {
            return { error: "something went wrong!!" }
        }

    } catch (exception) {

    }
}
module.exports = {
    addFoodByChefValidator,
    deleteFoodByChefValidator,
    editMyDishValidator,
    // addTodaysMenuValidator,
    addTableValidator,
    selectOrDeselectTableValidator,
    // orderListValidator,
    updateStatusByChefValidator,
    logOutValidator,
    //    calculateBillValidator
    forgotPasswordValidator,
    cancelOrderValidator,
    verifyOTPAndStoreUserValidator,
    storeNewPasswordValidator,
    editTodaysMenuValidator
}