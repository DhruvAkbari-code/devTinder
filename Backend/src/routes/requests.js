const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const Users = require("../models/user");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .send({ message: "Cannot send the connection to yourself" });
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .send({ message: "The status no allowed", status });
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send({ message: "The duplicate not allowed" });
      }

      const touser = await Users.findById(toUserId);
      if (!touser) {
        return res.status(400).json({ message: "User not found" });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({ message: "connection request send successfully", data });
    } catch (err) {
      res
        .status(400)
        .send("The Route request/send/interested/:toUserId failed");
    }
  },
);

requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .send({ message: "The status no allowed", status });
      }
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).send("The connection request not found");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.json({ message: "connection request accepted successfully", data });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Unable to handle the request review : ", error });
    }
  },
);

module.exports = requestsRouter;
