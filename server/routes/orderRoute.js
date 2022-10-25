const router = require("express").Router();
const orderController = require("../controller/orderController.js");
const verifyRoles = require("../middleware/verifyRoles.js");
const verifyToken = require("../middleware/verifyToken.js");

router.route("/order/new").post(verifyToken, orderController.creteOrder);

router.route("/orders/me").get(verifyToken, orderController.getAllOrders);

router.route("/order/:id").get(verifyToken, orderController.getSingleOrder);

router
  .route("/admin/orders")
  .get(verifyToken, verifyRoles("admin"), orderController.getAminAllOrder);

router
  .route("/admin/order/:id")
  .put(verifyToken, verifyRoles("admin"), orderController.updateAdminOrder)
  .delete(verifyToken, verifyRoles("admin"), orderController.deleteAdminOrder);

module.exports = router;
