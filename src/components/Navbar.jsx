import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import perfil from '../img/fotoperfil.jpg';
import MyPosts from './MyPosts';
import { onAuthStateChanged } from 'firebase/auth';
import NewPostForm from './NewPostForm';
import UserProfile from './UserProfile'; // Asegúrate de importar el componente UserProfile

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState(false); // Estado para controlar la visibilidad de MyPosts
  const [newPost, setNewPost] = useState(false); // Estado para controlar la visibilidad del formulario de nuevo post
  const [showModal, setShowModal] = useState(false); // Estado para manejar la visibilidad de la modal

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log('Usuario logeado:', user);
      } else {
        console.log('No hay usuario logeado');
      }
    });

    // Cleanup del suscriptor para evitar fugas de memoria
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('Usuario deslogueado');
    } catch (error) {
      console.error('Error al desloguear:', error);
    }
  };

  // Función para abrir la modal de perfil
  const openModal = () => {
    setShowModal(true);
  };

  // Función para cerrar la modal de perfil
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <nav className="text-white flex justify-around w-full py-5 bg-zinc-900">
        <h1 className="text-3xl">Reddot .</h1>
        <ul className="flex text-xl gap-10 items-center">
          <li>Home</li>
          <button
            className="text-white"
            onClick={() => setMyPosts((prevState) => !prevState)} // Cambia el estado de myPosts
          >
            {myPosts ? 'Cerrar Posteos' : 'Ver Posteos'}{' '}
            {/* Cambia el texto según el estado */}
          </button>
          <li>Foros</li>
          <button
            className="text-white"
            onClick={() => setNewPost((prevState) => !prevState)} // Cambia el estado de newPost
          >
            {newPost ? 'Cerrar Crear' : 'Crear'}{' '}
            {/* Cambia el texto según el estado */}
          </button>
        </ul>
        <div className="flex gap-5">
          <img
            src={perfil}
            alt="Foto de perfil"
            className="h-10 rounded-full cursor-pointer"
            onClick={openModal} // Al hacer clic en la imagen, abre la modal
          />

          <button
            className="bg-red-500 h-10 w-fit p-2 rounded-md"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Solo muestra el formulario de nuevo post o los posteos */}
      {newPost && <NewPostForm cerrarFormulario={() => setNewPost(false)} />}
      {myPosts && <MyPosts />}

      {/* Modal de perfil */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-96">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={closeModal}
            >
              X
            </button>
            <UserProfile user={user} />{' '}
            {/* Pasa el objeto user al componente UserProfile */}
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
