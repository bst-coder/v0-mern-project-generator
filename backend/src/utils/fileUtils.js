import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Configuration de __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Créer un dossier s'il n'existe pas
export const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Supprimer un fichier s'il existe
export const deleteFileIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

// Obtenir le chemin du dossier uploads
export const getUploadsPath = () => {
  return path.join(__dirname, "../../uploads")
}
