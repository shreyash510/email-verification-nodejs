
const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');


require("../db/conn");
const User = require("../model/userSchema");
const userVerification = require('../model/userVerification')


router.get("/", (req, res) => {
    res.send("hello router")
});

router.post('/register', async (req, res) => {
    const { name, email, pass } = req.body;
    if (!name || !email || !pass) {
        res.json({
            status: 'FAILED',
            message: "Empty input fields !",
        });
    } else {
        try {
            const userExist = await User.findOne({ email: email })
            if (userExist) {
                return res.status(422).json({
                    error: "email already exist"
                });
            }
            const user = new User({ name, email, pass , verified : false})

            const userResister = await user.save()
            .then((result)=>{sendOtpVerification(result, res)})
            .catch((err)=>{
                console.log(err);
                res.json({
                    status : 'FAILED',
                    message : 'an error occurred while saving user account'
                })
            })
            // if (userResister) {
            //     return res.status(201).json({
            //         message: "user registered successfully"
            //     });
            // } else {
            //     res.status(500).json({ error: "failed to register" })
            // }
        } catch (err) {
            console.log(err)
        }
    }
})


const sendOtpVerification = async ({_id,name, email}, res) => {
    try {
        const myOtp = `${Math.floor(1000 + Math.random() * 9000)}`
        // console.log(otp)
        
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'skcoder510@gmail.com',
                pass: 'xnjfezjitlfazbfl'
            }
        });

        let mailDetails = {
            from: 'skcoder510@gmail.com',
            to: `${email}`,
            subject: 'Dotbind Email Authentification ',
            html: `<h3>Important: verify your email</h3>
            <p>Hi, ${name} </p>
            <p>Please Confirm you email address : ${email}</p>
            <p>We need to verify your email address so you can use 'Dotbind pvt ltd'</p>
            <span>Your Otp :</span> <strong>${myOtp}</strong>
            <p>thanks</p>`
        };

        const newOtpVerification = new userVerification({
            userId : _id,
            otp : myOtp, 
            createAt : Date.now(),
            expireAt : Date.now() + 3600000,
        })

        await newOtpVerification.save();
        await transporter.sendMail(mailDetails);
        res.json({
            status : 'PENDING',
            message : 'verification otp email send',
            date : {
                userId : _id,
                email, 
            }
        })

    } catch (err) {
        console.log(err)
    }
}


router.post("/register/otpverification", async (req, res)=>{
    try{
        const {userId, otp} = req.body;
        
            const userOtpVerificationRecourds = User.findOne({
                userId,
            });
            console.log(userOtpVerificationRecourds)
            if(userOtpVerificationRecourds.length <= 0){
                throw new Error(
                    'acc. record doesnt exixt or has been verified already, please sign up'
                )
            }else{
                const {expireAt} = userOtpVerificationRecourds[0];
                const hashedOTP = userOtpVerificationRecourds[0].otp;

                if(expireAt < Date.now()) {
                    await userVerification.deleteMany({userId});
                    throw new Error ('code has expired plese request again')
                }else{
                    if(!hashedOTP){
                        throw new Error ('invalid code passed. check you index')
                    }else{
                        await User.updateOne({_id: userId}, {verified : true});
                        await userVerification.deleteMany({userId});
                        res.json({
                            status : 'VERIFIED',
                            message : 'user email verified successfully'
                        })
                    }
                }
            }
        
    }catch(err){
        console.log(err)
            res.json({
                status : 'FAILED',
                message : 'error message'
            })
    }
})
// sendOtpVerification()
module.exports = router;