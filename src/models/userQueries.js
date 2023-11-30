const User = require('./userModel');

module.exports.register = async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        // console.log(email, username, password)
        const user = new User({email, username});
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err);
        })
    } catch (e) {
        console.log('error', e.message)
        res.redirect('/register')
    }
}

module.exports.login = (req, res) => {
    console.log('logged in successfully')
    
}