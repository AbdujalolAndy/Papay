const memberController = module.exports;
const assert = require("assert");
const { HttpStatus } = require("../lib/config");
const Member = require("../models/Member");
const jwt = require("jsonwebtoken");
const Definer = require("../lib/mistakes");

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    const member = new Member();
    const new_member = await member.signupData(data);
    const token = await memberController.createToken(new_member);
    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: true,
    });
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
    const result = await member.loginData(data);

    const token = await memberController.createToken(result);
    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: true,
    });

    res.status(HttpStatus.OK).json({ state: "succeed", data: result });
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

memberController.createToken = async (result) => {
  try {
    const upload_data = {
      _id: result._id,
      mb_nick: result.mb_nick,
      mb_type: result.mb_type,
    };
    const token = jwt.sign(upload_data, process.env.SECRET_TOKEN, {
      expiresIn: "6h",
    });
    console.log("token::", token);
    assert.ok(token, Definer.auth_err2);
    return token;
  } catch (err) {
    throw err;
  }
};

memberController.checkAuthentication = async (req, res) => {
  try {
    console.log("cont/checkAuthentication");
    let token = req.cookies.access_token;

    const member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
    assert.ok(member, Definer.auth_err2);

    res.status(HttpStatus.OK).json({ state: "success", data: member });
  } catch (err) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ state: "fail", message: err.message });
  }
};