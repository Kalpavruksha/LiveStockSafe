import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { phone, password });
            login(res.data.token, res.data.user);
            toast.success('Secure session established');
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Unauthorized access');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-12 bg-white border-2 border-slate-50 shadow-2xl"
            >
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck size={36} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Herder Portal</h1>
                    <p className="text-text-muted font-medium">Securely access your regional herd records.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                            <input
                                type="tel"
                                placeholder="Enter 10-digit mobile"
                                className="input-field pl-12 h-14"
                                required
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Digital Signature (Password)</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input-field pl-12 h-14"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg font-black shadow-xl shadow-primary/20"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Confirm Identity
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                    <p className="text-text-muted font-medium mb-1">
                        New to the digital system?
                    </p>
                    <Link to="/register" className="text-primary font-black no-underline hover:underline text-lg">
                        Create Verified Account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
