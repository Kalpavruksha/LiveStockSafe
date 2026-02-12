import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft, AlertTriangle, Share2, CheckCircle2, MapPin, Fingerprint, Calendar, Printer, Shield } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SheepDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sheep, setSheep] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showTheftModal, setShowTheftModal] = useState(false);
    const [theftDetails, setTheftDetails] = useState('');

    useEffect(() => {
        const fetchSheep = async () => {
            try {
                const res = await api.get(`/sheep/${id}`);
                setSheep(res.data);
            } catch (err) {
                toast.error('Identity record not accessible');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchSheep();
    }, [id, navigate]);

    const reportTheft = async () => {
        try {
            // Capture geolocation
            let location = null;
            if (navigator.geolocation) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 5000
                        });
                    });

                    location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
                    };

                    toast.success('Location captured for investigation');
                } catch (geoError) {
                    console.log('Geolocation not available:', geoError);
                }
            }

            const res = await api.patch(`/sheep/${id}/status`, {
                status: 'stolen',
                theftDetails,
                location
            });
            setSheep(res.data);
            setShowTheftModal(false);
            toast.success('🚨 THEFT ALERT ACTIVATED: All nodes notified');
        } catch (err) {
            toast.error('Failed to activate theft protocol');
        }
    };

    const downloadTheftReport = async () => {
        try {
            toast.loading('Generating FIR report...');
            const response = await api.get(`/sheep/${id}/theft-report`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `FIR-${sheep.tagId}-${Date.now()}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);

            toast.dismiss();
            toast.success('Theft report downloaded');
        } catch (err) {
            toast.dismiss();
            toast.error('Failed to generate report');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Fetching Digital ID...</p>
        </div>
    );

    if (!sheep) return <div className="text-center py-20 text-slate-500">No record found.</div>;

    const verificationUrl = `${window.location.origin}/verify/${sheep.tagId}`;

    return (
        <div className="max-w-6xl mx-auto px-4 pb-20">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-primary mb-8 bg-transparent border-none cursor-pointer font-bold transition-all"
            >
                <ChevronLeft size={24} />
                Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Identity Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-4 glass-card p-10 text-center sticky top-28 border-2 border-primary/5"
                >
                    <div className="flex justify-center mb-6">
                        <div className="bg-white p-4 rounded-3xl shadow-inner border border-slate-100">
                            <QRCodeSVG
                                value={verificationUrl}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mb-2">Digital Identity</h2>
                    <div className="bg-primary/5 px-4 py-2 rounded-full inline-flex items-center gap-2 mb-8">
                        <Fingerprint size={16} className="text-primary" />
                        <span className="font-mono font-bold text-primary">{sheep.tagId}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(verificationUrl);
                                toast.success('Identity link copied!');
                            }}
                            className="btn-primary w-full flex items-center justify-center gap-3"
                        >
                            <Share2 size={20} />
                            Share Verification
                        </button>
                        <button className="flex items-center justify-center gap-3 py-3 text-slate-400 font-bold hover:text-slate-600 transition-all bg-transparent border-none cursor-pointer">
                            <Printer size={18} />
                            Print Identity Tag
                        </button>
                    </div>
                </motion.div>

                {/* Details Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-8 space-y-8"
                >
                    <div className="glass-card p-8 md:p-10 border-none">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-10 border-b border-slate-50">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 mb-2">{sheep.name || 'Unnamed Rec'}</h1>
                                <div className="flex flex-wrap gap-4 text-slate-400">
                                    <span className="flex items-center gap-1.5 text-sm font-bold">
                                        <Calendar size={16} /> Enrolled {new Date(sheep.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm font-bold">
                                        <MapPin size={16} /> Regional Hub
                                    </span>
                                </div>
                            </div>
                            <div className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest ${sheep.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                {sheep.status === 'active' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                                {sheep.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Animal Breed</p>
                                <p className="text-xl font-bold text-slate-800">{sheep.breed || 'Regional'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Age</p>
                                <p className="text-xl font-bold text-slate-800">{sheep.age ? `${sheep.age} Years` : 'Not Set'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blockchain</p>
                                <p className="text-xl font-bold text-emerald-500">Sync Active</p>
                            </div>
                        </div>

                        <div className="mb-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Distinguishing Physical Records</p>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic font-medium text-slate-600 text-lg leading-relaxed">
                                "{sheep.identifyingMarks || 'No specific physical distortions or scars were recorded during the initial digital enrollment.'}"
                            </div>
                        </div>

                        {sheep.status === 'active' ? (
                            <button
                                onClick={() => setShowTheftModal(true)}
                                className="w-full py-5 bg-red-50 text-red-600 border-2 border-dashed border-red-200 rounded-3xl font-black text-lg hover:bg-red-100 transition-all flex items-center justify-center gap-3 cursor-pointer"
                            >
                                <AlertTriangle size={24} />
                                ACTIVATE THEFT PROTOCOL
                            </button>
                        ) : (
                            <div className="p-8 bg-red-600 rounded-3xl text-white shadow-2xl shadow-red-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle size={32} />
                                    <h3 className="text-2xl font-black">THEFT ALERT BROADCASTED</h3>
                                </div>
                                <p className="text-red-100 font-bold mb-6">
                                    Broadcasted on {new Date(sheep.theftReportedAt).toLocaleString()}
                                </p>
                                <div className="bg-black/10 p-4 rounded-2xl border border-white/20 mb-6">
                                    <p className="text-xs font-black uppercase mb-1 opacity-70">Case Details:</p>
                                    <p className="italic font-medium leading-relaxed">"{sheep.theftDetails}"</p>
                                </div>
                                <button
                                    onClick={downloadTheftReport}
                                    className="w-full py-4 bg-white text-red-600 rounded-2xl font-black hover:bg-red-50 transition-all border-none cursor-pointer flex items-center justify-center gap-3"
                                >
                                    <Printer size={20} />
                                    Download FIR Report (PDF)
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="glass-card p-10 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                            <Shield size={24} className="text-primary" />
                            Ownership Protection Active
                        </h3>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            This record is cryptographically linked to your verified identity. Illegal transfers are automatically
                            flagged across the Regional Livestock Grid.
                        </p>
                        <div className="font-mono text-[10px] text-slate-500 bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                            <span className="truncate">CID: {sheep._id.toUpperCase()}A8X</span>
                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded ml-4 font-bold">SECURED</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Theft Modal */}
            <AnimatePresence>
                {showTheftModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass-card max-w-xl w-full p-10 bg-white border-none shadow-2xl"
                        >
                            <h2 className="text-3xl font-black text-slate-900 mb-4 flex items-center gap-3">
                                <AlertTriangle className="text-red-600" size={36} />
                                Report Theft
                            </h2>
                            <p className="text-slate-500 font-bold text-lg mb-8">
                                Confirming this will alert all nearby buyers and police nodes.
                            </p>

                            <textarea
                                className="input-field mb-8 h-40 resize-none text-lg"
                                placeholder="Describe the incident details..."
                                value={theftDetails}
                                onChange={e => setTheftDetails(e.target.value)}
                            />

                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={() => setShowTheftModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all border-none cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={reportTheft}
                                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all border-none cursor-pointer shadow-xl shadow-red-200"
                                >
                                    Broadcast Alert
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SheepDetails;
