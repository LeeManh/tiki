const router = require("express").Router();
const productController = require("../controller/productController.js");
const verifyRoles = require("../middleware/verifyRoles.js");
const verifyToken = require("../middleware/verifyToken.js");

router.get("/products", productController.getAllProducts);

router.post(
  "/products/new",
  verifyToken,
  verifyRoles("admin"),
  productController.creatProduct //create
);

router
  .route("/products/:id")
  .delete(verifyToken, verifyRoles("admin"), productController.deleteProduct) //delete
  .put(verifyToken, verifyRoles("admin"), productController.updateProduct) //update
  .get(productController.getDetailsProduct);

router
  .route("/reviews")
  .post(verifyToken, productController.createProductReview)
  .get(productController.getAllReviewOfSingleProduct)
  .delete(
    verifyToken,
    verifyRoles("admin"),
    productController.deleteSingleReview
  );

module.exports = router;
