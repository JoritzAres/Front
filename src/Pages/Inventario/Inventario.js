import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
  Container,
  Box,
  Typography,
  FormControl,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  LeerInventarios,
  CrearInventario,
  EliminarInventario,
  ActualizarInventario,
} from "../../api/inventario"; // Ajusta las importaciones según tus API
import Menu from "../Menu";
import Footer from "../../api/layout/footer/Footer";
import HeaderLogin from "../../api/layout/headers/HeaderLogin";

function Inventarios() {
  const [inventarios, setInventarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [vistaActual, setVistaActual] = useState("verInventarios");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [dialogoEditarAbierto, setDialogoEditarAbierto] = useState(false);
  const [inventarioSeleccionado, setInventarioSeleccionado] = useState(null);
  const [recargarInventarios, setRecargarInventarios] = useState(false);
  const rolUsuario = sessionStorage.getItem("Rol");
  const puedeCambiarVista = !["4", "5"].includes(rolUsuario);
  const handleCrearInventario = async () => {
    try {
      const nuevoInventario = {
        nombre,
        cantidad,
        descripcion,
      };
      const respuesta = await CrearInventario(nuevoInventario);
      console.log("Inventario creado con éxito", respuesta);
      limpiarCampos();
      setRecargarInventarios(!recargarInventarios);
    } catch (error) {
      console.error("Error al crear inventario:", error);
    }
  };

  const limpiarCampos = () => {
    setNombre("");
    setCantidad("");
    setDescripcion("");
  };

  const cambiarVista = (vista) => {
    if (vista === "crearInventario") {
      limpiarCampos();
    }
    setVistaActual(vista);
    limpiarCampos();
  };

  const confirmarEliminacion = async () => {
    try {
      await EliminarInventario(inventarioSeleccionado.id_inv);
      console.log("Inventario eliminado");
      setDialogoAbierto(false);
      setRecargarInventarios(!recargarInventarios);
    } catch (error) {
      console.error("Error al eliminar inventario:", error);
    }
  };

  useEffect(() => {
    const fetchInventarios = async () => {
      try {
        const response = await LeerInventarios();
        setInventarios(response.result);
      } catch (error) {
        console.error("Error al obtener inventarios:", error);
      }
    };
    fetchInventarios();
  }, [recargarInventarios]);

  const abrirDialogoEditar = () => {
    setDialogoEditarAbierto(true);
  };

  const cerrarDialogoEditar = () => {
    setDialogoEditarAbierto(false);
  };

  useEffect(() => {
    if (inventarioSeleccionado) {
      setNombre(inventarioSeleccionado.nombre || "");
      setCantidad(inventarioSeleccionado.cantidad || "");
      setDescripcion(inventarioSeleccionado.descripcion || "");
    }
  }, [inventarioSeleccionado]);

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
  };

  const handleActualizarInventario = async () => {
    try {
      const inventarioActualizado = {
        id_inv: inventarioSeleccionado.id_inv,
        nombre,
        cantidad,
        descripcion,
      };
      await ActualizarInventario(inventarioActualizado);
      cerrarDialogoEditar();
      setRecargarInventarios(!recargarInventarios);
    } catch (error) {
      console.error("Error al actualizar inventario:", error);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#388e3c", // Verde
      },
      secondary: {
        main: "#5d4037", // Marrón
      },
      warning: {
        main: "#fbc02d", // Amarillo
      },
      background: {
        default: "#f4f4f4",
        paper: "#ffffff",
      },
    },
    typography: {
      h4: {
        color: "#388e3c", // Verde
        fontWeight: 600,
      },
      h5: {
        color: "#388e3c", // Verde
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: "bold",
            backgroundColor: "#388e3c",
            color: "white",
            padding: "10px",
            marginTop: "2%",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "#5d4037", // Marrón
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
      <Box style={{ height: "95%", width: "100%" }}>
        <Menu />
        <HeaderLogin></HeaderLogin>
        <Container component="main" sx={{ mt: 4, mb: 4 }}>
          {/* <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                    <Button variant="contained" color="primary" onClick={() => cambiarVista("verInventarios")}>Ver Inventario</Button>
                    <Button variant="contained" color="primary" onClick={() => cambiarVista("crearInventario")}>Añadir Material</Button>
                </Box> */}

          {vistaActual === "verInventarios" && (
            <Container component="main" sx={{ mt: 4, mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  color: theme.palette.primary.main,
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Actualizar Inventario
              </Typography>
              {puedeCambiarVista && (
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
                    onClick={() => cambiarVista("verInventarios")}
                  >
                    Ver Inventario
                  </Button>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#7A0505", color: "white" }}
                    onClick={() => cambiarVista("crearInventario")}
                  >
                    Añadir Material
                  </Button>
                </Box>
              )}
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <Dialog
                  open={dialogoEditarAbierto}
                  onClose={cerrarDialogoEditar}
                >
                  <DialogTitle>{"Editar Inventario"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Edita los campos del inventario seleccionado.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="nombre"
                      placeholder="Nombre"
                      type="text"
                      fullWidth
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                    <TextField
                      margin="dense"
                      id="cantidad"
                      placeholder="Cantidad"
                      type="number"
                      fullWidth
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
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
                      onClick={handleActualizarInventario}
                      style={{ backgroundColor: "#7A0505", color: "white" }}
                    >
                      Guardar Cambios
                    </Button>
                  </DialogActions>
                </Dialog>
                <TableContainer sx={{ maxHeight: "580px" }}>
                  <Table aria-label="tabla de inventarios">
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
                          Cantidad
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
                      {inventarios.map((inventario) => (
                        <TableRow
                          key={inventario.id_inv}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            backgroundColor:
                              inventarioSeleccionado === inventario
                                ? "#f5f5f5"
                                : "transparent",
                          }}
                          onClick={() => setInventarioSeleccionado(inventario)}
                        >
                          <TableCell align="center">
                            {inventario.nombre}
                          </TableCell>
                          <TableCell align="center">
                            {inventario.cantidad}
                          </TableCell>
                          <TableCell align="center">
                            {inventario.descripcion}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {puedeCambiarVista && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      style={{ backgroundColor: "#7A0505", color: "white" }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => setDialogoAbierto(true)}
                      disabled={!inventarioSeleccionado}
                    >
                      Eliminar Inventario
                    </Button>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#7A0505", color: "white" }}
                      disabled={!inventarioSeleccionado}
                      onClick={abrirDialogoEditar}
                    >
                      Actualizar Inventario
                    </Button>
                  </Box>
                )}
              </Paper>
            </Container>
          )}

          {vistaActual === "crearInventario" && (
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
                sx={{ color: theme.palette.primary.main, mb: 2 }}
              >
                Añadir Material
              </Typography>
              {puedeCambiarVista && (
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
                    onClick={() => cambiarVista("verInventarios")}
                  >
                    Ver Inventario
                  </Button>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#7A0505", color: "white" }}
                    onClick={() => cambiarVista("crearInventario")}
                  >
                    Añadir Material
                  </Button>
                </Box>
              )}
              <TextField
                placeholder="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                sx={{ maxWidth: 600 }}
              />
              <TextField
                placeholder="Cantidad"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                sx={{ maxWidth: 600 }}
              />
              <TextField
                placeholder="Descripción"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                sx={{ maxWidth: 600 }}
              />
              <Button
                variant="contained"
                style={{ backgroundColor: "#7A0505", color: "white" }}
                onClick={handleCrearInventario}
                sx={{ mt: 2 }}
              >
                Crear Material
              </Button>
            </Box>
          )}

          <Dialog open={dialogoAbierto} onClose={cerrarDialogo}>
            <DialogTitle>
              {"¿Estás seguro de que quieres eliminar este Material?"}
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

export default Inventarios;
