const auth = require('../auth')
const User = require('../model/user-model')
const bcrypt = require('bcryptjs')
const Map = require('../model/map-model')
const MapInfo = require('../model/mapInfo-model')

registerUser = async (req, res) => {
    try {
        const { _id, username, email, password, passwordVerify, first_name, last_name } = req.body;
        if (!email || !password || !passwordVerify || !username || !first_name || !last_name) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }
        const existingUser2 = await User.findOne({ username: username });
        if (existingUser2) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        
        const liked_projects = []
        const myprojects = []
        const profile_picture = ""
        const publishedMaps = []

        const newUser = new User({
            username, email, passwordHash, first_name, last_name, liked_projects, myprojects, profile_picture, publishedMaps
        });

        if(_id) {
            newUser._id = _id
        }

        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: savedUser
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

login = async(req, res) => {
    const { email, username, password } = req.body;
    const loggedInUser = await User.findOne({ username: username });
    if (!loggedInUser) {
        return res.status(400).json({errorMessage:"User not found"});
    }
    const passwordCorrect = await bcrypt.compare(password, loggedInUser.passwordHash);
    if(!passwordCorrect) {
        return res.status(400).json({errorMessage:"Wrong password"});
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    // LOGIN THE USER
    const token = auth.signToken(loggedInUser);

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).status(200).json({
        success: true,
        user: loggedInUser
    }).send();
}

getLoggedIn = async (req, res) => {
    console.log(req.userId)
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        if(!loggedInUser) {
            return res.status(200).json({
                loggedIn: false,
                user: null
            })
        }

        return res.status(200).json({
            loggedIn: true,
            user: loggedInUser
        })
    })
}

logout = async(req, res) => {
    const token = auth.signToken(null);

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).status(200).json({
        success: true,
        user: null
    })
}

updateUser = async(req, res) => {
    
    const { email, username, first_name, last_name, id, myprojects, liked_projects, profile_picture, publishedMaps } = req.body;

    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const loggedInUser = await User.findOne({ _id: id });
    const body = req.body

    loggedInUser.first_name = first_name;
    loggedInUser.last_name = last_name;
    loggedInUser.username = username;
    loggedInUser.email = email;

    loggedInUser.myProjects = myprojects
    loggedInUser.liked_projects = liked_projects
    loggedInUser.profile_picture = profile_picture
    loggedInUser.publishedMaps = publishedMaps

    if (!loggedInUser) {
        return res.status(400).json({errorMessage:"User not found"});
    }

        loggedInUser
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    username: loggedInUser.username,
                    user: loggedInUser,
                    message: 'user updated!',
                })
            })
            .catch(error => {
                console.log((error));
                return res.status(404).json({
                    error,
                    message: 'user not updated!',
                })
            })

}

deleteUser = async(req, res) => {

    try{
        const { id } = req.body;

        if (!req.body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide an id to delete',
            })
        }

        const loggedInUser = await User.findOne({ _id: id });

        if (!loggedInUser) {
            return res.status(404).json({errorMessage:"User not found"});
        }

        
        const deletedUser = await User.findOneAndDelete({_id: id});
        return res.status(200).json({
            success:true,
            message: "deleted user successfully!",
            user: loggedInUser
        })
    }catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    login,
    logout,
    updateUser,
    deleteUser,
}