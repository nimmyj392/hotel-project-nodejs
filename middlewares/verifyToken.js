const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports = {
    verifyToken: (role) => {
        return async (req, res, next) => {
            const clientToken = req.headers['authorization'];

            if (!clientToken) {
                return res.status(401).json({
                    isSuccess: false,
                    response: {},
                    error: "No token provided"
                });
            }

            try {
                let secretKey;
                let User;
                switch (role) {
                    case 'manager':
                        secretKey = process.env.MANAGER_SECRET_KEY;
                        User = require("../models/managerModels/managerSchema")
                        break;
                    case 'chef':
                        secretKey = process.env.CHEF_SECRET_KEY;
                        User = require("../models/userModels/chefSchema");
                        break;
                    case 'cashier':
                        secretKey = process.env.CASHIER_SECRET_KEY;
                        User = require("../models/userModels/cashierSchema");
                        break;
                    case 'supplier':
                        secretKey = process.env.SUPPLIER_SECRET_KEY;
                        User = require("../models/userModels/supplierSchema")
                        break;
                    default:
                        return res.status(401).json({
                            isSuccess: false,
                            response: {},
                            error: "Invalid user role"
                        });
                }

                const decoded = jwt.verify(clientToken, secretKey);


                const user = await User.findOne({ _id: decoded.userId });

                if (!user) {
                    return res.status(401).json({
                        isSuccess: false,
                        response: {},
                        error: "User not found"
                    });
                }

                const latestTokenFromDatabase = user.tokens[user.tokens.length - 1];

                if (clientToken !== latestTokenFromDatabase) {
                    return res.status(401).json({
                        isSuccess: false,
                        response: {},
                        error: "Invalid token"
                    });
                }

                req.userId = decoded.userId;
                req.userType = decoded.userType;

                next();
            } catch (err) {
                console.error('Error in token verification:', err);
                return res.status(401).json({
                    isSuccess: false,
                    response: {},
                    error: "Error in token verification"
                });
            }
        };
    }
};
