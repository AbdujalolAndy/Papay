const memberController = module.exports;
const { HttpStatus } = require("../lib/config");
const Member = require("../models/Member");

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    const member = new Member();
    const new_member = await member.signupData(data);

    res.status(HttpStatus.CREATED).json({ state: "succeed", data: new_member });
  } catch (err) {
    console.log("ERROR: cont/signup", err);
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ state: "fail", message: err.message });
  }
};

memberController.login = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body;
    const member = new Member();
    const new_member = await member.loginData(data);

    res.status(HttpStatus.OK).json({ state: "succeed", data: new_member });
  } catch (err) {
    console.log("ERROR: cont/signup", err);
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ state: "fail", message: err.message });
  }
};

memberController.logout = (req, res) => {
  console.log("GET const.logout");
  res.status(HttpStatus.OK).send("Siz LogOut Page dasiz");
};
