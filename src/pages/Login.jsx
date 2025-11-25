const handleLogin = async (nombre, password) => {
  const res = await login({ nombre, password });

  localStorage.setItem("token", res.data.token);
  localStorage.setItem(
    "usuarioActual",
    JSON.stringify({
      nombre: res.data.nombre,
      presupuesto: res.data.presupuesto,
      roles: res.data.roles,
    })
  );
};
