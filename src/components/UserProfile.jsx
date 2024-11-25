import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log('UID del usuario autenticado:', user.uid);
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setNewDisplayName(docSnap.data().displayName || '');
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

    fetchUserData();
  }, []);

  const handleUpdateDisplayName = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          displayName: newDisplayName,
        });
        setUserData((prevData) => ({
          ...prevData,
          displayName: newDisplayName,
        }));
        setIsEditing(false);
      } catch (err) {
        console.error('Error al actualizar el nombre:', err);
        setError('Error al actualizar los datos');
      }
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

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
