const jwt = require("jsonwebtoken");

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

            // Check if the token stored in session matches the token from the client
            const sessionToken = req.session.token;
            if (!sessionToken || sessionToken !== clientToken) {
                return res.status(401).json({
                    isSuccess: false,
                    response: {},
                    error: "Invalid token"
                });
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
                req.userType = decoded.userType;

                next(); // Call next to pass control to the next middleware/route handler
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
