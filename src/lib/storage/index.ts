
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../firebaseConfig";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

function validateFile(file: File) {
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            message: "Arquivo muito grande. O tamanho máximo é 2MB."
        };
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            message: "Tipo de arquivo não suportado."
        };
    }
    return {
        valid: true,
        message: ''
    };
}


export async function uploadFile(
    file: File,
    path: string = "uploads",
    fileName?: string
): Promise<{ error?: boolean, message?: string, url?: string }> {
    // Ensure the user is authenticated
    if (!auth.currentUser) {
        return {
            error: true,
            message: "Usuário não autenticado."
        }
    }

    if (!file) return {
        error: true,
        message: "No file selected."
    }

    const { valid, message } = validateFile(file);
    if (!valid) return {
        error: true,
        message
    }

    const fileExtension = file.name.split('.').pop();
    const fileNameWithExtension = fileName ? `${fileName}.${fileExtension}` : file.name;

    // Create a reference to where the file will be stored in Firebase Storage
    const filePath = `${path}/${fileNameWithExtension}`;
    const storageRef = ref(storage, filePath);

    // Start the upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Return a promise that resolves with the download URL after the upload is complete
    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Optional: You can track progress here
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error("Error uploading file:", error);
                reject(new Error("Error uploading file"));
            },
            async () => {
                // Handle successful uploads on complete, get the download URL
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve({ url: downloadURL });
                } catch (error) {
                    console.log("Error: ", error);
                    reject(new Error("Error getting file download URL"));
                }
            }
        );
    });
}