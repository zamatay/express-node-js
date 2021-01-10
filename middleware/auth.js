module.exports = (req,res,next)=>{
    if (req.session.user_id == null){
        return res.redirect('auth/login')
    }
    next();
}