import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';

const NewPostForm = ({ cerrarFormulario }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState(''); // Estado para el autor

  useEffect(() => {
    const auth = getAuth(); // Obtener la instancia de autenticación
    const user = auth.currentUser; // Obtener el usuario actual

    if (user) {
      // Configura el autor usando el displayName o email
      setAuthor(user.displayName || user.email);
    }
  }, []);

  const handleNewPost = async (e) => {
    e.preventDefault();
    console.log(body);
    console.log(title);

    try {
      const newPost = await addDoc(collection(db, 'posts'), {
        author: author, // Utilizar el autor dinámico desde el estado
        content: body,
        title: title,
        date: new Date(),
        likes: 10, // Puedes cambiarlo según sea necesario
      });

      console.log('Documento escrito con ID: ', newPost.id);
      setTitle('');
      setBody('');
    } catch (e) {
      console.error('Error al agregar el documento: ', e);
    }
  };

  return (
    <>
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
