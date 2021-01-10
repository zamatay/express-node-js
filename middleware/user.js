const User = require('./../models/m_user')

module.exports = async (req,res,next)=>{
    if (req.session.user_id){
        req.user = await User.findById(req.session.user_id);
    }
    next();
}