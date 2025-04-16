
import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

// User SignUp handeller
export const signUp = async (req, res)=>{
    try {
        
        let {firstName, lastName, userName, email, password} = req.body;

        let existUser = await User.findOne({email});

        if(existUser){
            return res.status(400).json({success: false, message: "Email already exist !"});
        }

        let existUserName = await User.findOne({userName});

        if(existUserName){
            return res.status(400).json({success: false, message: "Username already exist !"});
        }
        if(password.length<8){
            return res.status(400).json({success: false, message: "Password must be at least 8 charectors !"});
        }

        let hassedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hassedPassword
        })
         
        let token = await genToken(user._id);
        res.cookie('token', token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENVIRONMENT === "production"
        } );
        return res.status(201).json({success: true, user});

    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}


// User Login handeller
export const login = async (req, res)=>{
   try {
    const {email, password} = req.body;

    if(!email && !password){
      return res.status(400).json({success: false, message: "User does not exist !"});

    }

    let user = await User.findOne({email});
 
    
    if(!user){
      return res.status(400).json({success: false, message: "email or password required !"});
    }
    
    const isMatch =  bcrypt.compare(password, user.password);
     
    if(!isMatch){
      return res.status(400).json({success: false, message: "User password is incorrect !"});   
    }

    let token = await genToken(user._id);
    res.cookie('token', token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENVIRONMENT === "production"
    } );
    return res.status(201).json({success: true, user});

   } catch (error) {
      return res.status(500).json({success: false, message: error.message})
   }
}


// User LogOut handeller

export const logiOut = async (req, res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({success: true, message: "User Logout Successfully"});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
} 