const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.renderEditCampgroundForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
};

module.exports.renderCampgroundShowPage = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: "author" })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campgorund");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.createNewCampground = async (req, res, next) => {
  const newCampground = new Campground(req.body.campground);
  newCampground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  newCampground.author = req.user._id;
  await newCampground.save();
  console.log(newCampground);
  req.flash("success", "Successfully made new campground!");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.images.push(...images);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  console.log(req.body.deleteImages);
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
