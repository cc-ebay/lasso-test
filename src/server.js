import express from "express";
import { configure } from "lasso";
import { serveStatic } from "lasso/middleware";
import markoMiddleware from "@marko/express";
import homePage from "./pages/home";
import homePage2 from "./pages/home2";

// Configure lasso to control how JS/CSS/etc. is delivered to the browser
const isProduction = process.env.NODE_ENV === "production";
configure({
  plugins: [
    "lasso-marko" // Allow Marko templates to be compiled and transported to the browser
  ],
  "require": {
      "transforms": [{
          "transform": "lasso-babel-transform",
          "config": {
              "extensions": [
                  ".js",
                  ".es6",
                  ".marko"
              ],
              "babelOptions": require('../babel.config.js')()
          }
      }]
  },
  minify: isProduction, // Only minify JS and CSS code in production
  bundlingEnabled: isProduction, // Only enable bundling in production
  fingerprintsEnabled: isProduction // Only add fingerprints to URLs in production
});

express()
  .use(markoMiddleware()) // Enables res.marko
  .use(serveStatic()) // Serve static assets with lasso
  .get("/", homePage) // Setup the route for our home page handler
  .get("/2", homePage2) // Setup the route for our home page handler
  .listen(process.env.PORT || 8080, function () {
    console.log(
      "Server started! Try it out:\nhttp://localhost:" +
        this.address().port +
        "/"
    );

    if (process.send) {
      process.send("online");
    }
  });
