const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const Users = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId");

    if (!connectionRequest) {
      return res.status(400).json({ message: "No connection Found" });
    }

    res.json({
      message:
        "All the data from which you got the request and those are accepted",
      connectionRequest,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to get the user conncetions received", err });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const logUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: logUser._id, status: "accepted" },
        { fromUserId: logUser._id, status: "accepted" },
      ],
    })
      .populate("toUserId")
      .populate("fromUserId");

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === logUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to get the user conncetions", err });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 3;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await Users.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;
