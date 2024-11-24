import React, { useState, useEffect } from 'react';
// import './css/styles.css';
import LoginForm from './components/LoginForm';
import NavBar from './components/Navbar';
import PostsList from './components/PostsList';
import Register from './components/Register';
import { db, auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  // Estado para el usuario autenticado
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(false);
  const [posts, setPosts] = useState(false);
  const [register, setRegister] = useState(true);

  function handleLogin() {
    setForm(false);
    setPosts(true);
  }

  function handleRegister() {
    setForm(true);
    setRegister(false);
  }

  // Monitorear el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario autenticado
        setUser(user); // Actualiza el estado con el usuario autenticado
        setPosts(true); // Muestra los posts si el usuario está autenticado
        setForm(false); // Esconde el formulario de registro
        setRegister(false); // Esconde el registro
      } else {
        // Usuario no autenticado
        setUser(null);
        setPosts(false); // No muestra los posts si no está autenticado
        setForm(false); // Muestra el formulario de inicio de sesión
        setRegister(true); // Muestra el formulario de registro
      }
    });

    // Limpia el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  function loginFirst() {
    setForm(true);
    setRegister(false);
  }
  return (
    <section className="flex flex-col gap-10">
      <NavBar />
      {/* Mostrar contenido basado en el estado de autenticación */}
      {user ? (
        // Si está autenticado, muestra la lista de posts
        <PostsList />
      ) : (
        // Si no está autenticado, muestra el formulario de registro o login
        <>
          {form && <LoginForm />}
          {register && <Register loginFirst={loginFirst} />}
        </>
      )}
    </section>
  );
};

export default App;
