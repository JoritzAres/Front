import React, { useState, useEffect } from "react";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { LeerUsuarioID } from "../api/login";     

const Menu = () => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [socio, setSocio] = useState(null);

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
        console.log(response.response);
      } else {
        console.log("Socio no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar socio:", error);
    }
  };
  const styles = {
    menuButton: {
      position: "fixed",
      top: "20px",
      left: "20px",
      zIndex: 1000,
      color: "#1a9748",
    },
    drawerPaper: {
      width: isMobile ? "100%" : "250px",
      backgroundColor: "#f4f4f4",
    },
    listItem: {
      "&:hover": {
        backgroundColor: "#b3e0ff",
        color: "#2196F3",
      },
    },
    socioInfo: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      borderBottom: "1px solid #dedede",
      marginBottom: "10px",
    },
    avatar: {
      width: 60,
      height: 60,
      marginBottom: "10px",
    },
  };

  const handleNavBarToggle = () => {
    setIsNavBarOpen(!isNavBarOpen);
  };

  const handleDrawerClose = () => {
    setIsNavBarOpen(false);
  };
  const renderImage = (buffer) => {
    if (buffer && buffer.data) {
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(buffer.data))
      );
      return `data:image/jpeg;base64,${base64String}`;
    }
    return null;
  };
  const pages = [
    { label: "Mi perfil", link: "/inicio_socios" },
    { label: "Próximos Eventos", link: "/proximos_eventos" },
    { label: "Rutas", link: "/rutas" },
    { label: "Inventario", link: "/inventario" },
    { label: "Cuentas", link: "/cuentas" },
  ];
  const rolUsuario = sessionStorage.getItem("Rol");
  if (["1", "2", "3"].includes(rolUsuario)) {
    pages.splice(1, 0, { label: "Socios", link: "/visualizar_socios" });
    pages.splice(1, 0, { label: "Contactos", link: "/contactos" });
     }
  return (
    <>
      <IconButton onClick={handleNavBarToggle} style={styles.menuButton}>
        <MenuIcon fontSize={isMobile ? "default" : "large"} />
      </IconButton>

      <Drawer
        anchor="left"
        open={isNavBarOpen}
        onClose={handleDrawerClose}
        PaperProps={{ sx: styles.drawerPaper }}
      >
        {socio && (
          <Box sx={styles.socioInfo}>
            <Avatar
              src={renderImage(socio?.Foto)}
              sx={styles.avatar}
              style={{ width: "50%", height: "75%" }}
            />
            <Typography variant="body1">{`${socio?.Nombre} ${socio?.Apellido_1}`}</Typography>
            <Typography variant="body2">Nº Socio: {socio?.N_socio}</Typography>
          </Box>
        )}
        <List>
          {pages.map((page) => (
            <ListItem
              button
              key={page.label}
              component={Link}
              to={page.link}
              onClick={handleDrawerClose}
              sx={styles.listItem}
            >
              <ListItemText primary={page.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Menu;
