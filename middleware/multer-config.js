// On importe multer
const multer = require("multer");

const authorizedExtensions = ["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"];

const removingExtensionFromName = (name, extension) => name.replace("." + extension, "");

const storage = multer.diskStorage({ // "diskStorage" configure le chemin et le nom de fichier pour les fichiers entrants.
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => { // Indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des "_" 
        const name = file.originalname.split(' ').join('_');
        const extension = file.mimetype.replace("image/", "");
        if (authorizedExtensions.find((ext) => ext === extension)) {
            const formattedName = removingExtensionFromName(name, extension);
            const fileName = formattedName + Date.now() + "." + extension;
            callback(null, fileName);
        } 
        else {
        callback(`Erreur 415: "${extension}" n'est pas le bon format de fichier. Les formats autorisés sont : ` + JSON.stringify(authorizedExtensions));
        return
          }
    }
});

module.exports = multer({storage}).single("image"); // On exporte l'élément configuré et on lui passe le storage en constante + on gère que les fichiers images