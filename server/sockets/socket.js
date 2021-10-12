const { io } = require("../server");
const { Usuarios } = require("../classes/usuario");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  client.on("EntrarChat", (data, callback) => {
    if (!data.nombre) {
      return callback({
        error: true,
        mensaje: "El nombre es necesario",
      });
    }

    let personas = usuarios.agregarPersona(client.id, data.nombre);

    callback(personas);
  });
});
