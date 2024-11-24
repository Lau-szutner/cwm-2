import React from 'react';

function MyPosts({ posts }) {
  if (posts.length === 0) return <p>No tienes publicaciones aún.</p>;

  return (
    <div>
      <h1>Mis publicaciones</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="my-post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => handleEdit(post.id)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const handleEdit = (postId) => {
  window.location.href = `/edit/${postId}`;
};

export default MyPosts;
