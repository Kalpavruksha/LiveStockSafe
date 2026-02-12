import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { Phone, Lock, User, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        aadhaar: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/register', formData);
            login(res.data.token, res.data.user);
            toast.success('KYC Identity Verified & Registered!');
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 bg-white border-2 border-slate-50 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck size={36} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-3">Herder Onboarding</h1>
                    <p className="text-text-muted font-medium">Link your Aadhaar to the regional livestock network.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Full Legal Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                            <input
                                type="text"
                                placeholder="As per Government Records"
                                className="input-field pl-12 h-14"
                                required
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Verified Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    type="tel"
                                    placeholder="98XXXXXXXX"
                                    className="input-field pl-12 h-14"
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Aadhaar ID</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    type="text"
                                    placeholder="XXXX-XXXX-XXXX"
                                    className="input-field pl-12 h-14"
                                    required
                                    value={formData.aadhaar}
                                    onChange={e => setFormData({ ...formData, aadhaar: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Portal Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                            <input
                                type="password"
                                placeholder="Choose a strong password"
                                className="input-field pl-12 h-14"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-xl font-black shadow-xl shadow-primary/20"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Complete Registration
                                <ArrowRight size={24} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <p className="text-text-muted font-medium mb-1">Already registered?</p>
                    <Link to="/login" className="text-primary font-black no-underline hover:underline text-lg">Sign In to Dashboard</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
