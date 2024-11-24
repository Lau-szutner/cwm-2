// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase'; // Asegúrate de que 'auth' esté importado desde tu configuración de Firebase

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Se actualiza el estado del usuario cuando cambia
    });

    return () => unsubscribe(); // Desuscribirse al desmontar el componente
  }, []);

  return { user };
};

export default useAuth;
