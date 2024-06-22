// Importa functiile necesare din SDK-ul Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuratia aplicatiei web Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,             // Cheia API pentru accesarea serviciilor Firebase
  authDomain: import.meta.env.VITE_AUTHDOMAIN,     // Domeniul de autentificare Firebase
  projectId: import.meta.env.VITE_PROJECTID,       // ID-ul proiectului Firebase
  storageBucket: import.meta.env.VITE_STORAGEBUCKET, // Bucket-ul de stocare Firebase
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID, // ID-ul pentru trimiterea mesajelor Firebase
  appId: import.meta.env.VITE_APPID                // ID-ul aplicatiei Firebase
};

// Initializeaza aplicatia Firebase cu configuratia specificata
const app = initializeApp(firebaseConfig);

// Obtine instanta Firestore pentru interactiunea cu baza de date Firestore
const db = getFirestore(app);

// Exporta aplicatia Firebase ca export implicit pentru utilizari ulterioare in proiect
export default app;

// Exporta instanta Firestore pentru utilizare in alte parti ale aplicatiei unde este necesara interactiunea cu baza de date
export { db };
