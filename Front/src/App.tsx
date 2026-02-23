import { Route, Routes } from "react-router-dom";

import Layout from "./layouts/layout";
import Home from "./pages/Home/Home";
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
import MovimientosPage from "./pages/Bodega/Movimientos";
import MateriasPrimasPage from "./pages/Bodega/MateriasPrimas";


function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />} path="/">
          <Route index element={<Home />} />
          <Route element={<Perfil />} path="perfil" />
          <Route element={<UsersTable />} path="admin/usuarios" />
          <Route element={<RolTable />} path="admin/roles" />
          <Route element={<AccesoPage />} path="admin/acceso" />
          <Route element={<UnidadTable />} path="bodega/unidades-medida" />
          <Route element={<LotesPage />} path="bodega/lotes" />
          <Route element={<UnidadesPage />} path="bodega/unidades" />
          <Route element={<MovimientosPage />} path="bodega/movimientos" />
          <Route element={<MateriasPrimasPage />} path="bodega/materias-primas" />
          <Route
            element={<CaracteristicasTable />}
            path="bodega/caracteristicas"
          />

          <Route element={<Inventario />} path="bodega/inventario/" />
        </Route>
      </Route>

      <Route element={<Login />} path="/login" />
      <Route element={<ForgotPassword />} path="/forgotPass" />
      <Route element={<ResetPassword />} path="/reset-password" />
      <Route element={<Perfil />} path="/perfil" />
    </Routes>
  );
}

export default App;
