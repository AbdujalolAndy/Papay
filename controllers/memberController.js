const memberController = module.exports;
const Member = require("../models/Member");

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    const member = new Member();
    const new_member = await member.signupData(data);

    res.json({ state: "succeed", data: new_member });
  } catch (err) {
    console.log("ERROR: cont/signup", err);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.login = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body;
    const member = new Member();
    const new_member = await member.loginData(data);

    res.json({ state: "succeed", data: new_member });
  } catch (err) {
    console.log("ERROR: cont/signup", err);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.logout = (req, res) => {
  console.log("GET const.logout");
  res.send("Siz LogOut Page dasiz");
};
