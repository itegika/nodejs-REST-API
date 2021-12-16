const fs = require("fs/promises");
const path = require("path");
const { User } = require("../model");
const { NotFound } = require("http-errors");
const sendMail = require("../helpers");

const usersAvatarsDir = path.join(__dirname, "../../", "public/avatars");

const getCurrent = async (req, res) => {
  const { email } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      user: {
        email,
      },
    },
  });
};

const updateAvatar = async (req, res) => {
  const { path: tempPath, originalname } = req.file;
  const resultPath = path.join(usersAvatarsDir, originalname);
  const { _id, email } = req.user;
  try {
    await fs.rename(tempPath, resultPath);
    const avatarURL = `avatars/${email}`;
    const user = await User.findByIdAndUpdate(
      _id,
      { avatarURL },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    await fs.unlink(tempPath);
  }
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new NotFound("User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({
    status: "Verification successful",
    code: 200,
  });
};

const resendEmail = async (req, res, _) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      status: "error",
      code: 404,
      message: "User not found",
    });
  }

  if (!user.verify) {
    const mail = {
      to: email,
      subject: "Подтверждение email",
      html: `<a href="http://localhost:5000/api/users/verify/${user.verificationToken}">Нажмите для подтверждения</a>`,
    };

    sendMail(mail);

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Verification email sent",
    });
  }

  res.status(400).json({
    status: "Bad Request",
    code: 400,
    message: "Verification has already been passed",
  });
};

module.exports = {
  updateAvatar,
  getCurrent,
  verify,
  resendEmail,
};
