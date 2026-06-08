export const LANGUAGES = [
  {
    value: 'English',
    label: 'English',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    value: 'Hindi',
    label: 'Hindi (हिंदी)',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    value: 'Tamil',
    label: 'Tamil (தமிழ்)',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    value: 'Telugu',
    label: 'Telugu (తెలుగు)',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    value: 'Marathi',
    label: 'Marathi (मराठी)',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];

export const getLanguageStyle = (lang) => {
  const language = LANGUAGES.find((l) => l.value.toLowerCase() === String(lang).toLowerCase());
  return language ? language.badgeClass : 'bg-slate-50 text-slate-700 border-slate-200';
};
