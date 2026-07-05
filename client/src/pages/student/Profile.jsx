import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import TagInput from '../../components/shared/TagInput';
import { cn } from '../../lib/utils';

const STEPS = [
  { id: 'personal', title: 'Personal Details' },
  { id: 'academics', title: 'Academics' },
  { id: 'skills', title: 'Skills & Certs' },
  { id: 'projects', title: 'Projects & Research' },
  { id: 'experience', title: 'Experience' },
  { id: 'interests', title: 'Interests & Goals' },
];

const AVAILABLE_CATEGORIES = [
  'First-Generation Student',
  'Women in Tech',
  'Underrepresented Groups',
  'International Student'
];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [profile, setProfile] = useState({
    university: '',
    yearOfStudy: '',
    gpa: '',
    fieldOfStudy: '',
    skills: [],
    certifications: [],
    careerInterests: [],
    categories: [],
    hasInternship: false,
    hasHackathon: false,
    hasResearch: false,
    hasLeadership: false,
    hasVolunteering: false,
    hasOpenSource: false,
    projectCount: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/students/profile');
        if (res.data.profile) {
          setProfile(prev => ({
            ...prev,
            ...res.data.profile,
            categories: res.data.profile.categories || []
          }));
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await api.put('/students/profile', profile);
      setProfile(prev => ({
        ...prev,
        ...res.data.profile
      }));
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
      
      if (currentStep === STEPS.length - 1) {
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (error) {
      console.error('Save error', error);
      setSaveMessage('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    handleSave();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const toggleCategory = (cat) => {
    setProfile(prev => {
      const exists = prev.categories.includes(cat);
      const newCats = exists 
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: newCats };
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-[#06d6a0]" size={32} /></div>;
  }

  const renderStep = () => {
    switch(currentStep) {
      case 0: return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input type="text" disabled className="w-full bg-[#0d1117]/50 border border-slate-800 rounded-lg py-2.5 px-4 text-slate-500 cursor-not-allowed"
              value={user?.name} />
            <p className="text-xs text-slate-600 mt-1">To change your name, please contact support.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Demographic Filters (Select all that apply)</label>
            <p className="text-xs text-slate-500 mb-4">Many scholarships target specific demographic profiles. Choosing these increases your matches.</p>
            <div className="flex flex-wrap gap-3">
              {AVAILABLE_CATEGORIES.map(cat => {
                const isSelected = profile.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                      isSelected 
                        ? "bg-[#06d6a0]/10 border-[#06d6a0] text-[#06d6a0] shadow-[0_0_15px_rgba(6,214,160,0.1)]"
                        : "bg-[#0d1117] border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      );
      case 1: return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">University / College</label>
              <input type="text" className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0]"
                value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} placeholder="e.g. Stanford University" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Year of Study</label>
              <select className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0] appearance-none"
                value={profile.yearOfStudy} onChange={e => setProfile({...profile, yearOfStudy: e.target.value})}>
                <option value="">Select Year...</option>
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Field of Study / Major</label>
              <input type="text" className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0]"
                value={profile.fieldOfStudy} onChange={e => setProfile({...profile, fieldOfStudy: e.target.value})} placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current GPA (out of 4.0)</label>
              <input type="number" step="0.1" min="0" max="4.0" className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0]"
                value={profile.gpa} onChange={e => setProfile({...profile, gpa: e.target.value})} placeholder="3.8" />
            </div>
          </div>
        </motion.div>
      );
      case 2: return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Technical Skills</label>
            <p className="text-xs text-slate-500 mb-2">Type a skill and press Enter.</p>
            <TagInput tags={profile.skills} setTags={t => setProfile({...profile, skills: t})} placeholder="e.g. Python, React, Data Analysis" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Certifications</label>
            <p className="text-xs text-slate-500 mb-2">Any relevant professional certifications.</p>
            <TagInput tags={profile.certifications} setTags={t => setProfile({...profile, certifications: t})} placeholder="e.g. AWS Solutions Architect" />
          </div>
        </motion.div>
      );
      case 3: return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Number of Completed Projects</label>
            <p className="text-xs text-slate-500 mb-2">How many software/academic projects have you completed?</p>
            <input type="number" min="0" className="w-full md:w-1/3 bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0]"
              value={profile.projectCount} onChange={e => setProfile({...profile, projectCount: parseInt(e.target.value) || 0})} />
          </div>
          <div className="p-4 bg-[#0d1117] border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-semibold text-slate-300 text-sm">💡 Project Highlight Tips</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Scholarships targeting developers value hands-on experience. Make sure to document your projects in your resume/CV for validation.
            </p>
          </div>
        </motion.div>
      );
      case 4: return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <label className="block text-sm font-medium text-slate-300 mb-1">Experiences & Activities</label>
          <p className="text-xs text-slate-500 mb-4">Toggle the experiences you have participated in.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'hasInternship', label: 'Internship Experience', icon: '💼' },
              { key: 'hasHackathon', label: 'Hackathon Participation', icon: '🏆' },
              { key: 'hasResearch', label: 'Research Experience', icon: '🔬' },
              { key: 'hasOpenSource', label: 'Open Source Contributions', icon: '🐙' },
            ].map(item => (
              <label key={item.key} className={cn(
                "flex items-center p-4 border rounded-xl cursor-pointer transition-all",
                profile[item.key] ? "bg-[#06d6a0]/10 border-[#06d6a0] shadow-[0_0_15px_rgba(6,214,160,0.1)]" : "bg-[#0d1117] border-slate-700/50 hover:border-slate-600"
              )}>
                <input type="checkbox" className="hidden" checked={profile[item.key]} onChange={e => setProfile({...profile, [item.key]: e.target.checked})} />
                <div className={cn("w-6 h-6 rounded mr-3 flex items-center justify-center border transition-colors", profile[item.key] ? "bg-[#06d6a0] border-[#06d6a0]" : "bg-transparent border-slate-600")}>
                  {profile[item.key] && <CheckCircle size={16} className="text-[#06080f]" />}
                </div>
                <div>
                  <div className="font-medium text-slate-200">{item.icon} {item.label}</div>
                </div>
              </label>
            ))}
          </div>
        </motion.div>
      );
      case 5: return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'hasLeadership', label: 'Leadership Roles', icon: '👑' },
              { key: 'hasVolunteering', label: 'Volunteering & Community Service', icon: '🤝' },
            ].map(item => (
              <label key={item.key} className={cn(
                "flex items-center p-4 border rounded-xl cursor-pointer transition-all",
                profile[item.key] ? "bg-[#06d6a0]/10 border-[#06d6a0] shadow-[0_0_15px_rgba(6,214,160,0.1)]" : "bg-[#0d1117] border-slate-700/50 hover:border-slate-600"
              )}>
                <input type="checkbox" className="hidden" checked={profile[item.key]} onChange={e => setProfile({...profile, [item.key]: e.target.checked})} />
                <div className={cn("w-6 h-6 rounded mr-3 flex items-center justify-center border transition-colors", profile[item.key] ? "bg-[#06d6a0] border-[#06d6a0]" : "bg-transparent border-slate-600")}>
                  {profile[item.key] && <CheckCircle size={16} className="text-[#06080f]" />}
                </div>
                <div>
                  <div className="font-medium text-slate-200">{item.icon} {item.label}</div>
                </div>
              </label>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Career Interests</label>
            <p className="text-xs text-slate-500 mb-2">What fields are you aiming to work in?</p>
            <TagInput tags={profile.careerInterests} setTags={t => setProfile({...profile, careerInterests: t})} placeholder="e.g. Artificial Intelligence, Web Development" />
          </div>
        </motion.div>
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Profile Builder</h1>
        <p className="text-slate-400">Complete your profile to get personalized AI scholarship matches.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between relative mb-8">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800 -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
        
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <button 
              type="button"
              onClick={() => index < currentStep && setCurrentStep(index)}
              disabled={index > currentStep}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors shadow-lg disabled:cursor-not-allowed",
                index < currentStep ? "bg-[#06d6a0] text-[#06080f] cursor-pointer" : 
                index === currentStep ? "bg-gradient-to-br from-[#06d6a0] to-[#4cc9f0] text-[#06080f]" : 
                "bg-[#161b22] border-2 border-slate-800 text-slate-500"
              )}
            >
              {index < currentStep ? <CheckCircle size={20} /> : index + 1}
            </button>
            <span className={cn(
              "absolute -bottom-6 text-[10px] md:text-xs font-medium whitespace-nowrap hidden sm:inline",
              index <= currentStep ? "text-slate-200" : "text-slate-500"
            )}>{step.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 lg:p-10 min-h-[400px] flex flex-col">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800">
          <button 
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          >
            <ChevronLeft size={18} /> Back
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#06d6a0] transition-opacity duration-300" style={{ opacity: saveMessage ? 1 : 0 }}>
              {saveMessage}
            </span>
            
            <button 
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 text-slate-300 bg-[#0d1117] border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Draft
            </button>
            
            <button 
              type="button"
              onClick={currentStep === STEPS.length - 1 ? handleSave : nextStep}
              className="px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] text-[#06080f] hover:shadow-[0_0_15px_rgba(6,214,160,0.4)] transition-all"
            >
              {currentStep === STEPS.length - 1 ? 'Finish Profile' : 'Next Step'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
