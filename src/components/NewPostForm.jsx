import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../services/firebase';

const NewPostForm = ({ cerrarFormulario }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setAuthor(docSnap.data().displayName || user.email);
          } else {
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

  const handleNewPost = async (e) => {
    e.preventDefault();
    const user = getAuth().currentUser;
    if (!author || !user) {
      setError(
        'No se pudo obtener el nombre del autor o el usuario no está autenticado'
      );
      return;
    }

    try {
      const newPost = await addDoc(collection(db, 'posts'), {
        author: author,
        email: user.email,
        content: body,
        title: title,
        date: new Date(),
        likes: 10,
      });

      console.log('Documento escrito con ID: ', newPost.id);
      setTitle('');
      setBody('');
      cerrarFormulario();
    } catch (e) {
      console.error('Error al agregar el documento: ', e);
      setError('Error al agregar el documento');
    }
  };

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <form
          className="bg-zinc-700 p-5 rounded-xl w-6/12 grid gap-10"
          onSubmit={handleNewPost}
        >
          <h1 className="text-4xl text-white text-center">
            Creación de Publicación
          </h1>
          <div className="flex flex-col">
            <label htmlFor="title" className="text-white">
              Título
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="p-2 rounded-xl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="body" className="text-white">
              Contenido
            </label>
            <textarea
              name="body"
              id="body"
              className="p-2 rounded-xl"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-green-500 p-2 rounded-xl">
            Subir
          </button>
          <button
            className="bg-red-500 p-2 rounded-xl"
            onClick={cerrarFormulario}
          >
            Cerrar
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPostForm;
