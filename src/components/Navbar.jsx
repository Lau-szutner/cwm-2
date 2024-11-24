import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import perfil from '../img/fotoperfil.jpg';
import MyPosts from './MyPosts';
import { onAuthStateChanged } from 'firebase/auth';
import NewPostForm from './NewPostForm';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState(false); // Cambiado a false para ocultar al inicio
  const [newPost, setNewPost] = useState(false);

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
  }, []); // Dependencias vacías, se ejecuta solo al montar el componente

  const handleNewPost = async () => {
    if (!user) {
      console.error('no hay usuario logeado');
      return;
    }

    try {
      const newPost = await addDoc(collection(db, `posts`), {
        author: 'prueba 1',
        content:
          'React es una biblioteca de JavaScript para construir interfaces de usuario.',
        date: new Date(),
        likes: '10',
        title: 'Title prueba',
      });
      console.log('Documento escrito con ID: ', newPost.id);
    } catch (e) {
      console.error('Error al agregar el documento: ', e);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('Usuario deslogueado');
    } catch (error) {
      console.error('Error al desloguear:', error);
    }
  };

  // Función para manejar la visibilidad de los posteos
  const handlePostToggle = () => {
    setMyPosts(true); // Mostrar mis posteos
    setNewPost(false); // Ocultar nuevo post
  };

  const handleNewPostToggle = () => {
    setMyPosts(false); // Ocultar mis posteos
    setNewPost(true); // Mostrar formulario nuevo post
  };

  return (
    <>
      <nav className="text-white flex justify-around w-full py-5 bg-zinc-900">
        <h1 className="text-3xl">Reddot .</h1>
        <ul className="flex text-xl gap-10 items-center">
          <li>Home</li>
          <button onClick={handlePostToggle}>Posteos</button>
          <li>Foros</li>
          <button onClick={handleNewPostToggle}>Crear</button>
        </ul>
        <div className="flex gap-5">
          <img src={perfil} alt="" className="h-10 rounded-full" />
          <button
            className="bg-red-500 h-10 w-fit p-2 rounded-md"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Solo muestra el formulario de nuevo post o los posteos */}
      {newPost && <NewPostForm cerrarFormulario={() => setNewPost(false)} />}
      {myPosts && <MyPosts />}
    </>
  );
};

export default NavBar;
