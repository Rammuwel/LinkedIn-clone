
import jwt from 'jsonwebtoken';


const genToken = async (userId)=>{
    try {
        let token = await jwt.sign({userId}, process.env.JWT_SECRETE, {expiresIn:"7d"});
        return token;
    } catch (error) {
        console.log(error.log);
    }
}

export default genToken;