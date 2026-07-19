import {
  FiCpu, FiGlobe, FiBookOpen, FiHash, FiCreditCard, FiTrendingUp,
} from 'react-icons/fi';

export const SUBJECTS = [
  {
    id: 'logical-reasoning',
    name: 'Logical Reasoning',
    icon: FiHash,
    gradient: 'from-violet-500 to-indigo-500',
    soft: 'bg-violet-50',
    ring: 'ring-violet-100',
    text: 'text-violet-600',
  },
  {
    id: 'quantitative-aptitude',
    name: 'Quantitative Aptitude',
    icon: FiTrendingUp,
    gradient: 'from-blue-500 to-cyan-500',
    soft: 'bg-blue-50',
    ring: 'ring-blue-100',
    text: 'text-blue-600',
  },
  {
    id: 'english',
    name: 'English',
    icon: FiBookOpen,
    gradient: 'from-rose-500 to-pink-500',
    soft: 'bg-rose-50',
    ring: 'ring-rose-100',
    text: 'text-rose-600',
  },
  {
    id: 'general-awareness',
    name: 'General Awareness',
    icon: FiGlobe,
    gradient: 'from-amber-500 to-orange-500',
    soft: 'bg-amber-50',
    ring: 'ring-amber-100',
    text: 'text-amber-600',
  },
  {
    id: 'computer-awareness',
    name: 'Computer Awareness',
    icon: FiCpu,
    gradient: 'from-emerald-500 to-teal-500',
    soft: 'bg-emerald-50',
    ring: 'ring-emerald-100',
    text: 'text-emerald-600',
  },
  {
    id: 'banking-awareness',
    name: 'Banking Awareness',
    icon: FiCreditCard,
    gradient: 'from-slate-600 to-slate-800',
    soft: 'bg-slate-50',
    ring: 'ring-slate-100',
    text: 'text-slate-600',
  },
];

export const getSubjectById = (id) => SUBJECTS.find((s) => s.id === id);
