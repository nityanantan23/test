/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function(request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };
  const otp = request.query.otp;
  const arr = [];

  // If someone clicked the option for a random color it'll be passed in the querystring
  if (otp) {
    const fs = require("fs");
    const CryptoJS = require("crypto-js");

    const attendance = require("./src/packages/attendance");
    const account = require("./src/packages/account");

    (async () => {
      const raw = fs.readFileSync("credentials.json");
      const credentials = JSON.parse(raw);

      for (let i = 0; i < credentials.length; i++) {
        const { username, password } = credentials[i];
        // var encryptedAES = CryptoJS.AES.encrypt(username, process.env.SECRET);
        // console.log(encryptedAES.toString());
        const decryptedPassword = CryptoJS.AES.decrypt(
          password,
          process.env.SECRET
        );
        const plainPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
        console.log(plainPassword)
        const decryptedUsername = CryptoJS.AES.decrypt(
          username,
          process.env.SECRET
        );
        const plainUsername = decryptedUsername.toString(CryptoJS.enc.Utf8);
        console.log(plainUsername)

        const targetId = await account.tgt({
          plainUsername,
          plainPassword
        });
        console.log("Step 1: " + targetId);
        const serviceId = await account.st(targetId);

        console.log("Step 2: " + serviceId);

        const updateattend = await attendance.attend({ serviceId, otp });

        console.log("Step 3: " + updateattend.data);

        // The Handlebars code will be able to access the parameter values and build them into the page

        if (updateattend.data == null) {
          // msg.reply(updateattend.errors[0].message);
          params = {
            status: updateattend.errors[0].message
          };
          console.log("boom " + params.status);
          reply.view("/src/pages/index.hbs", params);
        } else {
          // msg.reply(
          //   `${updateattend.data.updateAttendance.id} attended ${updateattend.data.updateAttendance.classcode} on ${updateattend.data.updateAttendance.startTime}-${updateattend.data.updateAttendance.endTime}`
          // );
          params = {
            status: `${updateattend.data.updateAttendance.id} attended ${updateattend.data.updateAttendance.classcode} on ${updateattend.data.updateAttendance.startTime}-${updateattend.data.updateAttendance.endTime}`
          };
          console.log(
            `${updateattend.data.updateAttendance.id} attended ${updateattend.data.updateAttendance.classcode} on ${updateattend.data.updateAttendance.startTime}-${updateattend.data.updateAttendance.endTime}`
          );
          reply.view("/src/pages/index.hbs", params);
        }
      }
    })();
  }
  console.log("lol " + arr[0]);
  reply.view("/src/pages/index.hbs", arr[0]);
});

/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", function(request, reply) {
  // Build the params object to pass to the template
  let params = { seo: seo };
  // If the user submitted a color through the form it'll be passed here in the request body
  let color = request.body.color;

  // If it's not empty, let's try to find the color
  if (color) {
    // ADD CODE FROM TODO HERE TO SAVE SUBMITTED FAVORITES

    // Load our color data file
    const colors = require("./src/colors.json");

    // Take our form submission, remove whitespace, and convert to lowercase
    color = color.toLowerCase().replace(/\s/g, "");

    // Now we see if that color is a key in our colors object
    if (colors[color]) {
      // Found one!
      params = {
        color: colors[color],
        colorError: null,
        seo: seo
      };
    } else {
      // No luck! Return the user value as the error property
      params = {
        colorError: request.body.color,
        seo: seo
      };
    }
  }

  // The Handlebars template will use the parameter values to update the page with the chosen color
  reply.view("/src/pages/index.hbs", params);
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
