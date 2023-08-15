const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createNewCampground)
  );
// .post(upload.array("image"), (req, res) => {
//   console.log(req.body, req.files);
//   res.send("worked?");
// });

router.get("/new", isLoggedIn, campgrounds.renderNewCampgroundForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.renderCampgroundShowPage))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditCampgroundForm)
);

module.exports = router;
