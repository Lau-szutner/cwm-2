import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [comments, setComments] = useState({});
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail('');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postsArray);

      postsArray.forEach(async (post) => {
        const commentsSnapshot = await getDocs(
          query(
            collection(db, `posts/${post.id}/comments`),
            orderBy('createdAt')
          )
        );

        const postComments = commentsSnapshot.docs.map((doc) => doc.data());
        setComments((prevState) => ({
          ...prevState,
          [post.id]: postComments,
        }));
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddComment = async (postId) => {
    if (!newComments[postId]?.trim()) return;
    try {
      await addDoc(collection(db, `posts/${postId}/comments`), {
        user: userEmail,
        content: newComments[postId],
        createdAt: Timestamp.now(),
      });

      fetchComments(postId);

      setNewComments((prevState) => ({
        ...prevState,
        [postId]: '',
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const commentsSnapshot = await getDocs(
        query(collection(db, `posts/${postId}/comments`), orderBy('createdAt'))
      );
      const postComments = commentsSnapshot.docs.map((doc) => doc.data());

      setComments((prevState) => ({
        ...prevState,
        [postId]: postComments,
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  return (
    <div className="text-white rounded-md flex flex-col items-center justify-center">
      <h1 className="text-3xl text-center">Lista de Posteos</h1>
      <div className="grid p-10 gap-5 lg:w-10/12">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-zinc-600 rounded-md p-5 hover:bg-zinc-700 ease-in-out duration-300 flex flex-col lg:w-6/12"
          >
            <h2 className="text-2xl truncate">{post.title}</h2>

            {/* Agregar el campo displayName aquí */}
            {post.displayName && (
              <p className="text-xl text-gray-300 mt-2">
                Por: {post.displayName}
              </p>
            )}

            <div className="flex gap-10 my-5 items-center">
              <p className="text-xl">{post.author}</p>
            </div>
            <p className="text-2xl break-words ">{post.content}</p>
            <div className="flex gap-5">
              <p className="bg-zinc-500 rounded-md w-fit py-2 px-4 my-5">
                Me gusta: {post.likes}
              </p>
            </div>

            <div>
              <h2>Comentarios:</h2>
              <ul>
                {comments[post.id]?.length > 0 ? (
                  comments[post.id].map((comment, index) => (
                    <li key={index} className="bg-zinc-900 p-2 rounded-md my-2">
                      <div className="flex">
                        <div className="bg-blue-500 h-10 w-10 mr-5 rounded-full"></div>
                        {comment.user} -{' '}
                        {comment.createdAt instanceof Timestamp
                          ? comment.createdAt.toDate().toLocaleString('es-ES')
                          : new Date(comment.createdAt).toLocaleString('es-ES')}
                      </div>
                      <div className="break-words">{comment.content}</div>
                    </li>
                  ))
                ) : (
                  <li>No hay comentarios</li>
                )}
              </ul>
            </div>

            <div>
              <input
                type="text"
                value={newComments[post.id] || ''}
                onChange={(e) =>
                  setNewComments((prevState) => ({
                    ...prevState,
                    [post.id]: e.target.value,
                  }))
                }
                placeholder="Escribe un comentario..."
                className="w-full p-2 rounded-md bg-zinc-800 text-white"
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="bg-zinc-500 rounded-md w-fit py-2 px-4 mt-2"
              >
                Agregar Comentario
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsList;
