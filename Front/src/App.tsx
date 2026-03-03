import { Route, Routes } from "react-router-dom";

import Layout from "./layouts/layout";
import { Inventario } from "./pages/Bodega/Inventarios";
import Login from "./pages/Login";
import UsersTable from "./pages/Admin/usuarios";
import { RolTable } from "./pages/Admin/Roles";
import { UnidadTable } from "./pages/Bodega/UnidadesMedida";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import { CaracteristicasTable } from "./pages/Bodega/Caracteristicas";
import ResetPassword from "./pages/ResetPassword";
import Perfil from "./pages/Perfil";
import { AccesoPage } from "./pages/Admin/Acceso";
import LotesPage from "./pages/Bodega/Lotes";
import UnidadesPage from "./pages/Bodega/Unidades";
import { MovimientosPage } from "./pages/Bodega/Movimientos";
import MateriasPrimasPage from "./pages/Bodega/MateriasPrimas";
import { IngresosEgresosPage } from "./pages/Bodega/IngresosEgresos";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          
          {/* Ruta principal */}
          <Route index element={<MovimientosPage />} />

          <Route path="perfil" element={<Perfil />} />
          <Route path="admin/usuarios" element={<UsersTable />} />
          <Route path="admin/roles" element={<RolTable />} />
          <Route path="admin/acceso" element={<AccesoPage />} />
          <Route path="admin/ingresos-egresos" element={<IngresosEgresosPage />} />
          <Route path="admin/ingresos" element={<MovimientosPage />} />
          <Route path="admin/egresos" element={<MovimientosPage />} />

          <Route path="bodega/unidades-medida" element={<UnidadTable />} />
          <Route path="bodega/lotes" element={<LotesPage />} />
          <Route path="bodega/unidades" element={<UnidadesPage />} />
          <Route path="bodega/materias-primas" element={<MateriasPrimasPage />} />
          <Route path="bodega/caracteristicas" element={<CaracteristicasTable />} />
          <Route path="bodega/inventario" element={<Inventario />} />

        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/forgotPass" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  );
}

export default App;
