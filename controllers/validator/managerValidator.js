const Joi = require("joi")

function createManagerValidator(requestData) {
    try {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
            experience: Joi.string().required(),
            email: Joi.string().required().email(),
            gender: Joi.string().required().valid('male', 'female'),
            phoneNumber: Joi.string().required(),
            userType: Joi.string().required(),
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
        console.log(exception);
    }
}

function loginValidator(requestData) {

    try {
        const schema = Joi.object().keys({

            email: Joi.string().required().email(),
            password: Joi.string().required(),
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

    } catch (exception) { }
}
async function managerEditValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            email: Joi.string().required(),
            phoneNumber: Joi.string(),
            experience: Joi.string(),
            name: Joi.string(),
            password: Joi.string(),
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

function createChefValidator(requestData) {
    console.log(requestData)
    try {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
            experience: Joi.string().required(),
            email: Joi.string().required().email(),
            gender: Joi.string().required().valid('male', 'female'),
            phoneNumber: Joi.string().required(),
            userType: Joi.string().required(),
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
        console.log(exception);
    }
}


async function chefEditValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            email: Joi.string().required(),
            phoneNumber: Joi.string(),
            experience: Joi.string(),
            name: Joi.string(),
            password: Joi.string(),
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

function createSupplierValidator(requestData) {
    try {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
            experience: Joi.string().required(),
            email: Joi.string().required().email(),
            gender: Joi.string().required().valid('male', 'female'),
            phoneNumber: Joi.string().required(),
            userType: Joi.string().required(),
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
        console.log(exception);
    }
}

async function supplierEditValidator(requestData) {

    try {

        const schema = Joi.object().keys({
            email: Joi.string(),
            phoneNumber: Joi.string(),
            experience: Joi.string(),
            name: Joi.string(),
            password: Joi.string(),
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

function createCashierValidator(requestData) {
    try {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
            experience: Joi.string().required(),
            email: Joi.string().required().email(),
            gender: Joi.string().required().valid('male', 'female'),
            phoneNumber: Joi.string().required(),
            userType: Joi.string().required(),
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
        console.log(exception);
    }
}

async function cashierEditValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            email: Joi.string().required(),
            phoneNumber: Joi.string(),
            experience: Joi.string(),
            name: Joi.string(),
            password: Joi.string(),
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
function managerSoftDeleteValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            email: Joi.string().required()
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
function cashierSoftDeleteValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            email: Joi.string().required()
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
function chefSoftDeleteValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            email: Joi.string().required()
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
function supplierSoftDeleteValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            email: Joi.string().required()
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

function addPriceValidator(requestData) {

    try {
        const schema = Joi.object().keys({
            dishId: Joi.string().required(),
            price: Joi.number().required(),
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

    createManagerValidator,
    loginValidator,
    createSupplierValidator,
    createCashierValidator,
    createChefValidator,
    cashierEditValidator,
    chefEditValidator,
    supplierEditValidator,
    managerEditValidator,
    supplierSoftDeleteValidator,
    chefSoftDeleteValidator,
    cashierSoftDeleteValidator,
    managerSoftDeleteValidator,
    addPriceValidator
}