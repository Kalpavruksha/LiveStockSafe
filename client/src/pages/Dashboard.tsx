import React, { useEffect, useState } from 'react';
import { Plus, Search, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';

interface Sheep {
    _id: string;
    name: string;
    tagId: string;
    breed: string;
    status: 'active' | 'stolen' | 'sold' | 'deceased';
    createdAt: string;
}

const Dashboard: React.FC = () => {
    const [sheep, setSheep] = useState<Sheep[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSheep = async () => {
            try {
                const res = await api.get('/sheep');
                setSheep(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSheep();
    }, []);

    const filteredSheep = sheep.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tagId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: sheep.length,
        active: sheep.filter(s => s.status === 'active').length,
        stolen: sheep.filter(s => s.status === 'stolen').length
    };

    return (
        <div className="px-4 pb-12 w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">My Herd Overview</h1>
                    <p className="text-slate-500 text-lg">Manage your livestock digital IDs and track security status.</p>
                </div>
                <Link to="/register-sheep" className="btn-primary inline-flex items-center gap-2 whitespace-nowrap">
                    <Plus size={20} />
                    Register New Sheep
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: 'Total Herd', value: stats.total, icon: CheckCircle2, color: 'text-primary', bg: 'bg-indigo-50' },
                    { label: 'Safely Grazing', value: stats.active, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-emerald-50' },
                    { label: 'Missing / Stolen', value: stats.stolen, icon: AlertCircle, color: 'text-danger', bg: 'bg-red-50' },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass-card p-6 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={28} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search & List */}
            <div className="glass-card overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">Inventory Records</h2>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search ID or Name..."
                            className="input-field pl-12 h-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Sheep Identity</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Unique ID</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Breed</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 animate-pulse font-bold">Accessing Records...</td></tr>
                            ) : filteredSheep.length === 0 ? (
                                <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400">No sheep records found.</td></tr>
                            ) : filteredSheep.map((s) => (
                                <tr
                                    key={s._id}
                                    className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                                    onClick={() => window.location.href = `/sheep/${s._id}`}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                                                {s.name ? s.name[0].toUpperCase() : 'S'}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-900">{s.name || 'Unnamed'}</span>
                                                <span className="text-[10px] text-slate-400 font-bold">Added {new Date(s.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <code className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{s.tagId}</code>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{s.breed || 'N/A'}</td>
                                    <td className="px-8 py-6">
                                        <span className={`badge ${s.status === 'active' ? 'badge-success' :
                                                s.status === 'stolen' ? 'badge-danger' :
                                                    'badge-info'
                                            }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="inline-flex p-2 text-primary hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100 shadow-sm">
                                            <ArrowUpRight size={18} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
