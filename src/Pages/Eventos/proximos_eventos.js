import React, { useState, useEffect } from "react";
import "../../App.css";
import HeaderLogin from "../../api/layout/headers/HeaderLogin";
import Footer from "../../api/layout/footer/Footer";
import {
  Container,
  Typography,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LeerUsuarioNS } from "../../api/login";
import {
  LeerEventos,
  CrearEvento,
  EliminarEvento,
  ActualizarEvento,
  ApuntarseEvento,
  LeerEventosApuntado,
  EliminarEventosApuntado,
} from "../../api/eventos";
import Menu from "../Menu";

function ProximosEventos() {
  const [eventos, setEventos] = useState([]);
  const [ubicacion, setUbicacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [fechaMax, setFechaMax] = useState("");
  const [Nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [vistaActual, setVistaActual] = useState("verEventos");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [dialogoEditarAbierto, setDialogoEditarAbierto] = useState(false);
  const [dialogoRegistroAbierto, setDialogoRegistroAbierto] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [recargarEventos, setRecargarEventos] = useState(false);
  const [comentario, setComentario] = useState("");
  const [matricula1, setMatricula1] = useState("");
  const [plazas1, setPlazas1] = useState("");
  const [matricula2, setMatricula2] = useState("");
  const [plazas2, setPlazas2] = useState("");
  const [apuntadoEventos, setApuntadoEventos] = useState([]);
  const [N_socio, setN_socio] = useState("");
  const [dialogoErrorAbierto, setDialogoErrorAbierto] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const handleCrearEvento = async () => {
    try {
      const organizador = sessionStorage.getItem("N_socio");
      const fechaEvento = fecha ? new Date(fecha) : null;
      const fechaMaximaEvento = fechaMax ? new Date(fechaMax) : null;

      // Verificar si las fechas son válidas
      if (fechaMaximaEvento && isNaN(fechaMaximaEvento.getTime())) {
        console.error("La fecha máxima no es válida");
        return;
      }

      if (fechaEvento && isNaN(fechaEvento.getTime())) {
        console.error("La fecha no es válida");
        return;
      }

      // Verificar si la fecha máxima es anterior a la fecha normal
      if (
        fechaMaximaEvento &&
        fechaEvento &&
        fechaMaximaEvento >= fechaEvento
      ) {
        console.error(
          "La fecha máxima debe ser anterior a la fecha del evento"
        );
        window.alert("La fecha máxima debe ser anterior a la fecha del evento");
        return;
      }
      const nuevoEvento = {
        ubicacion,
        fecha,
        organizador,
        fecha_maxima: fechaMax,
        tipo: "Evento",
        descripcion,
        Nombre,
      };
      const respuesta = await CrearEvento(nuevoEvento);
      console.log("Evento creado con éxito", respuesta);
      limpiarCampos();
      setRecargarEventos(!recargarEventos);
    } catch (error) {
      console.error("Error al crear evento:", error);
    }
  };

  const limpiarCampos = () => {
    setUbicacion("");
    setFecha("");
    setFechaMax("");
    setDescripcion("");
    setNombre("");
  };

  const cambiarVista = (vista) => {
    setVistaActual(vista);
    limpiarCampos();
  };

  // const confirmarEliminacion = () => {
  //     console.log(eventoSeleccionado);
  //     EliminarEvento(eventoSeleccionado);
  //     console.log("Evento eliminado");
  //     setDialogoAbierto(false);
  //     setRecargarEventos(!recargarEventos);
  // };
  const confirmarEliminacion = () => {
    if (eventoSeleccionado) {
      const fechaEvento = new Date(eventoSeleccionado.fecha);
      const fechaActual = new Date();
      const rol_usuario = sessionStorage.getItem("rol");
      const n_soc = sessionStorage.getItem("N_socio");
      console.log(eventoSeleccionado.Organizador, n_soc);
      if (fechaEvento < fechaActual) {
        setMensajeError("No puedes eliminar un evento que ya ha pasado.");
        setDialogoErrorAbierto(true);
      } else if (
        eventoSeleccionado &&
        (eventoSeleccionado.Organizador === n_soc ||
          ["1", "2", "3"].includes(rol_usuario))
      ) {
        EliminarEvento(eventoSeleccionado.ID_evento);
        console.log("Evento eliminado");
        setDialogoAbierto(false);
        setRecargarEventos(!recargarEventos);
      } else {
        setMensajeError("No tienes permiso para eliminar este evento.");
        setDialogoErrorAbierto(true);
      }
    } else {
      setMensajeError("Por favor selecciona un evento para eliminar.");
      setDialogoErrorAbierto(true);
    }
  };
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await LeerEventos();
        setEventos(response.result); // Ajusta según la estructura de la respuesta de tu API
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEventos();
  }, [recargarEventos]);

  const abrirDialogoEditar = () => {
    setDialogoEditarAbierto(true);
  };

  const cerrarDialogoEditar = () => {
    setDialogoEditarAbierto(false);
  };
  const abrirDialogoRegistro = async (evento) => {
    try {
      setEventoSeleccionado(evento);
      const nSocio = sessionStorage.getItem("N_socio");
      const response = await LeerUsuarioNS(nSocio);

      // Verificar si response contiene el socio
      if (response && response.socio) {
        setMatricula1(response.socio.Matricula_1 || "");
        setMatricula2(response.socio.Matricula_2 || "");
      } else {
        console.error("No se pudo obtener la información del usuario.");
        setMatricula1("");
        setMatricula2("");
      }
      setDialogoRegistroAbierto(true);
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    }
  };
  const cerrarDialogoRegistro = () => {
    setEventoSeleccionado(null);
    setDialogoRegistroAbierto(false);
  };

  const handleRegistroEvento = async () => {
    try {
      const nSocio = sessionStorage.getItem("N_socio");
      const idEvento = eventoSeleccionado.ID_evento;

      if (!nSocio || !idEvento) {
        console.error("Número de socio o ID de evento no válido");
        return;
      }

      const datosRegistro = {
        id_evento: idEvento,
        N_socio: nSocio,
        comentario,
        matricula1,
        plazas1,
        matricula2,
        plazas2,
      };

      const respuesta = await ApuntarseEvento(datosRegistro);
      console.log("Registro de evento exitoso:", respuesta);

      cerrarDialogoRegistro();
      setRecargarEventos(!recargarEventos);
    } catch (error) {
      console.error("Error al registrar en el evento:", error);
    }
  };

  useEffect(() => {
    if (eventoSeleccionado) {
      setUbicacion(eventoSeleccionado.Ubicacion || "");
      setFecha(new Date(eventoSeleccionado.fecha).toISOString().split("T")[0]); // Formatear la fecha
      setFechaMax(
        new Date(eventoSeleccionado.fecha_maxima).toISOString().split("T")[0]
      ); // Formatear la fecha
      console.log(eventoSeleccionado.fecha_maxima);
      setNombre(eventoSeleccionado.Nombre || "");
      setDescripcion(eventoSeleccionado.descripcion || "");
    }
  }, [eventoSeleccionado]);

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
  };

  const handleActualizarEvento = async () => {
    try {
      const fechaEvento = fecha ? new Date(fecha) : null;
      const fechaMaximaEvento = fechaMax ? new Date(fechaMax) : null;
      const n_soc = sessionStorage.getItem("N_socio");
      const rol_usuario = sessionStorage.getItem("rol");
      const eventoActualizado = {
        ID_evento: eventoSeleccionado.ID_evento,
        ubicacion,
        fecha_maxima: fechaMaximaEvento
          ? fechaMaximaEvento.toISOString().split("T")[0]
          : "",
        descripcion,
        Nombre,
      };

      console.log("fecha", fechaEvento, "fecha maxima", fechaMaximaEvento);

      // // Verificar si las fechas son válidas antes de actualizar el evento
      if (fechaEvento && isNaN(fechaEvento.getTime())) {
        setMensajeError("La fecha no es valida.");
        setDialogoErrorAbierto(true);
        return;
      }

      if (fechaMaximaEvento && isNaN(fechaMaximaEvento.getTime())) {
        setMensajeError("La fecha maxima no es valida.");
        setDialogoErrorAbierto(true);
        return;
      }

      if (
        fechaMaximaEvento &&
        fechaEvento &&
        fechaMaximaEvento >= fechaEvento
      ) {
        setMensajeError(
          "La fecha máxima debe ser anterior a la fecha del evento."
        );
        setDialogoErrorAbierto(true);
        return;
      }
      if (
        eventoSeleccionado.Organizador !== n_soc &&
        !["1", "2", "3"].includes(rol_usuario)
      ) {
        setMensajeError("No tienes permisos para editar este evento.");
        setDialogoErrorAbierto(true);
        return;
      }
      await ActualizarEvento(eventoActualizado);
      setDialogoAbierto(false);
      setRecargarEventos(!recargarEventos);
      cerrarDialogoEditar();
    } catch (error) {
      setMensajeError("Error al actualizar el evento:", error);
      setDialogoErrorAbierto(true);
    }
  };
  const LeerEventosApuntados = async () => {
    try {
      const N_socio = sessionStorage.getItem("N_socio");
      const eventosApuntados = [];

      for (const evento of eventos) {
        const response = await LeerEventosApuntado({
          N_socio,
          id_evento: evento.ID_evento,
        });
        console.log(`Response -->`, response); // Agregar este registro
        const apuntado = response.result.length > 0;
        eventosApuntados.push({
          ID_evento: evento.ID_evento,
          apuntado: apuntado,
        });

        console.log(
          `Evento ${evento.ID_evento}: ${apuntado ? "Apuntado" : "No apuntado"}`
        );
      }

      console.log("Eventos apuntados:", eventosApuntados); // Agregar este registro

      setApuntadoEventos(eventosApuntados);
    } catch (error) {
      console.error("Error al obtener eventos apuntados:", error);
    }
  };

  const EliminarApuntado = async (evento) => {
    try {
      const N_socio = sessionStorage.getItem("N_socio");
      const even = {
        N_socio: N_socio,
        id_evento: evento.ID_evento,
      };
      await EliminarEventosApuntado(even);
      // Actualizar la lista de eventos apuntados después de eliminar el evento
      setApuntadoEventos((prevState) =>
        prevState.filter(
          (apuntadoEvento) => apuntadoEvento.ID_evento !== evento.ID_evento
        )
      );
    } catch (error) {
      console.error("Error al eliminar evento apuntado:", error);
    }
  };

  useEffect(() => {
    // Llama a la función para leer los eventos apuntados cuando el número de socio cambie
    LeerEventosApuntados();
  }, [eventos]);
  const theme = createTheme({
    palette: {
      primary: {
        main: "#388e3c", // Green
      },
      secondary: {
        main: "#5d4037", // Brown
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: "#388e3c",
            color: "white",
            "&:hover": {
              backgroundColor: "#2e6b27",
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: "#388e3c",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: "white",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box style={{ height: "100%", width: "100%" }}>
        <Menu />
        <HeaderLogin />
        <Container component="main" sx={{ mt: 4, mb: 4 }}>
          {/* <Button style={{ backgroundColor: "#388e3c", color: "white", width: "20%", padding: "10px", marginTop: "5%", marginRight: "5%" }} onClick={() => cambiarVista("verEventos")}>Ver Eventos</Button> */}
          {/* <Button style={{ backgroundColor: "#388e3c", color: "white", width: "20%", padding: "10px", marginTop: "5%", marginLeft: "5%" }} onClick={() => cambiarVista("crearEvento")}>Crear Evento</Button> */}

          {vistaActual === "verEventos" && (
            <ThemeProvider theme={theme}>
              <Container component="main" sx={{ mb: 4 }}>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <Dialog
                    open={dialogoErrorAbierto}
                    onClose={() => setDialogoErrorAbierto(false)}
                  >
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                      <DialogContentText>{mensajeError}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => setDialogoErrorAbierto(false)}
                        color="primary"
                      >
                        Aceptar
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Dialog
                    open={dialogoRegistroAbierto}
                    onClose={cerrarDialogoRegistro}
                  >
                    <DialogTitle>
                      Apuntarse a{" "}
                      {eventoSeleccionado
                        ? eventoSeleccionado.Nombre
                        : "Evento"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Por favor, completa los siguientes campos para
                        registrarte en este evento.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="comentario"
                        placeholder="Comentario"
                        type="text"
                        fullWidth
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                      />
                      <TextField
                        margin="dense"
                        id="matricula1"
                        placeholder="Matrícula 1"
                        type="text"
                        fullWidth
                        value={matricula1}
                        onChange={(e) => setMatricula1(e.target.value)}
                        disabled={!!matricula1}
                      />
                      <TextField
                        margin="dense"
                        id="plazas1"
                        placeholder="Plazas 1"
                        type="number"
                        fullWidth
                        value={plazas1}
                        onChange={(e) => setPlazas1(e.target.value)}
                      />
                      <TextField
                        margin="dense"
                        id="matricula2"
                        placeholder="Matrícula 2"
                        type="text"
                        fullWidth
                        value={matricula2}
                        onChange={(e) => setMatricula2(e.target.value)}
                        disabled={!!matricula2}
                      />
                      <TextField
                        margin="dense"
                        id="plazas2"
                        placeholder="Plazas 2"
                        type="number"
                        fullWidth
                        value={plazas2}
                        onChange={(e) => setPlazas2(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={cerrarDialogoRegistro}
                        style={{ backgroundColor: "#7A0505", color: "white" }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleRegistroEvento}
                        style={{ backgroundColor: "#7A0505", color: "white" }}
                      >
                        Registrar
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Dialog
                    open={dialogoEditarAbierto}
                    onClose={cerrarDialogoEditar}
                  >
                    <DialogTitle>{"Editar Evento"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Edita los campos del evento seleccionado.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="ubicacion"
                        placeholder="Ubicación"
                        type="text"
                        fullWidth
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                      />
                      <TextField
                        margin="dense"
                        id="fechaMax"
                        placeholder="Fecha Máxima"
                        type="date"
                        fullWidth
                        value={fechaMax}
                        onChange={(e) => setFechaMax(e.target.value)}
                      />
                      <TextField
                        margin="dense"
                        id="nombre"
                        placeholder="Nombre"
                        type="text"
                        fullWidth
                        value={Nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                      <TextField
                        margin="dense"
                        id="descripcion"
                        placeholder="Descripción"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={cerrarDialogoEditar}
                        style={{ backgroundColor: "#7A0505", color: "white" }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleActualizarEvento}
                        style={{ backgroundColor: "#7A0505", color: "white" }}
                      >
                        Guardar Cambios
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ color: "primary.main", mb: 2 }}
                    >
                      Crear Evento
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                        mb: 4,
                      }}
                    >
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "#7A0505", color: "white" }}
                        onClick={() => cambiarVista("verEventos")}
                      >
                        Ver Eventos
                      </Button>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "#7A0505", color: "white" }}
                        onClick={() => cambiarVista("crearEvento")}
                      >
                        Crear Evento
                      </Button>
                    </Box>
                  </Box>
                  <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                    <Table aria-label="tabla de próximos eventos">
                      <TableHead>
                        <TableRow stickyHeader>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Ubicación
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Fecha
                          </TableCell>
                          {/* <TableCell align="center">Organizador</TableCell> */}
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Fecha Máxima
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Nombre
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Descripción
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {eventos.map((evento) => {
                          const eventoApuntado = apuntadoEventos.find(
                            (apuntadoEvento) =>
                              apuntadoEvento.ID_evento === evento.ID_evento
                          );
                          return (
                            <TableRow
                              key={evento.ID_evento}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                                backgroundColor:
                                  eventoSeleccionado === evento
                                    ? "#f5f5f5"
                                    : "transparent",
                              }}
                              onClick={() => setEventoSeleccionado(evento)}
                            >
                              <TableCell align="center">
                                {evento.Ubicacion}
                              </TableCell>
                              <TableCell align="center">
                                {new Date(evento.fecha).toLocaleDateString(
                                  "es-ES"
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {new Date(
                                  evento.fecha_maxima
                                ).toLocaleDateString("es-ES")}
                              </TableCell>
                              <TableCell align="center">
                                {evento.Nombre}
                              </TableCell>
                              <TableCell align="center">
                                {evento.descripcion}
                              </TableCell>
                              <TableCell>
                                {eventoApuntado && eventoApuntado.apuntado ? (
                                  <Button
                                    onClick={() => EliminarApuntado(evento)}
                                  >
                                    Desapuntarse
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => abrirDialogoRegistro(evento)}
                                  >
                                    Apuntarse
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap="20px"
                  >
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#7A0505", color: "white" }}
                      onClick={() => setDialogoAbierto(true)}
                      disabled={!eventoSeleccionado}
                    >
                      Eliminar Evento
                    </Button>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#7A0505", color: "white" }}
                      disabled={!eventoSeleccionado}
                      onClick={abrirDialogoEditar}
                    >
                      Actualizar Evento
                    </Button>
                  </Box>
                </Paper>
              </Container>
            </ThemeProvider>
          )}

          {vistaActual === "crearEvento" && (
            <Box
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "primary.main", mb: 2 }}>
                Crear Evento
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  mb: 4,
                }}
              >
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#7A0505", color: "white" }}
                  onClick={() => cambiarVista("verEventos")}
                >
                  Ver Eventos
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#7A0505", color: "white" }}
                  onClick={() => cambiarVista("crearEvento")}
                >
                  Crear Evento
                </Button>
              </Box>
              <TextField
                placeholder="Ubicación"
                variant="outlined"
                fullWidth
                margin="normal"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                sx={{ maxWidth: 600 }}
              />
              <TextField
                label="Fecha"
                type="date"
                variant="standard"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                sx={{ maxWidth: 600 }}
              />
              <TextField
                label="Fecha Máxima"
                type="date"
                variant="standard"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={fechaMax}
                onChange={(e) => setFechaMax(e.target.value)}
                sx={{ maxWidth: 600 }}
              />
              <TextField
                placeholder="Descripción"
                variant="outlined"
                fullWidth
                margin="normal"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                sx={{ maxWidth: 600 }}
              />
              <TextField
                placeholder="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={Nombre}
                onChange={(e) => setNombre(e.target.value)}
                sx={{ maxWidth: 600 }}
              />
              <Button
                variant="contained"
                style={{ backgroundColor: "#7A0505", color: "white" }}
                onClick={handleCrearEvento}
                sx={{ mt: 2 }}
              >
                Crear Evento
              </Button>
            </Box>
          )}
          <Dialog open={dialogoAbierto} onClose={cerrarDialogo}>
            <DialogTitle>
              {"¿Estás seguro de que quieres eliminar este evento?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Esta acción no se puede deshacer.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={cerrarDialogo}
                style={{ backgroundColor: "#7A0505", color: "white" }}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarEliminacion}
                autoFocus
                style={{ backgroundColor: "#7A0505", color: "white" }}
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default ProximosEventos;
