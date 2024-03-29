const memberController = module.exports;
const assert = require("assert");
const Member = require("../models/Member");
const jwt = require("jsonwebtoken");
const Definer = require("../lib/mistakes");

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body,
      member = new Member(),
      new_member = await member.signupData(data),
      token = await memberController.createToken(new_member);
    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: false,
    });
    res.json({ state: "success", data: new_member });
  } catch (err) {
    console.log("ERROR: cont/signup", err.message);
    res.json({ state: "fail", message: err.message });
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
      httpOnly: false,
    });

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/signup", err);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.getChosenMember = async (req, res) => {
  try {
    console.log("GET:cont/getChosenMember");
    const id = req.params.id;

    const member = new Member();
    const result = await member.getchosenMemberData(req.member, id);
    res.json({ state: "success", data: result });
  } catch (err) {
    res.json({ state: "fail", message: err.message });
  }
};

memberController.logout = async (req, res) => {
  try {
    console.log("GET const.logout");
    res.cookie("access_token", null, { maxAge: 0, httpOnly: false });
    res.json({ state: "success", data: "Logout Successfully" });
  } catch (err) {}
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
    req.member = member
    res.json({ state: "success", data: member });
  } catch (err) {
    res.json({ state: "fail", message: err.message });
  }
};
memberController.likeChosenMember = async (req, res) => {
  try {
    console.log("POST: cont/likeChosenMember");
    assert.ok(req.member, Definer.auth_err5);
    const member = new Member(),
      result = await member.likeChosenMemberData(req.member, req.body);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/likeChosenMember");
    res.json({ state: "fail", message: err.message });
  }
};

memberController.updateMember = async (req, res) => {
  try {
    console.log("POST: cont/updateMember");
    assert.ok(req.member, Definer.auth_err3);
    const member = new Member();
    const result = await member.updateMemberData(
      req.member,
      req.body,
      req.file
    );
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR: cont/updateMember, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
memberController.retrieveMember = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    req.member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
    next();
  } catch (err) {
    console.log(`Error: cont/retrieveMember, ${err.message}`);
    next();
  }
};
