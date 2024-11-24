import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyADMpEPulIni-1QEZpoULlT3LzFPAvckao',
  authDomain: 'parcial-1-lfs.firebaseapp.com',
  projectId: 'parcial-1-lfs',
  storageBucket: 'parcial-1-lfs.appspot.com',
  messagingSenderId: '711080151934',
  appId: '1:711080151934:web:dd9c5e238b74eb5945c12f',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const loginEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential; // Si el login es exitoso, devuelve las credenciales del usuario
  } catch (error) {
    throw error; // Si hay un error, lo lanzamos para manejarlo en el componente
  }
};
export { auth };
export const db = getFirestore(app);
