import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import LocationsPage from '../pages/LocationsPage';
import EmployeesPage from '../pages/EmployeesPage';
import ProductsPage from '../pages/ProductsPage';
import HaircutsPage from '../pages/HaircutsPage';
import Layout from '../components/layout/Layout';
import {JSX, useEffect, useState} from 'react';

// Componente de ruta protegida
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AppRoutes = () => {
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Verificar autenticación al cargar rutas
        // En una implementación real, aquí podrías validar tokens JWT, etc.
        setTimeout(() => setIsChecking(false), 300);
    }, []);

    if (isChecking) {
        return null; // o un componente de carga
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<LoginPage />} />

                {/* Rutas protegidas */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout>
                            <DashboardPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout>
                            <DashboardPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/locations" element={
                    <ProtectedRoute>
                        <Layout>
                            <LocationsPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/employees" element={
                    <ProtectedRoute>
                        <Layout>
                            <EmployeesPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/products" element={
                    <ProtectedRoute>
                        <Layout>
                            <ProductsPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/haircuts" element={
                    <ProtectedRoute>
                        <Layout>
                            <HaircutsPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                {/* Redirigir rutas desconocidas al dashboard si está autenticado */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;