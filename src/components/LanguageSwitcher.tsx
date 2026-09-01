import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' || i18n.language?.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium focus:outline-none"
      title={i18n.language === 'es' || i18n.language?.startsWith('es') ? 'Switch to English' : 'Cambiar a Español'}
    >
      <Globe size={18} />
      <span>{i18n.language === 'es' || i18n.language?.startsWith('es') ? 'EN' : 'ES'}</span>
    </button>
  );
}
