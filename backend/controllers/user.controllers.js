import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js"

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
}



export const updateProfile = async (req, res)=>{

    
    try {
        let {firstName, lastName, userName, headline, location, gender, skills, education, experience} = req.body;
        skills = skills?JSON.parse(skills):[]
        education = education?JSON.parse(education):[]
        experience = experience?JSON.parse(experience):[]
        let profileImage;
        let coverImage;

        if(req.files.profileImage){
           profileImage = await uploadOnCloudinary(req.files.profileImage[0].path)
        }
        if(req.files.coverImage){
            coverImage = await uploadOnCloudinary(req.files.coverImage[0].path)
        }

        let user = await User.findByIdAndUpdate(req.userId, {
            firstName,
            lastName,
            userName,
            headline,
            location,
            gender,
            education,
            skills,
            experience,
            profileImage,
            coverImage
        }, {new:true}).select("-password");

        if(!user){
          return res.status(400).json({success: false, message: "User not exist"});
        }

        return res.status(200).json({success: true, user});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
} 