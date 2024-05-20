import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HeaderLogin from "../../api/layout/headers/HeaderLogin";
import Footer from "../../api/layout/footer/Footer";
import { LeerUsuarioID, ActualizarUsuario } from "../../api/login";
import Menu from "../Menu";
function DetalleSocio() {
  const [socio, setSocio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSocio, setEditedSocio] = useState(null);
  const theme = createTheme({
    palette: {
      primary: {
        main: "#388e3c",
      },
      secondary: {
        main: "#5d4037", 
      },
      warning: {
        main: "#fbc02d",
      },
      background: {
        default: "#f4f4f4",
        paper: "#ffffff",
      },
    },
    typography: {
      h4: {
        color: "#388e3c",
        fontWeight: 600,
      },
      h5: {
        color: "#388e3c",
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
            padding: "10px",
            marginTop: "2%",
            color: "white",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "#5d4037", 
          },
        },
      },
    },
  });
  const renderImage = (buffer) => {
    if (buffer) {
      const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      return `data:image/jpeg;base64,${base64String}`;
    }
    return null;
  };
  useEffect(() => {
    const Dni = sessionStorage.getItem("DNI");
    if (Dni) {
      buscarSocio(Dni);
    }
  }, []);

  const buscarSocio = async (Dni) => {
    try {
      const response = await LeerUsuarioID(Dni);
      if (response && response.socio) {
        setSocio(response.socio);
        setEditedSocio({ ...response.socio });
      } else {
        console.log("Socio no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar socio:", error);
    }
  };
  const actualizarDatosSocio = async () => {
    try {
      const datosActualizados = {
        Nombre: editedSocio.Nombre,
        Apellido_1: editedSocio.Apellido_1,
        Apellido_2: editedSocio.Apellido_2,
        EMail: editedSocio.EMail,
        Dni: editedSocio.Dni,
        Direccion: editedSocio.Direccion,
        Codigo_Postal: editedSocio.Codigo_Postal,
        Provincia: editedSocio.Provincia,
        Municipio: editedSocio.Municipio,
        Vehiculo_1: editedSocio.Vehiculo_1,
        Matricula_1: editedSocio.Matricula_1,
        Vehiculo_2: editedSocio.Vehiculo_2,
        Matricula_2: editedSocio.Matricula_2,
        Telefono_1: editedSocio.Telefono_1,
        Telefono_2: editedSocio.Telefono_2,
      };

      const response = await ActualizarUsuario(datosActualizados);
      console.log(datosActualizados);
      console.log(response.message);
      setIsEditing(false);
      buscarSocio(datosActualizados.Dni);
    } catch (error) {
      console.error("Error al actualizar los datos del socio:", error);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Box style={{height:"95%",width:"100%"}}>
        <Menu />
        <HeaderLogin />
        <Container component="main" sx={{ mt: 2, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography
              sx={{
                fontSize: {
                  xs: "1rem", 
                  sm: "1.2rem",
                  md: "1.4rem", 
                  lg: "1.6rem",
                  marginTop: "2.5rem ",
                },
              }}
              variant="h4"
              gutterBottom
              component="div"
            >
              Información del Socio
            </Typography>
            {socio ? (
              <Box sx={{ my: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">DNI:</Typography>
                    <Typography>{socio.Dni}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Nombre:</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Nombre.trim()}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Nombre: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Nombre.trim()}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Primer Apellido:</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Apellido_1?.trim()}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Apellido_1: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Apellido_1?.trim()}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Segundo Apellido:</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Apellido_2?.trim()}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Apellido_2: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Apellido_2?.trim()}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Dirección:</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Direccion?.trim()}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Direccion: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Direccion?.trim()}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Código Postal:</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Codigo_Postal}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Codigo_Postal: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Codigo_Postal}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Provincia:</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Provincia?.trim()}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Provincia: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Provincia?.trim()}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Municipio:</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Provincia?.trim()}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Municipio: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Municipio?.trim()}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Email:</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.EMail?.trim()}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.EMail?.trim()}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Telefono 1</Typography>
                    {isEditing ? (
                      <TextField
                        type="number"
                        variant="outlined"
                        defaultValue={socio.Telefono_1}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Telefono_1: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Telefono_1}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Telefono 2</Typography>
                    {isEditing ? (
                      <TextField
                        type="number"
                        variant="outlined"
                        defaultValue={socio.Telefono_2}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Telefono_2: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Telefono_2}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Vehículo 1:</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Vehiculo_1?.trim()}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Vehiculo_1: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Vehiculo_1?.trim()}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Matrícula 1</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Matricula_1}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Matricula_1: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Matricula_1}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Vehículo 2</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Vehiculo_2}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Vehiculo_2: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Vehiculo_2}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Matricula 2</Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        defaultValue={socio.Matricula_2}
                        onChange={(e) =>
                          setEditedSocio({
                            ...editedSocio,
                            Matricula_2: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{socio.Matricula_2}</Typography>
                    )}
                  </Grid>
                  {socio.Foto && (
                    <Grid item xs={12}>
                      <img
                        src={renderImage(socio.Foto.data)}
                        alt="Socio"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </Grid>
                  )}
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ backgroundColor: '#7A0505', color: 'white' }}
                  >
                    {isEditing ? "Cancelar" : "Editar"}
                    
                  </Button>
                  {isEditing && (
                    <Button
                      variant="contained"
                      onClick={actualizarDatosSocio}
                      style={{ backgroundColor: '#7A0505', color: 'white' }}
                      disabled={
                        JSON.stringify(socio) === JSON.stringify(editedSocio)
                      }
                      sx={{ ml: 2 }}
                    >
                      Actualizar Datos
                    </Button>
                  )}
                </Box>
              </Box>
            ) : (
              <Typography variant="body1">
                Cargando información del socio...
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
export default DetalleSocio;
