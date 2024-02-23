const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const jwt = require("jsonwebtoken");
const Manager = require("../models/managerModels/managerSchema");
const Chef = require("../models/userModels/chefSchema");
const Cashier = require("../models/userModels/cashierSchema");
const Supplier = require("../models/userModels/supplierSchema");

module.exports = {
    verifyToken: (role) => {
        return async (req, res, next) => {
            const clientToken = req.headers['authorization'];

            if (!clientToken) {
               const response = {
                    isSuccess: false,
                    response: {},
                    error: "No token provided"
                };
                resolve(response)
            }
            const sessionToken = req.session.token;
            if (!req.session || !req.session.token || req.session.token !== clientToken) {
                const response = {
                    isSuccess: false,
                    response: {},
                    error: "Invalid token"
                };
                resolve(response)
                    }
            try {
                let secretKey;
                switch (role) {
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

                const decoded = jwt.verify(clientToken, secretKey);

                req.userId = decoded.userId;
                req.userType = decoded.userType
                

                next();
            } catch (err) {
                const response = {
                    isSuccess: false,
                    response: {},
                    error: "error in verification"
                };
                resolve(response)
            }
        }
    }
}