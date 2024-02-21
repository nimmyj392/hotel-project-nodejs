const Joi = require("joi")

function uploadProfilePhotoValidator(requestData) {

    try {
        const schema = Joi.object().keys({

            userId: Joi.string().length(24).hex(),

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

module.exports = {
    uploadProfilePhotoValidator
}