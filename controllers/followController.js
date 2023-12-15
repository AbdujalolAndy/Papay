const assert = require("assert");
const Follow = require("../models/Follow");
const Definer = require("../lib/mistakes");

const followController = module.exports;

followController.subscribe = async (req, res) => {
  try {
    console.log("POST: cont/subscribe");
    assert.ok(req.member, Definer.auth_err5);

    const follow = new Follow();
    await follow.subscribeData(req.member, req.body);

    res.json({ state: "success", data: "subscribed" });
  } catch (err) {
    console.log("ERROR: cont/subscribe", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

followController.unsubscribe = async (req, res) => {
  try {
    console.log("POST: cont/unsubscribe");
    assert.ok(req.member, Definer.general_err2);
    const unsubscriber = new Follow();
    const result = await unsubscriber.unsubscribeData(req.member, req.body);

    assert.ok(result, Definer.general_err2);

    res.json({ state: "success", data: "unsubscribed" });
  } catch (err) {
    console.log("ERROR: cont/unsubscribe");
    res.json({ state: "fail", message: err.message });
  }
};

followController.getMemberFollowings = async (req, res) => {
  try {
    console.log("GET: cont/getMemberFollowings");

    const following = new Follow();
    const result = await following.getMemberFollowingsData(req.query);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getMemberFollowings");
    res.json({ state: "fail", message: err.message });
  }
};
