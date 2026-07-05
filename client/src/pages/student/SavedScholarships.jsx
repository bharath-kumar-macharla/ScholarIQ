import { useState, useEffect } from 'react';
import api from '../../lib/api';
import ScholarshipCard from '../../components/scholarships/ScholarshipCard';
import { Loader2, BookmarkX } from 'lucide-react';

export default function SavedScholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        // Instead of a dedicated saved route, we fetch all scholarships and filter locally for now.
        // In a real app, you'd have a GET /api/scholarships/saved route.
        const res = await api.get('/scholarships');
        setScholarships(res.data.scholarships.filter(s => s.isSaved));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleSaveToggle = (id, isSaved) => {
    if (!isSaved) {
      setScholarships(prev => prev.filter(s => s._id !== id));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#06d6a0]" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Saved Scholarships</h1>
        <p className="text-slate-400">Keep track of the opportunities you're interested in.</p>
      </div>

      {scholarships.length === 0 ? (
        <div className="text-center py-20 bg-[#161b22]/80 border border-slate-700/50 rounded-2xl flex flex-col items-center">
          <BookmarkX className="text-slate-600 mb-4" size={48} />
          <h3 className="text-lg font-medium text-white mb-2">No saved scholarships</h3>
          <p className="text-slate-400 max-w-md">You haven't bookmarked any scholarships yet. Browse the discover page to find matches.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map(scholarship => (
            <ScholarshipCard key={scholarship._id} scholarship={scholarship} onSaveToggle={handleSaveToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
