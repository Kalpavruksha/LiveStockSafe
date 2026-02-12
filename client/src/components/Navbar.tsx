import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User as UserIcon, LayoutDashboard, PlusCircle } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-card mt-6 mb-8 mx-4 p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/70 backdrop-blur-md sticky top-6 z-40 border-white/50">
            <Link to="/" className="flex items-center gap-3 no-underline text-slate-900 group">
                <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Shield className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight">LivestockSafe</span>
            </Link>

            {user ? (
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <div className="flex gap-6">
                        <Link to="/" className="text-slate-600 hover:text-primary no-underline text-sm font-semibold flex items-center gap-2">
                            <LayoutDashboard size={18} /> <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                        <Link to="/register-sheep" className="text-slate-600 hover:text-primary no-underline text-sm font-semibold flex items-center gap-2">
                            <PlusCircle size={18} /> <span className="hidden sm:inline">Enroll</span>
                        </Link>
                        <Link to="/stolen" className="text-red-600 hover:text-red-700 no-underline text-sm font-semibold flex items-center gap-2">
                            <Shield size={18} /> <span className="hidden sm:inline">Stolen</span>
                        </Link>
                    </div>

                    <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <UserIcon size={14} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{user.fullName.split(' ')[0]}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-danger hover:bg-red-50 rounded-full transition-colors border-none bg-transparent cursor-pointer flex items-center gap-1"
                            title="Logout"
                        >
                            <LogOut size={20} />
                            <span className="text-xs font-bold md:hidden">Logout</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4">
                    <Link to="/login" className="no-underline text-slate-600 font-semibold px-4 py-2 hover:text-primary transition-colors">Login</Link>
                    <Link to="/register" className="btn-primary no-underline text-sm py-2 px-6">Get Started</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
