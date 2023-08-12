const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: "author" })
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find that campgorund");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Successfully made new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
