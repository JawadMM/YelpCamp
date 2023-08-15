const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const images = require("./images");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomItem = (array) => Math.floor(Math.random() * array.length);
    const randomPrice = Math.floor(Math.random() * 30);

    const camp = new Campground({
      author: "64d7821b6967bcb46fa5730e",
      location: `${cities[randomItem(cities)].city}, ${
        cities[randomItem(cities)].state
      }`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images:  [
        {
          url: 'https://res.cloudinary.com/doixzlwq0/image/upload/v1692106612/YelpCamp/xyessiilunpq2e1pcx4w.jpg',
          filename: 'YelpCamp/xyessiilunpq2e1pcx4w',
        },
        {
          url: 'https://res.cloudinary.com/doixzlwq0/image/upload/v1692106614/YelpCamp/d9scyuymy7pzgvwoch5x.jpg',
          filename: 'YelpCamp/d9scyuymy7pzgvwoch5x',
        }
      ],
      description:
        "Velit est excepteur excepteur eiusmod consequat ea ipsum mollit occaecat ex sint in minim quis. Est ipsum enim do pariatur do aliquip cupidatat. Quis esse Lorem consectetur eiusmod nisi occaecat dolor dolor do. Est elit velit culpa ex occaecat in ut. Dolor duis mollit consequat culpa voluptate. Sit consequat eu exercitation eiusmod adipisicing amet.",
      price: randomPrice,
    });

    await camp.save();
  }
};

seedDB();
