import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import ProtectedRoute from "./components/protectedRoute";
import "./App.css";
import Register from "./pages/register";
import Welcome from "./pages/welcome";
import Team from "./pages/team";
import Mercedes from "./pages/participantes/mercedes";
import Sauber from "./pages/participantes/sauber";
import Ferrari from "./pages/participantes/ferrari";
import McLaren from "./pages/participantes/mclaren";
import RedBull from "./pages/participantes/redbull";
import DesafioAtual from "./pages/desafioatual";
import HistoricoDesafios from "./pages/historico";
import AdminDashboard from "./pages/admin/admin";
import AlterarPontuacoes from "./pages/admin/alterarpontos";
import Desafios from "./pages/desafios";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<Welcome />}></Route>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/desafio-atual"
          element={
            <ProtectedRoute>
              <DesafioAtual />
            </ProtectedRoute>
          }
        />

        <Route
          path="/historico-desafios"
          element={
            <ProtectedRoute>
              <HistoricoDesafios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/desafios"
          element={
            <ProtectedRoute>
              <Desafios></Desafios>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard></AdminDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/alterar-pontuacoes"
          element={
            <ProtectedRoute>
              <AlterarPontuacoes></AlterarPontuacoes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/participantes/mercedes"
          element={
            <ProtectedRoute>
              <Mercedes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/participantes/mclaren"
          element={
            <ProtectedRoute>
              <McLaren />
            </ProtectedRoute>
          }
        />

        <Route
          path="/participantes/ferrari"
          element={
            <ProtectedRoute>
              <Ferrari />
            </ProtectedRoute>
          }
        />

        <Route
          path="/participantes/redbull"
          element={
            <ProtectedRoute>
              <RedBull />
            </ProtectedRoute>
          }
        />

        <Route
          path="/participantes/sauber"
          element={
            <ProtectedRoute>
              <Sauber />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipe"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
