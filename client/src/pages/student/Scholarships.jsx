import { useState, useEffect } from 'react';
import api from '../../lib/api';
import ScholarshipCard from '../../components/scholarships/ScholarshipCard';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      let query = '';
      if (searchTerm) query += `search=${searchTerm}&`;
      if (category) query += `category=${category}`;
      
      const res = await api.get(`/scholarships?${query}`);
      setScholarships(res.data.scholarships);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchScholarships();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Discover Scholarships</h1>
          <p className="text-slate-400">Browse opportunities customized for your profile.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, tags, or keywords..." 
            className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-slate-500" size={18} />
          <select 
            className="bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0] appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Merit-based">Merit-based</option>
            <option value="Need-based">Need-based</option>
            <option value="Research">Research</option>
            <option value="Achievement-based">Achievement-based</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[#06d6a0]" size={32} />
        </div>
      ) : scholarships.length === 0 ? (
        <div className="text-center py-20 bg-[#161b22]/80 border border-slate-700/50 rounded-2xl">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-white mb-2">No scholarships found</h3>
          <p className="text-slate-400">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map(scholarship => (
            <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
          ))}
        </div>
      )}
    </div>
  );
}
