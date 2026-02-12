import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Calendar, Phone, User, Search } from 'lucide-react';
import api from '../api';
import { motion } from 'framer-motion';

interface StolenSheep {
    _id: string;
    name: string;
    tagId: string;
    breed: string;
    theftReportedAt: string;
    theftDetails: string;
    lastSeenLocation?: string;
    owner: {
        fullName: string;
        phone: string;
    };
}

const StolenList: React.FC = () => {
    const [stolenSheep, setStolenSheep] = useState<StolenSheep[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStolenList = async () => {
            try {
                const res = await api.get('/sheep/public/stolen');
                setStolenSheep(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStolenList();
    }, []);

    const filteredSheep = stolenSheep.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.owner.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                        <AlertTriangle size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">Public Stolen Registry</h1>
                        <p className="text-slate-500 text-lg">Regional livestock theft alerts and active investigations</p>
                    </div>
                </div>

                <div className="relative mt-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Tag ID, Name, or Owner..."
                        className="input-field pl-12 h-14 w-full md:w-96"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-bold">Loading stolen records...</p>
                </div>
            ) : filteredSheep.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active Alerts</h2>
                    <p className="text-slate-500">
                        {searchTerm ? 'No stolen records match your search.' : 'No livestock theft reports in the system.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSheep.map((sheep, i) => (
                        <motion.div
                            key={sheep._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card overflow-hidden border-l-4 border-red-600 hover:shadow-2xl transition-all"
                        >
                            <div className="bg-red-50 p-4 border-b border-red-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="badge badge-danger">STOLEN</span>
                                    <code className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded">
                                        {sheep.tagId}
                                    </code>
                                </div>
                                <h3 className="text-xl font-black text-slate-900">{sheep.name || 'Unnamed'}</h3>
                                <p className="text-sm text-slate-600">{sheep.breed || 'Regional Variety'}</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-2 text-sm">
                                    <Calendar size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-slate-700">Reported</p>
                                        <p className="text-slate-500">{new Date(sheep.theftReportedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {sheep.lastSeenLocation && (
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-slate-700">Last Seen</p>
                                            <p className="text-slate-500">{sheep.lastSeenLocation}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-2 text-sm">
                                    <User size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-slate-700">Owner</p>
                                        <p className="text-slate-500">{sheep.owner.fullName}</p>
                                    </div>
                                </div>

                                {sheep.theftDetails && (
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Details</p>
                                        <p className="text-sm text-slate-600 italic">"{sheep.theftDetails}"</p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-slate-100 flex gap-2">
                                    <a
                                        href={`tel:${sheep.owner.phone}`}
                                        className="flex-1 py-2 bg-primary text-white text-center rounded-lg font-bold text-sm hover:bg-primary-hover transition-colors no-underline flex items-center justify-center gap-2"
                                    >
                                        <Phone size={16} />
                                        Contact
                                    </a>
                                    <Link
                                        to={`/verify/${sheep.tagId}`}
                                        className="flex-1 py-2 bg-slate-100 text-slate-700 text-center rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors no-underline"
                                    >
                                        Verify
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                <h3 className="font-black text-amber-900 mb-2 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Public Safety Notice
                </h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                    If you have information about any of these animals, please contact the owner immediately or report to local authorities.
                    Purchasing stolen livestock is a criminal offense and all transactions are tracked in the digital archive.
                </p>
            </div>
        </div>
    );
};

export default StolenList;
