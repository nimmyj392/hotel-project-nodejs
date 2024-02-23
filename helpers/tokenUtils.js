const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const jwt = require("jsonwebtoken");
const session = require("express-session");

function generateToken(user, userRole) {

    let secretKey;
    switch (userRole) {
        case 'manager':
            secretKey = process.env.MANAGER_SECRET_KEY;
            break;
        case 'chef':
            secretKey = process.env.CHEF_SECRET_KEY;
            break;
        case 'cashier':
            secretKey = process.env.CASHIER_SECRET_KEY;
            break;
        case 'supplier':
            secretKey = process.env.SUPPLIER_SECRET_KEY;
            break;
        default:

            return res.status(401).json({
                isSuccess: false,
                response: {},
                error: "Invalid user role"
            });
    }


    const payload = {
        email: user.email,
        userId: user._id,
        userType: user.userType
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '48h' });
    req.session.token = token
    return token;
}

module.exports = generateToken;
