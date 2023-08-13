const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");

// to get user profile
router.get("/user/:id", async (req, res) => {
  try {
    let result = await USER.findOne({ _id: req.params.id }).select("-password");
    try {
      let post = await POST.find({ postedBy: req.params.id }).populate(
        "postedBy",
        "_id"
      );
      res.status(200).json({ user: result, post: post });
    } catch (err) {
      res.status(422).json({ error: err });
    }
  } catch (err) {
    res.status(422).json({ error: err });
  }
});

//to follow user
router.put("/follow", requireLogin, async (req, res) => {
  try {
    await USER.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user._id },
      },
      {
        new: true,
      }
    );

    await USER.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId },
      },
      {
        new: true,
      }
    );
    // res.json(result)
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ error: err });
  }

  // (err, result) => {
  //   if (err) {
  //     return res.status(422).json({ error: err });
  //   }

  //  try
  //  {

  //   res.json(result1)
  //  }catch(err){
  //       return res.status(422).json({ error: err });
  //     };
  //   }

  // );
});

//to unfollow user
router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    await USER.findByIdAndUpdate(
      req.body.followId,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      }
    );

    await USER.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.followId },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ result: "done" });
  } catch (err) {
    res.status(500);
    res.status(500).json({ err: err });
  }
  // (err, result) => {
  //   if (err) {
  //     return res.status(422).json({ error: err });
  //   }

  //   USER.findByIdAndUpdate(
  //     req.user._id,
  //     {
  //       $pull: { following: req.body.followId },
  //     },
  //     {
  //       new: true,
  //     }
  //   )
  //     .then((result) => res.json(result))
  //     .catch((err) => {
  //       return res.status(422).json({ error: err });
  //     });
  // }
  // );
});

//to upload profilepic
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
  try {
    let result=await USER.findByIdAndUpdate(
      req.user._id,
      {
        $set: { Photo: req.body.pic },
      },
      {
        new: true,
      }
    );
    res.json(result)
  } catch (err) {
    res.status(422).json({error:err});
  }
});
module.exports = router;
