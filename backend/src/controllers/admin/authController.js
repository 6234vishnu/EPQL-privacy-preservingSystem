export const Getuserprofilepicture = async (req, res) => {
  try {
    const userId = req.user.id; // from decoded token

    const user = await usermodel.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ picture: user.picture });
  } catch (err) {
    console.error("Error fetching profile", err);
    return res.status(500).json({ message: "Server error" });
  }
};
