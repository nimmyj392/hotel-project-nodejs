const profileHelper = require("../helpers/profileHelper");
const profileDataValidator = require("../controllers/validator/profileValidator");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

module.exports = {

    uploadUserProfilePhoto: async (req, res) => {
        try {
            const profilePhoto = req.file;


            if (!profilePhoto || !profilePhoto.buffer) {
                return res.status(400).json({
                    isSuccess: false,
                    response: {},
                    error: 'Image file is missing in the request'
                });
            }


            const requestData = {

                userId: req.userId,

                deleted: false
            };

            const validatorResponse = await profileDataValidator.uploadProfilePhotoValidator(requestData);

            if (validatorResponse && validatorResponse.error) {
                res.json({
                    isSuccess: false,
                    response: {},
                    error: validatorResponse.error
                });
                return;
            } else if (validatorResponse && validatorResponse.value) {

                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto"
                    },
                    async (error, result) => {
                        if (error) {
                            console.error(error);
                            res.status(500).json({
                                isSuccess: false,
                                response: {},
                                error: 'Failed to upload image to Cloudinary'
                            });
                        } else {


                            requestData.profilePhoto = result.secure_url;

                            try {
                                const response = await profileHelper.uploadProfilePhotoHelper(requestData);

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
                            } catch (postHelperError) {
                                console.error(postHelperError);
                                res.status(500).json({
                                    isSuccess: false,
                                    response: {},
                                    error: 'Error in creating post'
                                });
                            }
                        }
                    }
                );

                // Pipe the image buffer to the Cloudinary upload stream
                streamifier.createReadStream(profilePhoto.buffer).pipe(stream);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                isSuccess: false,
                response: {},
                error: 'Internal Server Error'
            });
        }
    },
}

