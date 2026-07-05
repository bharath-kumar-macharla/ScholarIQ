import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function TagInput({ tags, setTags, placeholder, maxTags = 10 }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.trim();
      if (val && !tags.includes(val) && tags.length < maxTags) {
        setTags([...tags, val]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg p-2 min-h-[44px] flex flex-wrap gap-2 focus-within:border-[#06d6a0] focus-within:ring-1 focus-within:ring-[#06d6a0] transition-colors">
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center gap-1 bg-[#161b22] border border-slate-700 text-slate-200 px-2.5 py-1 rounded-md text-sm">
          <span>{tag}</span>
          <button 
            type="button" 
            onClick={() => removeTag(index)}
            className="text-slate-500 hover:text-red-400 transition-colors ml-1"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      
      {tags.length < maxTags && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent min-w-[120px] outline-none text-slate-200 text-sm placeholder:text-slate-600"
        />
      )}
    </div>
  );
}
