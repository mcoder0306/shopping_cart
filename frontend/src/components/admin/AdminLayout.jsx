import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect, useCallback, useState } from 'react';
import { api } from '../../utils/api';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

function AdminLayout() {
    const isLoggedin = useSelector(state => state.auth.isLoggedin);
    const user = useSelector(state => state.auth.user);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/dashboard/getDashboardData");
            if (res.status === 200) {
                setDashboardData(res.data.data);
            }
        } catch (error) {
            console.error("Layout data fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoggedin && user?.isAdmin) {
            fetchDashboardData();
        }
    }, [isLoggedin, user, fetchDashboardData]);

    // Strict protection: Only admins can view the dashboard
    if (!isLoggedin || !user?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="h-screen bg-[#060b14] flex overflow-hidden">
            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full transition-all duration-300 overflow-hidden">
                <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto flex flex-col min-w-0 w-full custom-scrollbar">
                    <div className="max-w-7xl mx-auto w-full flex flex-col min-w-0 flex-1">
                        <div className="flex-1 min-w-0 w-full">
                            <Outlet context={{ dashboardData, isLoading, refreshDashboard: fetchDashboardData }} />
                        </div>
                    </div>
                </main>
                {/* <Footer /> */}
            </div>
        </div>
    );
}

export default AdminLayout;
