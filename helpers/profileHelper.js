// const userDB = require("../models/userModels/userSchema")
const profileDB = require("../models/profileModels/profileSchema")


module.exports = {
    uploadProfilePhotoHelper: (requestData) => {
        return new Promise(async (resolve, reject) => {


            const insertData = {
                userId: requestData.userId,
                profilePhoto: requestData.profilePhoto
            };

            const user = await userDB.findById(insertData.userId);


            if (!user) {
                const response = {
                    success: false,
                    data: "user not found,please register "
                };
                resolve(response);

            }
            if (!user || !user._id || !requestData.userId) {
                const response = {
                    success: false,
                    data: "Invalid user or userId"
                };
                resolve(response);
                return;
            }
            if (user._id.toString() !== requestData.userId.toString()) {
                const response = {
                    success: false,
                    data: "unauthorized - you can only add your own  profile photo"
                };
                resolve(response);
                return;
            }

            const dbResponse = await profileDB.insertMany(insertData)

            if (dbResponse.length > 0) {

                const response = {
                    success: true,
                    data: dbResponse
                }
                resolve(response)
            } else {
                const response = {
                    success: false,
                    data: dbResponse
                }
                resolve(response)
            }

        }).catch((err) => {
            console.log(err);
        })
    }
}