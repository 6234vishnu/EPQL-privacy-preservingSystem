import { usermodel } from "../../models/userSchema.js";

// User Registration
export const userSignUp = async (req, res) => {
  console.log(req.body);

  try {
    const { name, email, password } = req.body;

    const existingUser = await usermodel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    
    const user=new usermodel({
      name,
      email,
      password
    })

    const savedUser=await user.save()
    
  if (!savedUser) {
    return res.status(500).json({
      success: false,
      message: "Couldn't create user, try again later.",
    });
  }

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user: savedUser, 
  });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// User Login
export const Loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    if(user?.isAdmin===true){
       return res.status(200).json({
      success: true,
      admin:true,
      message: "Login successfully",
      admin:user,
    });
    }

    return res.status(200).json({
      success: true,
      user:true,
      message: "Login successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const Getuserprofilepicture = async (req, res) => {
  console.log(req.url);
  try {
    if (req.isAuthenticated()) {
      return res.json({ success: true, user: req.user });
    } else {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
