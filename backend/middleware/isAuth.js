import jwt from 'jsonwebtoken';

const isAuth = async (req,  res, next)=>{
    
    try {
       let {token} = req.cookies;
       
       if(!token){
         return res.status(401).json({success: false, message: "User does not have token!"})
       }

       let verifyToken =  jwt.verify(token, process.env.JWT_SECRETE);

       if(!verifyToken){
        return res.status(401).json({success: false, message: "User does not have valid token"});
       }
       req.userId = verifyToken.userId;
       next()
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
        
    }
}

export default isAuth;