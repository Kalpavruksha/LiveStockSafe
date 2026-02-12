import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Phone, User, Fingerprint, MapPin, AlertCircle } from 'lucide-react';
import api from '../api';
import { motion } from 'framer-motion';

const VerifySheep: React.FC = () => {
    const { tagId } = useParams();
    const [sheep, setSheep] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchVerification = async () => {
            try {
                const res = await api.get(`/sheep/verify/${tagId}`);
                setSheep(res.data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchVerification();
    }, [tagId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-text-muted font-bold">Verifying Digital Signature...</p>
        </div>
    );

    if (error || !sheep) return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-12 bg-white shadow-2xl"
            >
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShieldAlert size={48} />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-4">Unrecognized ID</h1>
                <p className="text-text-muted text-lg mb-10 leading-relaxed font-medium">
                    This livestock tag (<span className="text-red-600 font-bold">{tagId}</span>) is not registered in the
                    Regional Livestock Archive. This may indicate an unofficial or fraudulent tag.
                </p>
                <div className="flex flex-col gap-4">
                    <Link to="/" className="btn-primary no-underline block py-4 text-lg">Report Fraudulent Tag</Link>
                    <Link to="/login" className="text-slate-500 font-bold no-underline hover:text-slate-800">Return to Home</Link>
                </div>
            </motion.div>
        </div>
    );

    const isStolen = sheep.status === 'stolen';

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`glass-card overflow-hidden bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border-t-8 ${isStolen ? 'border-red-600' : 'border-emerald-500'}`}
            >
                {/* Status Header */}
                <div className={`p-12 text-center ${isStolen ? 'bg-red-50' : 'bg-emerald-50'}`}>
                    <div className="flex justify-center mb-6">
                        {isStolen ? (
                            <div className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center animate-pulse shadow-2xl shadow-red-200">
                                <ShieldAlert size={56} />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-100">
                                <ShieldCheck size={56} />
                            </div>
                        )}
                    </div>
                    <h1 className={`text-5xl font-black mb-4 ${isStolen ? 'text-red-600' : 'text-emerald-600'}`}>
                        {isStolen ? 'STOLEN ALERT' : 'ID VERIFIED'}
                    </h1>
                    <p className={`text-xl font-bold max-w-md mx-auto leading-relaxed ${isStolen ? 'text-red-500' : 'text-emerald-500'}`}>
                        {isStolen
                            ? 'This animal has a reported theft warrant. DO NOT PURCHASE.'
                            : 'Digital link confirmed. Ownership records are valid and active.'}
                    </p>
                </div>

                <div className="p-10 space-y-12">
                    {/* Main Info */}
                    <section>
                        <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
                            <Fingerprint className="text-primary" size={24} />
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Digital Registry Record</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Permanent Tag ID</p>
                                <p className="text-2xl font-mono font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 inline-block">{sheep.tagId}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Registered Date</p>
                                <p className="text-2xl font-bold text-slate-800">{new Date(sheep.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Animal Breed</p>
                                <p className="text-2xl font-bold text-slate-800">{sheep.breed || 'Regional Variety'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Verification Status</p>
                                <p className={`text-2xl font-bold flex items-center gap-2 ${isStolen ? 'text-red-600' : 'text-emerald-500'}`}>
                                    {isStolen ? 'Flagged/Stolen' : 'Clear/Verified'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-3">Distinguishing Physical Marks</p>
                            <p className="text-lg italic text-slate-600 leading-relaxed font-medium">"{sheep.identifyingMarks || 'No specific marks recorded during initial digital enrollment.'}"</p>
                        </div>
                    </section>

                    {/* Owner Details */}
                    <section className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <ShieldCheck size={120} />
                        </div>
                        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                            <User className="text-primary" size={24} />
                            <h3 className="text-lg font-black uppercase tracking-widest">Certified Ownership Detail</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Registered Owner</p>
                                <p className="text-2xl font-bold flex items-center gap-2">
                                    {sheep.owner.fullName}
                                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">KYC Verified</span>
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Region Node</p>
                                <p className="text-2xl font-bold flex items-center gap-2">
                                    <MapPin size={20} className="text-primary" /> Belgaum, KA
                                </p>
                            </div>
                        </div>

                        {isStolen ? (
                            <div className="mt-12 space-y-4">
                                <p className="text-red-400 font-bold mb-4 flex items-center gap-2">
                                    <AlertCircle size={20} /> DO NOT ENGAGE WITH RE-SELLER
                                </p>
                                <button
                                    className="w-full py-5 bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-red-900/50 hover:bg-red-700 transition-all border-none cursor-pointer text-xl flex items-center justify-center gap-3"
                                    onClick={() => window.location.href = `tel:${sheep.owner.phone}`}
                                >
                                    <Phone size={24} />
                                    CONTACT OWNER & POLICE
                                </button>
                            </div>
                        ) : (
                            <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/5">
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    This transaction receipt is hashed on our tamper-proof ledger.
                                    Buying this animal is legally protected as ownership is clear.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </motion.div>

            <div className="text-center mt-12 space-y-2">
                <p className="text-text-muted text-sm font-mono opacity-50">
                    BLOCK_ID: {sheep._id.toUpperCase()}
                </p>
                <p className="text-text-muted text-xs uppercase tracking-tighter opacity-30">
                    LivestockSafe Digital Identity Node v1.0.4
                </p>
            </div>
        </div>
    );
};

export default VerifySheep;
