import React, { useState } from 'react';
import { loginEmailPassword } from '../services/firebase';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await loginEmailPassword(email, password);

      console.log('Logged in:', userCredential.user);
    } catch (err) {
      setError(err.message);
      console.error('Error during login:', err.message);
    }
  };

  return (
    <div className="container mx-auto flex justify-center h-full items-center">
      <form
        className="grid bg-zinc-500 p-10 rounded-xl w-6/12 gap-5 h-fit"
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500">{error}</p>}{' '}
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
