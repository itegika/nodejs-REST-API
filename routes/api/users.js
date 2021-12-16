const express = require("express");

const {
  validation,
  authenticate,
  controllerWrapper,
  upload,
} = require("../../middlewares");
const { users: ctrl } = require("../../controllers");
const { userEmailValidation } = require("../../schemas/user");

const router = express.Router();

router.get("/current", authenticate, controllerWrapper(ctrl.getCurrent));
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  controllerWrapper(ctrl.updateAvatar)
);
router.get("/verify/:verificationToken", controllerWrapper(ctrl.verify));
router.post(
  "/verify",
  validation(userEmailValidation),
  controllerWrapper(ctrl.resendEmail)
);

module.exports = router;
