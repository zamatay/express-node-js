module.exports = (req, res, next)=>{
    res.locals.isAuth = req.session.user_id != null;
    next();
}