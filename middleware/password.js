const passwordValidator = require('password-validator');

// On créé un schema
const schema = new passwordValidator();
// On y ajoute des propriétés
schema
.is().min(8)                                    
.is().max(100)                                 
.has().uppercase()                              
.has().lowercase()                              
.has().digits(2)                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); 

module.exports = (req, res, next) => {

if (!schema.validate(req.body.password)){
  res.status(400).json({message: "Veuillez choisir un mot de passe avec 8 caractères minimum, 1 majuscule, 1 minuscule, 2 chiffres et sans espace."});
}
else{
    next();
}
};