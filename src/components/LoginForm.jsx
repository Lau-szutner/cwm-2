import React, { useState } from 'react';
import { loginEmailPassword } from '../services/firebase'; // Importamos la función desde firebase.js

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llamamos a la función de login pasándole los valores de email y password
      const userCredential = await loginEmailPassword(email, password);

      console.log('Logged in:', userCredential.user); // Usuario logueado exitosamente
    } catch (err) {
      setError(err.message); // Manejo del error en la UI
      console.error('Error during login:', err.message); // Para depuración
    }
  };

  return (
    <div className="container mx-auto flex justify-center h-full items-center">
      <form
        className="grid bg-gray-200 p-10 rounded-xl w-6/12 gap-5 h-fit"
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl text-center"> Iniciar sesion</h1>
        <label htmlFor="email" className="text-xl">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="correo@ejemplo.com"
          className="p-2 rounded-md h-fit"
          value={email} // Asociamos el estado del email al input
          onChange={(e) => setEmail(e.target.value)} // Actualizamos el estado cuando el usuario escribe
          required
        />
        <label htmlFor="password" className="text-xl">
          Ingrese su contraseña
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Contraseña"
          className="p-2 rounded-md h-fit"
          value={password} // Asociamos el estado de password al input
          onChange={(e) => setPassword(e.target.value)} // Actualizamos el estado cuando el usuario escribe
          required
        />
        {error && <p className="text-red-500">{error}</p>}{' '}
        {/* Mostrar error si ocurre */}
        <button
          type="submit"
          className="bg-amber-600 text-black p-3 rounded-md text-white h-fit"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
