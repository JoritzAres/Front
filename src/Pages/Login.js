import React, { useState, useEffect } from "react";
import "../App.css";
import "../login.css";
import HeaderLogin from "../api/layout/headers/HeaderLogin";
import Footer from "../api/layout/footer/Footer";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
  Grid,
} from "@mui/material";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LoginUsuario } from "../api/login";
import logo from "../img/Logo.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
function Login() {
  const [usuario, setUsuario] = useState("");
  const [N_socio, setN_Socio] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleLoginClick = async () => {
    try {
      const datos = { Dni: usuario, paswd: contrasena };
      const response = await LoginUsuario(datos);
      console.log(response);
      setN_Socio(response.N_socio);
      if (response.result && response.result.length > 0) {
        sessionStorage.setItem("DNI", usuario);
        sessionStorage.setItem("N_socio", response.result[0].N_socio);
        console.log(response.result);
        sessionStorage.setItem("Rol", response.result[0].rol);
        navigate("/inicio_socios");
        console.log("Ir a Próximos eventos");
      } else {
        setError("Las credenciales introducidas son incorrectas.");
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Error durante el login: ", error);
      setError("Hubo un problema al intentar iniciar sesión.");
      setOpenDialog(true);
    }
  };

  const theme = createTheme({
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ],
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box style={{ height: "100%", width: "100%" }}>
        <HeaderLogin />
        <Container component="main">
          <div className="login-form">
            {error && (
              <Stack sx={{ width: "90%" }} spacing={2}>
                <Alert severity="error">{error}</Alert>
              </Stack>
            )}
            <Grid container>
              <Grid item xs={12}>
                <h1>LOGIN</h1>
              </Grid>
            </Grid>
            <div
              className="login-background"
              style={{ backgroundImage: `url(${logo})` }}
            ></div>
            <Box>
              <TextField
                margin="normal"
                style={{
                  width: "64%",
                  fontWeight: "bold",
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
                value={usuario}
                id="usuario"
                placeholder="Usuario"
                inputProps={{
                  style: {
                    fontSize: 27,
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: 25,
                    paddingLeft: "8%",
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                }}
                onChange={(e) => {
                  setUsuario(e.target.value);
                  sessionStorage.setItem("usuario", e.target.value);
                }}
                onBlur={(e) => {
                  setUsuario(e.target.value);
                  sessionStorage.setItem("usuario", e.target.value);
                }}
                variant="standard"
                autoFocus
              />
              <TextField
                margin="normal"
                style={{
                  width: "64%",
                  fontWeight: "bold",
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
                value={contrasena}
                id="contrasena"
                type={mostrarContrasena ? "text" : "password"}
                placeholder="Contraseña"
                InputProps={{
                  style: {
                    fontSize: 25,
                    paddingLeft: "8%",
                    textAlign: "center",
                    fontWeight: "bold",
                    justifyContent:"center"
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleMostrarContrasena}
                        onMouseDown={handleMouseDownPassword}
                        edge="center"
                      >
                        {mostrarContrasena ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  setContrasena(e.target.value);
                  sessionStorage.setItem("contrasena", e.target.value);
                }}
                onBlur={(e) => {
                  setContrasena(e.target.value);
                  sessionStorage.setItem("contrasena", e.target.value);
                }}
                variant="standard"
                autoFocus
              />
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box style={{ width: "100%" }}>
                <Button
                  onClick={handleLoginClick}
                  variant="contained"
                  className="common-btn"
                  style={{
                    backgroundColor: "#7A0505",
                    width: "50%",
                    padding: "10px",
                    marginTop: "5%",
                    color: "white"
                  }}
                  >
                  Login
                </Button>
                <Dialog
                  open={openDialog}
                  onClose={() => setOpenDialog(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      ¡Buenos días, {usuario}! Las credecenciales introducidas
                      son incorrectas.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpenDialog(false);
                      }}
                      style={{ backgroundColor: "#7A0505", color: "white" }}
                      autoFocus
                    >
                      Aceptar
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Box>
          </div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
