import express from "express"
import { addAddress, deleteAddress, deleteProfileImage, getAllAddresses, getUserById, handleToggleStatus, logout, updateAddress, updateDetails } from "../controllers/user.controller.js";
import { validate } from '../middlewares/validate.js'
import { addAddressValidator, deleteAddressValidator, updateAddressValidator, updateDetailsValidator } from "../validators/user.validator.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ dest: "uploads/" })


router.post("/logout", logout)
router.get("/getUser", getUserById)
router.patch("/updateDetails", upload.single('image'), validate(updateDetailsValidator), updateDetails)
router.post("/addAddress", validate(addAddressValidator), addAddress)
router.put("/updateAddress/:addressId", validate(updateAddressValidator), updateAddress)
router.delete("/deleteAddress/:addressId", validate(deleteAddressValidator), deleteAddress)
router.get("/getAllAddresses", getAllAddresses)
router.delete("/deleteProfileImage", deleteProfileImage)
router.patch("/toggleStatus/:id", handleToggleStatus)
//todo: update role route

export default router