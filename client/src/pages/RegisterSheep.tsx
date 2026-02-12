import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Sparkles } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const RegisterSheep: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        tagId: '',
        breed: '',
        age: '',
        identifyingMarks: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.tagId) return toast.error('Unique Tag ID is required');

        setLoading(true);
        try {
            await api.post('/sheep', formData);
            toast.success('Sheep registered and digital passport generated!');
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 pb-20">
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-text-muted hover:text-primary mb-8 font-bold bg-transparent border-none cursor-pointer transition-colors"
            >
                <ChevronLeft size={20} />
                Return to Herd
            </motion.button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 border-none relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <Sparkles size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Digital Enrollment</h1>
                        <p className="text-text-muted">Create a permanent digital record for your livestock.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Sheep Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Sultan"
                                className="input-field"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <p className="text-xs text-text-muted">Used for easier identification in your list.</p>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Permanent Tag ID *</label>
                            <input
                                type="text"
                                placeholder="e.g. BLG-SHEEP-001"
                                className="input-field border-primary/20 bg-primary/[0.02]"
                                required
                                value={formData.tagId}
                                onChange={e => setFormData({ ...formData, tagId: e.target.value })}
                            />
                            <p className="text-xs text-primary font-medium">Must match the physical ear tag or RFID.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Breed Type</label>
                            <select
                                className="input-field cursor-pointer"
                                value={formData.breed}
                                onChange={e => setFormData({ ...formData, breed: e.target.value })}
                            >
                                <option value="">Select Breed</option>
                                <option value="Deccani">Deccani (Belgaum Special)</option>
                                <option value="Bannur">Bannur</option>
                                <option value="Yelga">Yelga</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Estimated Age (Years)</label>
                            <input
                                type="number"
                                placeholder="2"
                                className="input-field"
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Physical Distinctions</label>
                        <textarea
                            rows={4}
                            placeholder="e.g. Large black spot on right hind leg, notched left ear..."
                            className="input-field resize-none"
                            value={formData.identifyingMarks}
                            onChange={e => setFormData({ ...formData, identifyingMarks: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Save size={24} />
                                    Confirm Enrollment
                                </>
                            )}
                        </button>
                        <p className="text-center mt-4 text-xs text-text-muted">
                            By enrolling, you certify this livestock belongs to your registered Aadhaar identity.
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterSheep;
