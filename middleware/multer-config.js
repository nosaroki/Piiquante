// On importe multer
const multer = require("multer");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png"
};

const storage = multer.diskStorage({ // "diskStorage" configure le chemin et le nom de fichier pour les fichiers entrants.
    destination: (req, file, callback) => { // Indique à multer d'enregistrer les fichiers dans le dossier images
        callback(null, "images");
    },
    filename: (req, file, callback) => { // Indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des "_" 
        const name = file.originalname.split(' ').join(' ');
        const extension = MIME_TYPES[file.mimetype]; // On utiliser type MIME pour résoudre l'extension de fichier appropriée
        callback(null, name + Date.now() + "." + extension); // On ajoute un timestamp comme nom de fichier
    }
});

module.exports = multer({storage:storage}).single("image"); // On exporte l'élément configuré et on lui passe le storage en constante + on gère que les fichiers images