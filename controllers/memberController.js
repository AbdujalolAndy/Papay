const memberController = module.exports;
const Member = require("../models/Member");

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    const member = new Member();
    const new_member = await member.signupData(data);

    res.send(new_member);
  } catch (err) {
    console.log("ERROR: cont/signup", err);
  }
};

memberController.login = (req, res) => {
  console.log("POST const.signup");
  res.send("Siz SignUp Page dasiz");
};

memberController.logout = (req, res) => {
  console.log("GET const.logout");
  res.send("Siz LogOut Page dasiz");
};
