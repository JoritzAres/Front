import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Container,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LeerUsuario } from "../../api/login"; // Importa la función para leer socios desde tu API
import Menu from "../Menu";
import { useNavigate } from "react-router-dom";
import HeaderLogin from "../../api/layout/headers/HeaderLogin";
function Socios() {
  const [socios, setSocios] = useState([]);
  const [filtroRol, setFiltroRol] = useState("");
  const [mostrarBaja, setMostrarBaja] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const rolUsuario = sessionStorage.getItem("Rol");
    if (!["1", "2", "3"].includes(rolUsuario)) {
      navigate("/inicio_socios"); // Redirige a una ruta para acceso denegado o inicio
    }

    const fetchSocios = async () => {
      try {
        const response = await LeerUsuario();
        setSocios(response.result);
      } catch (error) {
        console.error("Error al obtener socios:", error);
      }
    };

    fetchSocios();
  }, [navigate]);
  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const response = await LeerUsuario();
        setSocios(response.result);
      } catch (error) {
        console.error("Error al obtener socios:", error);
      }
    };

    fetchSocios();
  }, []);

  const handleFiltroRolChange = (event) => {
    setFiltroRol(event.target.value);
  };

  const handleMostrarBajaChange = (event) => {
    setMostrarBaja(event.target.checked);
  };

  const sociosFiltrados = socios.filter((socio) => {
    if (filtroRol && socio.rol.toString() !== filtroRol) {
      return false;
    }
    if (!mostrarBaja && socio.baja === 1) {
      return false;
    }
    return true;
  });

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
            backgroundColor: "#388e3c", // Set the button background color
            padding: "10px",
            marginTop: "2%",
            color: "white",
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
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box style={{ height: "100%", width: "100%" }}>
        <Menu />
        <HeaderLogin />
        <Container component="main" sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Lista de Socios
            </Typography>
            <Box
              sx={{
                marginBottom: 2,
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mostrarBaja}
                    onChange={handleMostrarBajaChange}
                  />
                }
                label="Mostrar socios de baja"
              />
              <Select
                value={filtroRol}
                onChange={handleFiltroRolChange}
                displayEmpty
                inputProps={{ "aria-label": "Filtrar por Rol" }}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">Todos los roles</MenuItem>
                <MenuItem value="1">Rol 1</MenuItem>
                <MenuItem value="2">Rol 2</MenuItem>
                <MenuItem value="3">Rol 3</MenuItem>
                <MenuItem value="4">Rol 4</MenuItem>
                <MenuItem value="5">Rol 5</MenuItem>
              </Select>
            </Box>
            <TableContainer
              component={Paper}
              sx={{ width: "90%", maxWidth: "900px", maxHeight: "450px" }}
            >
              <Table  stickyHeader aria-label="Tabla de socios">
                <TableHead  sx={{ backgroundColor: "#388e3c" }}>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: "#388e3c",
                        color: "white",
                        "&:hover": { backgroundColor: "#2e6b27" },
                      }}
                    >
                      DNI
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
                      Apellido 1
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: "#388e3c",
                        color: "white",
                        "&:hover": { backgroundColor: "#2e6b27" },
                      }}
                    >
                      Apellido 2
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sociosFiltrados.map((socio) => (
                    <TableRow key={socio.n_socios}>
                      <TableCell align="center">{socio.Dni}</TableCell>
                      <TableCell align="center">{socio.Nombre}</TableCell>
                      <TableCell align="center">{socio.Apellido_1}</TableCell>
                      <TableCell align="center">{socio.Apellido_2}</TableCell>
                      <TableCell align="center">{socio.Telefono_1}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Socios;
