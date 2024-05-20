import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import AuthProvider from "./providers/AuthProvider";
import Login from "./Pages/Login";
import ProximosEventos from "./Pages/Eventos/proximos_eventos";
import InicioSocios from "./Pages/Socios/InicioSocios";
import VisualizarSocios from "./Pages/Socios/VisualizarSocios";
import Contactos from "./Pages/Contactos/Contactos";
import Rutas from "./Pages/Rutas/Rutas";
import Inventario from "./Pages/Inventario/Inventario";
import Cuentas from "./Pages/Cuentas/Cuentas"; 
function App() {

return(
  <AuthProvider>
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="proximos_eventos" element={<ProximosEventos />} />
          <Route exact path="rutas" element={<Rutas />} />
          <Route exact path="inicio_socios" element={<InicioSocios />} />
          <Route exact path="visualizar_socios" element={<VisualizarSocios />} />
          <Route exact path="contactos" element={<Contactos />} />
          <Route exact path="inventario" element={<Inventario />} />
          <Route exact path="cuentas" element={<Cuentas />} />
        </Routes>
      </Router>
    </div>
</AuthProvider>
  )
}
export default App;
