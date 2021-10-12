const { io } = require("../server");
const { Usuarios } = require("../classes/usuario");
const { crearMensaje } = require("../utils/utilidades");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  client.on("EntrarChat", (data, callback) => {
    if (!data.nombre || !data.sala) {
      return callback({
        error: true,
        mensaje: "El nombre/sala es necesario",
      });
    }

    client.join(data.sala);

    let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

    client.broadcast.emit("listadoPersona", usuarios.getPersona());

    callback(personas);
  });

  client.on("crearMensaje", (data) => {
    let persona = usuarios.getPersona(client.id);
    let mensaje = crearMensaje(persona.nombre, data.mensaje);
    client.broadcast.emit("crearMensaje", mensaje);
  });

  client.on("disconnect", () => {
    let personaBorrada = usuarios.borrarPersona(client.id);

    client.broadcast.emit(
      "crearMensaje",
      crearMensaje("Administrador", `${personaBorrada.nombre} salio`)
    );
    client.broadcast.emit("listadoPersona", usuarios.getPersona());
  });

  // Mensajes privados
  client.on("mensajePrivado", (data) => {
    let persona = usuarios.getPersona(client.id);
    client.broadcast
      .to(data.para)
      .emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
  });
});
