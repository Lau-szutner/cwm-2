import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../services/firebase';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const postsQuery = collection(db, 'posts');
          const querySnapshot = await getDocs(postsQuery);
          const userPosts = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((post) => post.email === user.email);
          setPosts(userPosts);
        } else {
          setError('No hay usuario autenticado');
        }
      } catch (err) {
        console.error('Error al obtener las publicaciones:', err);
        setError('Error al obtener las publicaciones');
      }
    };

    fetchUserPosts();
  }, []);

  const handleEdit = (post) => {
    setEditingPost(post);
    setNewTitle(post.title);
    setNewBody(post.body);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (!newTitle || !newBody) {
      setError('Debe completar todos los campos');
      return;
    }

    const user = getAuth().currentUser;
    if (!user || !editingPost) return;

    try {
      const postRef = doc(db, 'posts', editingPost.id);
      await updateDoc(postRef, {
        title: newTitle,
        body: newBody,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editingPost.id
            ? { ...post, title: newTitle, body: newBody }
            : post
        )
      );

      setEditingPost(null);
      setNewTitle('');
      setNewBody('');
      setError('');
    } catch (err) {
      console.error('Error al actualizar la publicación:', err);
      setError('Error al actualizar la publicación');
    }
  };

  return (
    <div className="p-8">
      {error && <p className="text-red-500 text-center">{error}</p>}

      <h1 className="text-4xl text-center mb-8 font-bold text-white-900">
        Mis Publicaciones
      </h1>

      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-neutral-100 shadow-lg rounded-lg p-6 mb-6 transition-transform transform hover:scale-105"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700">{post.body}</p>
              <button
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                onClick={() => handleEdit(post)}
              >
                Editar
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-600">
            No tienes publicaciones aún.
          </p>
        )}
      </div>

      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            className="bg-zinc-700 p-6 rounded-xl w-5/12 grid gap-6"
            onSubmit={handleUpdatePost}
          >
            <h1 className="text-3xl text-white text-center font-semibold">
              Editar Publicación
            </h1>
            <div className="flex flex-col">
              <label htmlFor="title" className="text-white text-lg">
                Título
              </label>
              <input
                type="text"
                id="title"
                className="p-3 rounded-lg bg-gray-200 text-black"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="body" className="text-white text-lg">
                Contenido
              </label>
              <textarea
                id="body"
                className="p-3 rounded-lg bg-gray-200 text-black"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                Actualizar
              </button>
              <button
                type="button"
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                onClick={() => setEditingPost(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
