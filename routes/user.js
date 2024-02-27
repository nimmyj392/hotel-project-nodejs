const express = require("express");
const { response } = require("../app");
const router = express.Router();
const userController = require("../controllers/userController")
const managerController = require("../controllers/managerController")
const verifyToken = require("../middlewares/verifyToken")
const profileController = require("../controllers/profileController")
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/login", managerController.login)
router.post("/addFoodByChef", verifyToken.verifyToken("chef"),upload.fields([]),userController.addFoodByChef)
router.get("/getMyDishes", verifyToken.verifyToken("chef"),userController.getMyDishes)
router.post("/editMyDishes", verifyToken.verifyToken("chef"),userController.editMyDish)
router.delete("/deleteFoodByChef", verifyToken.verifyToken("chef"),userController.deleteFoodByChef)
router.get("/dailyDish", verifyToken.verifyToken("chef"),userController.dailyDish)
router.post("/addToday'sMenu",userController.addTodaysMenu)
router.delete("/deleteMenuItem",verifyToken.verifyToken("chef"),userController.deleteMenuItem)
// router.post('/uploadEmployeeProfilePhoto', userJwt.verifyToken, upload.single('profilePhoto'), profileController.uploadUserProfilePhoto)
router.post("/addTable",verifyToken.verifyToken("supplier"),upload.fields([]),userController.addTable)
router.post("/viewTable",verifyToken.verifyToken("supplier"),userController.viewTable)
router.post("/selectOrDeselectTable",verifyToken.verifyToken("supplier"),userController.selectOrDeselectTable)
router.post("/viewToday'sMenu",verifyToken.verifyToken("supplier"),userController.viewTodaysMenu)
router.post("/orderList",verifyToken.verifyToken("supplier"),userController.orderList)
router.get("/getAllOrdersForChef",verifyToken.verifyToken("chef"),userController.getAllOrdersForChef)
router.post("/updateStatusByChef",verifyToken.verifyToken("chef"),userController.updateStatusByChef)
router.get("/viewOrdersServed",verifyToken.verifyToken("cashier"),userController.viewOrdersServed)
router.get("/viewOrdersPending",verifyToken.verifyToken("supplier"),userController.viewOrdersPending)
router.post("/calculateBill",verifyToken.verifyToken("cashier"),userController.calculateBill)
router.post("/collectPaymentInCash",verifyToken.verifyToken("cashier"),userController.collectPaymentInCash)
router.post("/cancelOrder",verifyToken.verifyToken("supplier"),userController.cancelOrder)
router.post("/forgotPassword",verifyToken.verifyToken("manager"),userController.forgotPassword) 
router.post("/verifyOTPAndStoreUser",verifyToken.verifyToken("manager"),userController.verifyOTPAndStoreUser)
router.delete("/logOut",verifyToken.verifyToken(),userController.logOut)
module.exports = router
