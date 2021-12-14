const fs = require("fs");
const attendance = require("./packages/attendance");
const account = require("./packages/account");

(async () => {
  const raw = fs.readFileSync("credentials.json");
  const credentials = JSON.parse(raw);

  const otp = msg.body.slice(msg.body.length - 3);
  for (let i = 0; i < credentials.length; i++) {
    const { username, password } = credentials[i];

    const targetId = await account.tgt({
      username,
      password,
    });
    console.log("Step 1: " + targetId);
    const serviceId = await account.st(targetId);

    console.log("Step 2: " + serviceId);

    const updateattend = await attendance.attend({ serviceId, otp });

    console.log("Step 3: " + updateattend);

    console.log(updateattend);

    if (updateattend.data == null) {
      console.log(updateattend);
    } else {
      console.log(
        `${updateattend.data.updateAttendance.id} attended ${updateattend.data.updateAttendance.classcode} on ${updateattend.data.updateAttendance.startTime}-${updateattend.data.updateAttendance.endTime}`
      );
    }
  }
})();
