import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
  CssBaseline,
  FormControl,
} from "@mui/material";
import {
  LeerTransacciones,
  LeerTransaccionesPorFecha,
  LeerTransaccionID,
  CrearTransaccion,
} from "../../api/cuentas";
import Menu from "../Menu";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LeerSociosActivos } from "../../api/login";
import HeaderLogin from "../../api/layout/headers/HeaderLogin";

function BalanceDeCuentas() {
  const [transacciones, setTransacciones] = useState([]);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [datosCargados, setDatosCargados] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [vistaActual, setVistaActual] = useState("verBalance");
  const [etiquetaFiltro, setEtiquetaFiltro] = useState("");
  const [sociosActivos, setSociosActivos] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    cantidad: "",
    id_etiqueta: "",
    tipo: "GASTO",
    comentarios: "",
    foto: "",
    extension: "",
    socio: sessionStorage.getItem("N_socio") || "",
    fecha: new Date().toISOString().slice(0, 10),
  });

  const rolUsuario = sessionStorage.getItem("Rol");
  const isEditable = !["4", "5"].includes(rolUsuario);

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
  useEffect(() => {
    const fetchSociosActivos = async () => {
      try {
        const response = await LeerSociosActivos();
        console.log(response.socios); // Ajusta esta ruta a tu API real
        setSociosActivos(response.socios);
      } catch (error) {
        console.error("Error al cargar los socios activos:", error);
      }
    };

    fetchSociosActivos();
  }, []);

  useEffect(() => {
    if (vistaActual === "movimientos") {
      fetchMovimientos();
    } else {
      fetchTotalTransacciones();
      fetchTransacciones();
    }
  }, [datosCargados, mes, ano, vistaActual]);
  useEffect(() => {
    fetchTotalTransacciones();
  }, []);

  const fetchTotalTransacciones = async () => {
    const response = await LeerTransacciones();
    const transacciones = response.result;

    let totalGastos = 0;
    let totalIngresos = 0;

    transacciones.forEach((t) => {
      if (t.tipo === "INGRESO") {
        totalIngresos += t.cantidad;
      } else {
        totalGastos += t.cantidad;
      }
    });

    setSaldoTotal(totalIngresos - totalGastos);
  };
  const fetchTransacciones = async () => {
    const response = await LeerTransaccionesPorFecha(mes, ano);
    const transaccionesFiltradas = response.result;

    let totalGastos = 0;
    let totalIngresos = 0;

    transaccionesFiltradas.forEach((t) => {
      if (t.tipo === "INGRESO") {
        totalIngresos += t.cantidad;
      } else {
        totalGastos += t.cantidad;
      }
    });

    setTransacciones(transaccionesFiltradas);
    setIngresos(totalIngresos);
    setGastos(totalGastos);
    setSaldoTotal(totalIngresos - totalGastos);
    setDatosCargados(true);
  };

  const fetchMovimientos = async () => {
    const response = await LeerTransacciones();
    const filteredTransacciones = response.result.filter(
      (t) =>
        etiquetaFiltro === "" ||
        t.Etiqueta.toLowerCase().includes(etiquetaFiltro.toLowerCase())
    );
    setTransacciones(filteredTransacciones);
    setDatosCargados(true);
  };

  useEffect(() => {
    if (vistaActual === "movimientos") {
      fetchMovimientos();
    } else {
      fetchTotalTransacciones();
      fetchTransacciones();
    }
  }, [datosCargados, mes, ano, vistaActual, etiquetaFiltro]);

  // const fetchMovimientos = async () => {
  //     const response = await LeerTransacciones();
  //     const filteredTransacciones = response.result.filter(t =>
  //         etiquetaFiltro === "" || t.Etiqueta.toLowerCase().includes(etiquetaFiltro.toLowerCase()));
  //     setTransacciones(filteredTransacciones);
  //     setDatosCargados(true);
  // };

  const handleOpenDialog = async (idTransaccion) => {
    const response = await LeerTransaccionID(idTransaccion);
    setSelectedTransaction(response.result);
    setOpenDialog(true);
  };

  const cambiarVista = (vista) => {
    setVistaActual(vista);
    setDatosCargados(false); // Para recargar datos cuando se cambie de vista
  };
  const etiquetas = [
    { id_etiqueta: 1, Nombre: "Cuota" },
    { id_etiqueta: 2, Nombre: "Mantenimiento" },
    { id_etiqueta: 3, Nombre: "Oficina" },
    { id_etiqueta: 4, Nombre: "Donacion" },
    { id_etiqueta: 5, Nombre: "Devolucion" },
    { id_etiqueta: 6, Nombre: "Encargo" },
    { id_etiqueta: 7, Nombre: "Evento" },
    { id_etiqueta: 8, Nombre: "Informatica" },
    { id_etiqueta: 9, Nombre: "Pago con targeta" },
  ];
  const handleAddGasto = async () => {
    try {
      let binaryFoto = null;
      if (newTransaction.foto) {
        const reader = new FileReader();
        reader.onload = () => {
          binaryFoto = new Uint8Array(reader.result);
          submitTransaction(binaryFoto);
        };
        reader.readAsArrayBuffer(newTransaction.foto);
        setNewTransaction({
          cantidad: "",
          id_etiqueta: "",
          tipo: "GASTO",
          comentarios: "",
          extension: "",
          N_socio: newTransaction.socio,
          fecha: new Date().toISOString().slice(0, 10),
        });
      } else {
        submitTransaction(null);
      }
    } catch (error) {
      console.error("Error al procesar la foto:", error);
    }
  };

  const submitTransaction = async (binaryFoto) => {
    const transactionData = { ...newTransaction, foto: binaryFoto };
    try {
      await CrearTransaccion(transactionData);
      setVistaActual("verBalance");
      setDatosCargados(false);
      setNewTransaction({
        cantidad: "",
        id_etiqueta: "",
        tipo: "GASTO",
        comentarios: "",
        foto: "",
        extension: "",
        socio: newTransaction.socio,
        fecha: newTransaction.fecha,
      });
    } catch (error) {
      console.error("Error al crear la transacción:", error);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop();
      setNewTransaction({
        ...newTransaction,
        extension: extension,
        foto: file,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box style={{ height: "95%", width: "100%" }}>
        <CssBaseline />
        <Container component="main" sx={{ mb: 4 }}>
          <Menu />
          <HeaderLogin />
          {vistaActual === "verBalance" && (
            <>
              <Typography variant="h4" gutterBottom>
                Balance de cuentas
              </Typography>
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
                  style={{ backgroundColor: '#7A0505', color: 'white' }}
                  onClick={() => cambiarVista("verBalance")}
                >
                  Ver Balance
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#7A0505', color: 'white' }}
                  onClick={() => cambiarVista("movimientos")}
                >
                  Movimientos
                </Button>
                {/* <Button
                variant="contained"
                color="warning"
                onClick={() => cambiarVista("añadirGastos")}
              >
                Añadir Gastos
              </Button> */}
                {isEditable && (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#7A0505', color: 'white' }}
                    onClick={() => cambiarVista("añadirGastos")}
                  >
                    Añadir Movimientos
                  </Button>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  placeholder="Mes"
                  type="number"
                  value={mes}
                  disabled={!isEditable}
                  onChange={(e) => {
                    setMes(parseInt(e.target.value, 10));
                    setDatosCargados(false);
                  }}
                  InputProps={{
                    inputProps: { min: 1, max: 12 },
                  }}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  placeholder="Año"
                  type="number"
                  value={ano}
                  disabled={!isEditable}
                  onChange={(e) => {
                    setAno(parseInt(e.target.value, 10));
                    setDatosCargados(false);
                  }}
                  InputProps={{
                    inputProps: { min: 2000 },
                  }}
                  variant="outlined"
                  fullWidth
                />
                {/* <Button
                variant="contained"
                color="primary"
                onClick={() => setDatosCargados(false)}
              >
                Filtrar
              </Button> */}
              </Box>

              <Typography variant="h5" gutterBottom>
                Saldo total: {saldoTotal.toFixed(2)}€
              </Typography>

              <Typography>
                Ingresos: {ingresos.toFixed(2)}€ &nbsp; Gastos:{" "}
                {gastos.toFixed(2)}€
              </Typography>

              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                  <Table>
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
                          Etiqueta
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
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor: "#388e3c",
                            color: "white",
                            "&:hover": { backgroundColor: "#2e6b27" },
                          }}
                        >
                          Nº Socio
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transacciones.map((t, index) => (
                        <TableRow key={index}>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor:
                                t.tipo === "INGRESO" ? "#388e3c" : "#d32f2f",
                              color: "white",
                            }}
                          >
                            {t.cantidad.toFixed(2)}€
                          </TableCell>
                          <TableCell align="center">{t.Etiqueta}</TableCell>
                          <TableCell align="center">{t.comentarios}</TableCell>
                          <TableCell align="center">
                            {new Date(t.fecha).toLocaleDateString("es-ES")}
                          </TableCell>
                          <TableCell align="center">{t.socio}</TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2, mb: 2 }}
                            onClick={() => handleOpenDialog(t.id_transaccion)}
                          >
                            Ver información
                          </Button>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>

              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Detalles de la transacción</DialogTitle>
                <DialogContent>
                  {selectedTransaction && (
                    <div>
                      <p>
                        <strong>ID Etiqueta:</strong>{" "}
                        {selectedTransaction.id_etiqueta}
                      </p>
                      <p>
                        <strong>ID Transacción:</strong>{" "}
                        {selectedTransaction.id_transaccion}
                      </p>
                      <p>
                        <strong>Etiqueta:</strong>{" "}
                        {selectedTransaction.Etiqueta}
                      </p>
                      <p>
                        <strong>Cantidad:</strong>{" "}
                        {selectedTransaction.cantidad}
                      </p>
                      <p>
                        <strong>Comentarios:</strong>{" "}
                        {selectedTransaction.comentarios}
                      </p>
                      <p>
                        <strong>Extension:</strong>{" "}
                        {selectedTransaction.extension}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {selectedTransaction.fecha}
                      </p>
                      <p>
                        <strong>Socio:</strong> {selectedTransaction.socio}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {selectedTransaction.tipo}
                      </p>
                      {selectedTransaction.foto && (
                        <div>
                          <p>
                            <strong>Foto:</strong>
                          </p>
                          <img
                            src={selectedTransaction.foto}
                            alt="Foto de la transacción"
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {!selectedTransaction && (
                    <p>No se ha seleccionado ninguna transacción.</p>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} color="primary">
                    Cerrar
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}

          {vistaActual === "movimientos" && (
            <>
              <Typography variant="h4" gutterBottom>
                Movimientos
              </Typography>
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
                  style={{ backgroundColor: '#7A0505', color: 'white' }}
                  onClick={() => cambiarVista("verBalance")}
                >
                  Ver Balance
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#7A0505', color: 'white' }}
                  onClick={() => cambiarVista("movimientos")}
                >
                  Movimientos
                </Button>
                {isEditable && (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#7A0505', color: 'white' }}
                    onClick={() => cambiarVista("añadirGastos")}
                  >
                    Añadir Movimientos  
                  </Button>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  placeholder="Etiqueta"
                  type="text"
                  value={etiquetaFiltro}
                  onChange={(e) => {
                    setEtiquetaFiltro(e.target.value);
                    setDatosCargados(false);
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Box>

              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
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
                          Etiqueta
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
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor: "#388e3c",
                            color: "white",
                            "&:hover": { backgroundColor: "#2e6b27" },
                          }}
                        >
                          Nº Socio
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transacciones.map((t, index) => (
                        <TableRow key={index}>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor:
                                t.tipo === "INGRESO" ? "#388e3c" : "#d32f2f",
                              color: "white",
                            }}
                          >
                            {t.cantidad.toFixed(2)}€
                          </TableCell>
                          <TableCell align="center">{t.Etiqueta}</TableCell>
                          <TableCell align="center">{t.comentarios}</TableCell>
                          <TableCell align="center">
                            {new Date(t.fecha).toLocaleDateString("es-ES")}
                          </TableCell>
                          <TableCell align="center">{t.socio}</TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2, mb: 2 }}
                            onClick={() => handleOpenDialog(t.id_transaccion)}
                          >
                            Ver información
                          </Button>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>

              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Detalles de la transacción</DialogTitle>
                <DialogContent>
                  {selectedTransaction && (
                    <div>
                      <p>
                        <strong>ID Etiqueta:</strong>{" "}
                        {selectedTransaction.id_etiqueta}
                      </p>
                      <p>
                        <strong>ID Transacción:</strong>{" "}
                        {selectedTransaction.id_transaccion}
                      </p>
                      <p>
                        <strong>Etiqueta:</strong>{" "}
                        {selectedTransaction.Etiqueta}
                      </p>
                      <p>
                        <strong>Cantidad:</strong>{" "}
                        {selectedTransaction.cantidad}
                      </p>
                      <p>
                        <strong>Comentarios:</strong>{" "}
                        {selectedTransaction.comentarios}
                      </p>
                      <p>
                        <strong>Extension:</strong>{" "}
                        {selectedTransaction.extension}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {selectedTransaction.fecha}
                      </p>
                      <p>
                        <strong>Socio:</strong> {selectedTransaction.socio}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {selectedTransaction.tipo}
                      </p>
                      {selectedTransaction.foto && (
                        <div>
                          <p>
                            <strong>Foto:</strong>
                          </p>
                          <img
                            src={selectedTransaction.foto}
                            alt="Foto de la transacción"
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {!selectedTransaction && (
                    <p>No se ha seleccionado ninguna transacción.</p>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} color="primary">
                    Cerrar
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
          {vistaActual === "añadirGastos" && (
            <>
              <Typography variant="h4" align="center" gutterBottom>
                Añadir Movimientos
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mb: 4,
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#7A0505', color: 'white' }}
                  onClick={() => cambiarVista("verBalance")}
                >
                  Ver Balance
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#7A0505', color: 'white' }}
                  onClick={() => cambiarVista("movimientos")}
                >
                  Movimientos
                </Button>
                {isEditable && (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#7A0505', color: 'white' }}
                    onClick={() => cambiarVista("añadirGastos")}
                  >
                    Añadir Movimientos
                  </Button>
                )}
              </Box>
              <Container
                maxWidth="md"
                sx={{
                  mt: 4,
                  mb: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 600,
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 2,
                  }}
                >
                  <Box
                    component="form"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <TextField
                      placeholder="Cantidad"
                      type="number"
                      value={newTransaction.cantidad}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          cantidad: parseFloat(e.target.value),
                        })
                      }
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      required
                      variant="outlined"
                      fullWidth
                    />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Etiqueta</InputLabel>
                      <Select
                        value={newTransaction.id_etiqueta}
                        onChange={(e) =>
                          setNewTransaction({
                            ...newTransaction,
                            id_etiqueta: parseInt(e.target.value, 10),
                          })
                        }
                        placeholder="Etiqueta"
                        required
                      >
                        {etiquetas.map((etiqueta) => (
                          <MenuItem
                            key={etiqueta.id_etiqueta}
                            value={etiqueta.id_etiqueta}
                          >
                            {etiqueta.Nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined"></FormControl>
                    <FormControl fullWidth variant="outlined">
                      <Select
                        value={newTransaction.tipo}
                        onChange={(e) =>
                          setNewTransaction({
                            ...newTransaction,
                            tipo: e.target.value,
                          })
                        }
                        required
                      >
                        <MenuItem value="GASTO">GASTO</MenuItem>
                        <MenuItem value="INGRESO">INGRESO</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      placeholder="Comentarios"
                      type="text"
                      value={newTransaction.comentarios}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          comentarios: e.target.value,
                        })
                      }
                      multiline
                      rows={3}
                      variant="outlined"
                      fullWidth
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
                    {/* <TextField
                    placeholder="Extensión"
                    type="text"
                    value={newTransaction.extension}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        extension: e.target.value,
                      })
                    }
                    variant="outlined"
                    fullWidth
                  /> */}
                    {/* <TextField
                    placeholder="Nº Socio"
                    type="text"
                    value={newTransaction.socio}
                    disabled
                    variant="outlined"
                    fullWidth
                  /> */}
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Socio</InputLabel>
                      <Select
                        value={newTransaction.socio}
                        onChange={(e) =>
                          setNewTransaction({
                            ...newTransaction,
                            socio: e.target.value,
                          })
                        }
                        label="Socio"
                        required
                      >
                        {sociosActivos.map((socio) => (
                          <MenuItem key={socio.N_socio} value={socio.N_socio}>
                            {`${socio.Nombre} ${socio.Apellido_1} ${socio.Apellido_2}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      placeholder="Fecha"
                      type="date"
                      value={newTransaction.fecha}
                      disabled
                      variant="outlined"
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#7A0505', color: 'white' }}
                      onClick={handleAddGasto}
                      fullWidth
                      size="large"
                    >
                      Añadir
                    </Button>
                  </Box>
                </Box>
              </Container>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default BalanceDeCuentas;
