const express = require("express");
const { response } = require("../app");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken")
const managerController = require("../controllers/managerController")
const profileController = require("../controllers/profileController")
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/createManager",verifyToken.verifyToken("manager"), managerController.createManager)
router.patch("/managerEdit",verifyToken.verifyToken("manager"), managerController.managerEdit)
router.post('/uploadManagerProfilePhoto', verifyToken.verifyToken("manager"), upload.single('profilePhoto'), profileController.uploadUserProfilePhoto)
router.post("/createSubUsers", verifyToken.verifyToken("manager"), managerController.createManager)
// router.get("/viewSubUser", managerJwt.verifyToken,managerController.viewSubUser)
// router.patch("/editSubUser",managerJwt.verifyToken,managerController.editSubUser)
router.delete("/deleteSubUser/:email", verifyToken.verifyToken("manager"), managerController.managerSoftDelete)
router.post("/createChef",  verifyToken.verifyToken("manager"), upload.fields([]), managerController.createChef)
router.get("/viewChef", verifyToken.verifyToken("manager"), managerController.viewChef)
router.patch("/chefEdit",  verifyToken.verifyToken("manager"), managerController.chefEdit)
router.delete("/deleteChef/:email", verifyToken.verifyToken("manager"),  managerController.chefSoftDelete)
 router.post("/createSupplier",verifyToken.verifyToken("manager"), upload.fields([]), managerController.createSupplier)
router.get("/viewSupplier", verifyToken.verifyToken("manager"),  managerController.viewSupplier)
router.patch("/supplierEdit",verifyToken.verifyToken("manager"),  upload.fields([]), managerController.supplierEdit)
router.delete("/deleteSupplier/:email", verifyToken.verifyToken("manager"),  managerController.supplierSoftDelete)
router.post("/createCashier", verifyToken.verifyToken("manager"),  upload.fields([]), managerController.createCashier)
router.get("/viewCashier",verifyToken.verifyToken("manager"), managerController.viewCashier)
router.patch("/cashierEdit", verifyToken.verifyToken("manager"),  managerController.cashierEdit)
router.delete("/deleteCashier/:email", verifyToken.verifyToken("manager"), managerController.cashierSoftDelete)
router.post("/addPrice", verifyToken.verifyToken("manager"),  managerController.addPrice)
router.get("/viewTable",verifyToken.verifyToken("manager"), managerController.viewTable)
router.get("/orderList",verifyToken.verifyToken("manager"), managerController.orderList)
router.get("/payments",verifyToken.verifyToken("manager"), managerController.payments)
router.get("/viewTodaysMenu",verifyToken.verifyToken("manager"), managerController.viewTodaysMenu)
module.exports = router



