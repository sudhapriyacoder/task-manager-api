const express = require("express");
const User = require("../models/user");
const multer = require("multer");
// const sharp = require("sharp");
const auth = require("../middleware/auth");
const {sendWelcomeEmail, sendCancellationEmail} = require("../emails/account");
const router = new express.Router();


router.post('/users', async (req, res) => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
        sendWelcomeEmail(newUser.email, newUser.name);
        const token = await newUser.generateAuthToken();
        res.status(201).send({newUser, token});
    } catch (e) {
        console.log("errorooro")
        res.status(400).send(e);
    }
});

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
     req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
     })
     await req.user.save();
     res.send();
    } catch (e) {
    res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
     req.user.tokens = [];
     await req.user.save();
     res.send();     
    } catch (e) {
    res.status(500).send();
    }
})

router.get('/users', auth, async (req, res) => {
    try {
        const userData = await User.find({});
        res.send(userData);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/users/me', auth, async (req, res) => {
   res.send(req.user);
});



router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["age", "name", "email", "password"];
    isValidOperations = updates.every(data => allowedUpdates.includes(data));
    if (!isValidOperations) {
        return res.status(400).send({ "error": "Invalid updates" });
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user)
    } catch (error) {
        res.status(500).send();
    }
})

const upload = multer({
    limits: {
      fileSize: 1000000
    },
    fileFilter(req, file, cb) {
      if(!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)){
        return cb(new Error('Please upload an image'))
      }
      cb(undefined, true);

        //     if(!file.originalname.match(/\.(doc|docx)$/)){
        //       return cb(new Error('Please upload a word document'))
        //     }
        //     cb(undefined, true);
    }
  });

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    // req.user.avatar = buffer;
    await req.user.save()
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
            const user = await User.findById(req.params.id);
            if(!user || !user.avatar) {
                throw new Error()
            }
            res.set('Content-Type', 'image/png');
            res.send(user.avatar);
    } catch(e) {
        res.status(404).send()
    }
})

module.exports = router


// router.get('/users/:id', async (req, res) => {
//     let _id = req.params.id;
//     try {
//         const userData = await User.findById(_id);
//         if (!userData) {
//             return res.status(404).send("Not found data");
//         }
//         res.send(userData);
//     } catch (e) {
//         res.status(404).send(e);
//     }
// });