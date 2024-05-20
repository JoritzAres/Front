import React, { useState, useEffect } from "react";
import "../../App.css";
import HeaderLogin from "../../api/layout/headers/HeaderLogin";
import Footer from "../../api/layout/footer/Footer";
import {
  Container,
  FormControl,
  Box,
  Typography,
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
import {
  LeerContactos,
  CrearContacto,
  EliminarContacto,
  ActualizarContacto,
} from "../../api/contactos"; // Ajusta las importaciones según tus API
import Menu from "../Menu";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
function Contactos() {
  const [contactos, setContactos] = useState([]);
  const [nombreOrganizacion, setNombreOrganizacion] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [apellidoContacto, setApellidoContacto] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccionCompleta, setDireccionCompleta] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [foto, setFotoFile] = React.useState(null);
  const [vistaActual, setVistaActual] = useState("verContactos");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [recargarContactos, setRecargarContactos] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState("");
  const [dialogoEditarAbierto, setDialogoEditarAbierto] = useState(false);
  const navigate = useNavigate();
  const rolUsuario = sessionStorage.getItem("Rol");
  const [nombreOrganizacionSeleccionado, setNombreOrganizacionSeleccionado] =
    useState("");
  const [nombreContactoSeleccionado, setNombreContactoSeleccionado] =
    useState("");
  const [apellidoContactoSeleccionado, setApellidoContactoSeleccionado] =
    useState("");
  const [correoSeleccionado, setCorreoSeleccionado] = useState("");
  const [telefonoSeleccionado, setTelefonoSeleccionado] = useState("");
  const [direccionCompletaSeleccionada, setDireccionCompletaSeleccionada] =
    useState("");
  const [comentariosSeleccionados, setComentariosSeleccionados] = useState("");
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [mensajeError, setMensajeError] = useState("");
  const [dialogoErrorAbierto, setDialogoErrorAbierto] = useState(false);
  const puedeCambiarVista = !["4", "5"].includes(rolUsuario);
  const handleCrearContacto = async () => {
    try {
      const correoValido = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(
        correo
      );
      if (!correoValido) {
        setMensajeError("Formato de correo electrónico inválido, tienes que haber una @ y un .");
        setDialogoErrorAbierto(true);
        return;
      }

      setErrorCorreo("");
      const nuevoContacto = {
        Nombre_Organizacion: nombreOrganizacion,
        Nombre_Contacto: nombreContacto,
        Apellido_Contacto: apellidoContacto,
        Correo: correo,
        Telefono: telefono,
        Direccion_Completa: direccionCompleta,
        Comentarios: comentarios,
        foto: foto,
      };

      const respuesta = await CrearContacto(nuevoContacto);
      console.log("Contacto creado con éxito", respuesta);

      setNombreOrganizacion("");
      setNombreContacto("");
      setApellidoContacto("");
      setCorreo("");
      setTelefono("");
      setDireccionCompleta("");
      setComentarios("");
      setFotoFile("");
      setRecargarContactos(!recargarContactos);
    } catch (error) {
      console.error("Error al crear contacto:", error);
    }
  };
  useEffect(() => {
    if (!["1", "2", "3"].includes(rolUsuario)) {
      navigate("/inicio_socios");
    }
  }, [navigate, rolUsuario]);
  const cambiarVista = (vista) => {
    setVistaActual(vista);
  };
  const handleFotoChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoFile(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const confirmarEliminacion = () => {
    console.log(contactoSeleccionado);
    EliminarContacto(contactoSeleccionado);
    console.log("Contacto eliminado");
    setDialogoAbierto(false);
    setRecargarContactos(!recargarContactos);
  };
  const cerrarDialogoError = () => {
    setDialogoErrorAbierto(false);
  };
  useEffect(() => {
    const fetchContactos = async () => {
      try {
        const response = await LeerContactos();
        setContactos(response.result);
      } catch (error) {
        console.error("Error al obtener contactos:", error);
      }
    };

    fetchContactos();
  }, [recargarContactos]);

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
  };

  const handleActualizarContacto = async () => {
    try {
      const contactoActualizado = {
        Codigo_contacto: contactoSeleccionado,
        Nombre_Organizacion: nombreOrganizacionSeleccionado,
        Nombre_Contacto: nombreContactoSeleccionado,
        Apellido_Contacto: apellidoContactoSeleccionado,
        Correo: correoSeleccionado,
        Telefono: telefonoSeleccionado,
        Direccion_Completa: direccionCompletaSeleccionada,
        Comentarios: comentariosSeleccionados,
        foto: foto,
      };

      await ActualizarContacto(contactoActualizado);
      setDialogoEditarAbierto(false);
      setRecargarContactos(!recargarContactos);
      cerrarDialogoEditar();
    } catch (error) {
      console.error("Error al actualizar contacto:", error);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#388e3c",
      },
      secondary: {
        main: "#5d4037",
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

  const handleTelefonoChange = (e) => {
    const telefonoValue = e.target.value;
    const isNumericOrEmpty = /^\d*$/.test(telefonoValue);
    if (!isNumericOrEmpty) {
      return;
    }
    setTelefono(telefonoValue);
  };
  const abrirDialogoEditar = () => {
    setDialogoEditarAbierto(true);
  };
  const cerrarDialogoEditar = () => {
    setDialogoEditarAbierto(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box style={{ height: "90%", width: "100%" }}>
        <Menu />
        <HeaderLogin />
        <Container component="main" sx={{ mt: 4, mb: 4 }}>
          {vistaActual === "verContactos" && (
            <ThemeProvider theme={theme}>
              <Container component="main" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ width: "auto", overflow: "hidden" }}>
                  <Dialog
                    open={dialogoEditarAbierto}
                    onClose={cerrarDialogoEditar}
                  >
                    <DialogTitle>{"Editar Contacto"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Edita los campos del contacto seleccionado.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="Nombre Organización"
                        placeholder="Nombre Organización"
                        type="text"
                        fullWidth
                        value={nombreOrganizacionSeleccionado}
                        onChange={(e) =>
                          setNombreOrganizacionSeleccionado(e.target.value)
                        }
                      />
                      <TextField
                        margin="dense"
                        id="Nombre Contacto"
                        placeholder="Nombre Contacto"
                        type="text"
                        fullWidth
                        value={nombreContactoSeleccionado}
                        onChange={(e) =>
                          setNombreContactoSeleccionado(e.target.value)
                        }
                      />
                      <TextField
                        margin="dense"
                        id="Apellido Contacto"
                        placeholder="Apellido Contacto"
                        type="text"
                        fullWidth
                        value={apellidoContactoSeleccionado}
                        onChange={(e) =>
                          setApellidoContactoSeleccionado(e.target.value)
                        }
                      />
                      <TextField
                        margin="dense"
                        id="Correo"
                        placeholder="Correo"
                        type="text"
                        fullWidth
                        value={correoSeleccionado}
                        onChange={(e) => setCorreoSeleccionado(e.target.value)}
                      />
                      <TextField
                        margin="dense"
                        id="Telefono"
                        placeholder="Telefono"
                        type="text"
                        fullWidth
                        rows={4}
                        value={telefonoSeleccionado}
                        onChange={(e) =>
                          setTelefonoSeleccionado(e.target.value)
                        }
                      />
                      <TextField
                        margin="dense"
                        id="Dirección completa"
                        placeholder="Dirección completa"
                        type="text"
                        fullWidth
                        rows={4}
                        value={direccionCompletaSeleccionada}
                        onChange={(e) =>
                          setDireccionCompletaSeleccionada(e.target.value)
                        }
                      />
                      <TextField
                        margin="dense"
                        id="Comentarios"
                        placeholder="Comentarios"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={comentariosSeleccionados}
                        onChange={(e) =>
                          setComentariosSeleccionados(e.target.value)
                        }
                      />
                      <FormControl fullWidth>
                        <Button
                          style={{ mt: "4px" }}
                          variant="contained"
                          component="label"
                          startIcon={<CloudUploadIcon />}
                        >
                          Nueva Foto
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFotoChange}
                          />
                        </Button>
                      </FormControl>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={cerrarDialogoEditar}
                        style={{ backgroundColor: "#7A0505", color: "white" }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleActualizarContacto}
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
                      Crear Contactos
                    </Typography>
                    {puedeCambiarVista && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 2,
                          mb: 4,
                        }}
                      >
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#7A0505", color: "white" }}
                          onClick={() => cambiarVista("verContactos")}
                        >
                          Ver Contactos
                        </Button>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#7A0505", color: "white" }}
                          onClick={() => cambiarVista("crearContacto")}
                        >
                          Crear Contacto
                        </Button>
                      </Box>
                    )}
                  </Box>
                  <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                    <Table aria-label="tabla de contactos">
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
                            Nombre Organización
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Nombre Contacto
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Apellido Contacto
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Correo
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Teléfono
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Dirección Completa
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#388e3c",
                              color: "white",
                              "&:hover": { backgroundColor: "#2e6b27" },
                            }}
                          >
                            Comentarios
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contactos.map((contacto) => (
                          <TableRow
                            key={contacto.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              backgroundColor:
                                contactoSeleccionado ===
                                contacto.Codigo_contacto
                                  ? "#f5f5f5"
                                  : "transparent",
                            }}
                            onClick={() => {
                              setContactoSeleccionado(contacto.Codigo_contacto);
                              setNombreOrganizacionSeleccionado(
                                contacto.Nombre_Organizacion
                              );
                              setNombreContactoSeleccionado(
                                contacto.Nombre_Contacto
                              );
                              setApellidoContactoSeleccionado(
                                contacto.Apellido_Contacto
                              );
                              setCorreoSeleccionado(contacto.Correo);
                              setTelefonoSeleccionado(contacto.Telefono);
                              setDireccionCompletaSeleccionada(
                                contacto.Direccion_Completa
                              );
                              setComentariosSeleccionados(contacto.Comentarios);
                              setFotoSeleccionada(contacto.foto);
                            }}
                          >
                            <TableCell align="center">
                              {contacto.Nombre_Organizacion}
                            </TableCell>
                            <TableCell align="center">
                              {contacto.Nombre_Contacto}
                            </TableCell>
                            <TableCell align="center">
                              {contacto.Apellido_Contacto}
                            </TableCell>
                            <TableCell align="center">
                              {contacto.Correo}
                            </TableCell>
                            <TableCell align="center">
                              {contacto.Telefono}
                            </TableCell>
                            <TableCell align="center">
                              {contacto.Direccion_Completa}
                            </TableCell>
                            <TableCell align="center">
                              {contacto.Comentarios}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {puedeCambiarVista && (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap="20px"
                    >
                      <Button
                        variant="outlined"
                        style={{ backgroundColor: "#7A0505", color: "white" }}
                        onClick={() => setDialogoAbierto(true)}
                        disabled={!contactoSeleccionado}
                      >
                        Eliminar Contacto
                      </Button>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "#7A0505", color: "white" }}
                        disabled={!contactoSeleccionado}
                        onClick={abrirDialogoEditar}
                      >
                        Actualizar Evento
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Container>
            </ThemeProvider>
          )}
          {vistaActual === "crearContacto" && (
            <Box
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "primary.main", mb: 2 }}>
                Crear Contacto
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
                  onClick={() => cambiarVista("verContactos")}
                >
                  Ver Contactos
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#7A0505", color: "white" }}
                  onClick={() => cambiarVista("crearContacto")}
                >
                  Crear Contacto
                </Button>
              </Box>
              <Box sx={{ width: "100%", maxWidth: 600 }}>
                <TextField
                  placeholder="Nombre de la Organización"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={nombreOrganizacion}
                  onChange={(e) => setNombreOrganizacion(e.target.value)}
                />
                <TextField
                  placeholder="Nombre del Contacto"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={nombreContacto}
                  onChange={(e) => setNombreContacto(e.target.value)}
                />
                <TextField
                  placeholder="Apellido del Contacto"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={apellidoContacto}
                  onChange={(e) => setApellidoContacto(e.target.value)}
                />
                <TextField
                  placeholder="Correo Electrónico"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <TextField
                  placeholder="Teléfono"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={telefono}
                  onChange={handleTelefonoChange}
                />
                <TextField
                  placeholder="Dirección Completa"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={direccionCompleta}
                  onChange={(e) => setDireccionCompleta(e.target.value)}
                />
                <TextField
                  placeholder="Comentarios"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                />
                <FormControl fullWidth>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                  >
                    Subir Foto
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFotoChange}
                    />
                  </Button>
                </FormControl>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#7A0505", color: "white" }}
                  onClick={handleCrearContacto}
                  sx={{ mt: 2, mb: "6%" }}
                >
                  Crear Contacto
                </Button>
              </Box>
            </Box>
          )}
          <Dialog open={dialogoAbierto} onClose={cerrarDialogo}>
            <DialogTitle>
              {"¿Estás seguro de que quieres eliminar este contacto?"}
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
          <Dialog open={dialogoErrorAbierto} onClose={cerrarDialogoError}>
            <DialogTitle>{"Error"}</DialogTitle>
            <DialogContent>
              <DialogContentText>{mensajeError}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cerrarDialogoError} style={{ backgroundColor: "#7A0505", color: "white" }}>
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Contactos;
