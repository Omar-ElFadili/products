const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();
const config = require('config')
const Token = require('../models/UserVerification');
const crypto = require('crypto');
const sendEmail = require('../outils/sendEmail');
const userSchema = require('../schemas/usreSchema');


//this route for sign up a new user
exports.createUser = (req, res, next) => {
    //const user = User.findOne({email : req.body.email})
    // const { error } = userSchema.validate(req.body);
    // if (error) {
    //     return res.status(400).json({ message: error.details[0].message });
    // }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            req.body.password = hash
            const user = new User({
                ... req.body
            });
            user.save()
                .then(user => {
                    const newToken = new Token({
                        userId : user._id,
                        token : crypto.randomBytes(32).toString("hex")
                    })
                    .save()
                        .then(token => {
                            //ici un token sera enregistrer dans la base de données
                            console.log("un token de verification été enregistré dans database ", token)
                            
                            const urlToken = `${process.env.BASE_URL}user/verify/${user._id}/${token.token}`;
                            console.log('l email sera envoyé au email : ', user.email)
                            sendEmail(user.email, "verify email", urlToken, `${__dirname}/../views/email_template.ejs`)
                                .then(_ => {
                                    res.status(201).json({
                                        message :  "un message de verification a été envoyé à votre compte email",
                                    })
                                })
                                .catch(err => {
                                    res.status(401).json({message : "erreur dans l'envoi de message de verification", err})
                                })
                        })
                        .catch(err => {
                            console.log("un token de verification n'a pas été enregistré dans database ", err)
                
                        })
                    
                })
                .catch(error => {
                    console.error("Erreur lors de la création de l'utilisateur :", error);
                    res.status(400).json({ message: "Erreur lors de la création d'un nouvel utilisateur", error });
                });
                console.log(hash)

        })
        .catch(err =>{
            res.status(500).json({err})
        })


}

exports.login = (req, res, next) => {
    User.findOne({email : req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({message : "user et password introuvable"})
            }
            if(!user.verified){
                let token = Token.findOne({
                    userId : user._id
            })
            if(!token){
                token = new Token({
                    userId : user._id,
                    token : crypto.randomBytes(32).toString("hex")
                })
                .save()
                    .then(token => {
                        //ici un token sera enregistrer dans la base de données
                        console.log("un token de verification été enregistré dans database ", token)
                    })
                    .catch(err => {
                        console.log("un token de verification n'a pas été enregistré dans database ", err)
            
                    })
                const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
                sendEmail(user, "verify email", url)
                    .then(_ => {
                        res.status(201).json({
                            message :  "un message de verification a été envoyé",
                        })
                    })
                    .catch(err => {
                        res.status(401).json({message : "erreur dans l'envoi de message de verification", err})
                    })
            }
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({message : "le password est incorrecte"})
                    }
                    const token = jwt.sign(
                        {userId : user._id, roles : user.roles},
                        'RANDOM_TOKEN_SRCRET',
                        {expiresIn : '24h'}
                    )
                    res.status(200).json({
                        //ici on va retourner au frontend un objet user avec un token sera géneré maintenant
                        userId : user._id,
                        token : token
                    }).header('x-auth-token', token)
                })
                .catch(err => {
                    res.status(401).json({message : "le password est incorrecte on peut pas generer un token", err})
                })
        })
        .catch(err => {
            res.status(404).json({message : 'ce email ne existe pas ', err})
        })
}

exports.verificationUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid link" });
        }
        console.log('l utilisateur existe', user)
        const ourToken = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });

        if (!ourToken) {
            return res.status(400).json({ message: "Invalid link" });
        }
        console.log('le token existe', ourToken)
        const newVerifiedValue = true; // Mettez la nouvelle valeur ici
        User.findOneAndUpdate({ _id: user._id }, { verified: newVerifiedValue }, { new: true })
                .then(updatedUser => {
                    if (updatedUser) {
                        console.log('Utilisateur mis à jour :', updatedUser);
                    } else {
                        console.log('Utilisateur non trouvé');
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
                });
        console.log(' modification de verified est faite', user.verified)

        await Token.deleteOne({
            userId: ourToken.userId,
            token: ourToken.token
        });
        console.log('le token est supprimé')


        // Rediriger après la vérification
        res.render(`${__dirname}/../views/email-verify.ejs`);
        console.log('redirection est')

    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err });
    }
};



exports.getCurrentUser = (req, res, next) => {
    const id = req.user._id
    User.findById(id)
        .then(user => {
            res.status(201).json({message : "celui la est le courant user", user})
            
        })
        .catch(err => {
            res.status(404).json({err})
    })

}
//this route for return a user in the database
exports.findOneUser = (req, res, next) => {
    const id = req.params.id
    User.findById({_id : id})
        .then(user => {
            res.status(200).json({message : "nous avons trouvé un user ", user})
        })
        .catch(err => {
            res.status(404).json({err})
        })

}
