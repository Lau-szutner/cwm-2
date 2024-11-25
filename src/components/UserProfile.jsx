import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase'; // Asegúrate de importar Firestore y Firebase Auth
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore

const UserProfile = () => {
  const [userData, setUserData] = useState(null); // Almacenará los datos del usuario
  const [error, setError] = useState(null); // Manejar errores
  const [newDisplayName, setNewDisplayName] = useState(''); // Para editar el nombre
  const [isEditing, setIsEditing] = useState(false); // Estado para manejar si estamos en modo edición

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log('UID del usuario autenticado:', user.uid); // Verifica que el UID sea correcto
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setNewDisplayName(docSnap.data().displayName || ''); // Inicializa el nombre en el estado
          } else {
            console.log('No se encontró el documento de usuario');
            setError('No se encontró la información del usuario');
          }
        } else {
          setError('No hay usuario autenticado');
        }
      } catch (err) {
        console.error('Error al obtener los datos del usuario:', err);
        setError('Error al obtener los datos del usuario');
      }
    };

    // Llama a la función de fetchUserData cuando el componente se monta
    fetchUserData();
  }, []); // Se ejecuta una vez cuando el componente se monta

  // Función para actualizar el displayName en Firestore
  const handleUpdateDisplayName = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          displayName: newDisplayName, // Actualiza el nombre del usuario
        });
        setUserData((prevData) => ({
          ...prevData,
          displayName: newDisplayName,
        }));
        setIsEditing(false); // Salir del modo de edición
      } catch (err) {
        console.error('Error al actualizar el nombre:', err);
        setError('Error al actualizar los datos');
      }
    }
  };

  // Verifica si hay un error o si no hay datos del usuario
  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Si no hay datos del usuario, muestra un mensaje
  if (!userData) {
    return (
      <div className="text-center">
        <p>Cargando datos del usuario...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Perfil de Usuario
      </h2>

      <div className="mb-6">
        <p className="font-medium text-gray-600">Correo electrónico:</p>
        <p className="text-gray-800">{userData.email}</p>
      </div>

      <div className="mb-6">
        <p className="font-medium text-gray-600">UID:</p>
        <p className="text-gray-800">{auth.currentUser.uid}</p>
      </div>

      {/* Campo editable para el nombre */}
      {userData.displayName && !isEditing && (
        <div className="mb-6">
          <p className="font-medium text-gray-600">Nombre:</p>
          <p className="text-gray-800">{userData.displayName}</p>
          <button
            className="text-blue-500 mt-2"
            onClick={() => setIsEditing(true)}
          >
            Editar
          </button>
        </div>
      )}

      {isEditing && (
        <div className="mb-6">
          <p className="font-medium text-gray-600">Nuevo Nombre:</p>
          <input
            type="text"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-md mt-2"
            onClick={handleUpdateDisplayName}
          >
            Guardar Cambios
          </button>
          <button
            className="bg-gray-300 text-black p-2 rounded-md mt-2 ml-2"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
