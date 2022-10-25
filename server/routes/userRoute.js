const router = require("express").Router();
const userController = require("../controller/userController.js");
const verifyRoles = require("../middleware/verifyRoles.js");
const verifyToken = require("../middleware/verifyToken.js");

router.route("/register").post(userController.creatUser);

router.route("/login").post(userController.loginUser);

router.route("/logout").get(userController.logoutUser);
//forgot password -> get reset Token

router.route("/password/forgot").post(userController.forgotPassword);
// reset password
router.route("/password/reset/:token").put(userController.resetPassword);

router
  .route("/me/update/infor")
  .put(verifyToken, userController.updateProfileUser);

router.route("/me/update").put(verifyToken, userController.updatePasswordUser);

router.route("/me").get(verifyToken, userController.getDetailsUser);

router
  .route("/admin/users")
  .get(verifyToken, verifyRoles("admin"), userController.getAllUsers);

router
  .route("/admin/users/stats")
  .get(verifyToken, verifyRoles("admin"), userController.getUsersStats);

router
  .route("/admin/users/:id")
  .get(verifyToken, verifyRoles("admin"), userController.getSingleUser)
  .put(verifyToken, verifyRoles("admin"), userController.changeUserRole)
  .delete(verifyToken, verifyRoles("admin"), userController.deleteUser);

module.exports = router;
