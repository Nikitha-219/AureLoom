const { User } = require("../models");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.image = req.body.image || user.image;

    if (req.body.address) {
      user.address = { ...user.address, ...req.body.address };
    }

    await user.save();
    
    const { password, ...updatedUser } = user.toJSON();
    res.json(updatedUser);
  } catch (error) { next(error); }
};

const updateProfileImage = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.image = req.body.image;
    await user.save();
    res.json({ image: user.image, message: "Profile image updated" });
  } catch (error) { next(error); }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) { next(error); }
};

module.exports = { getProfile, updateProfile, updateProfileImage, changePassword };
