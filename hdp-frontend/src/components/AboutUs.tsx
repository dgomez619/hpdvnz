import { useTranslation } from 'react-i18next';

export const AboutUs = () => {
  const { t } = useTranslation();

  const values = [
    {
      title: t('about.value_1_title'),
      desc: t('about.value_1_desc'),
    },
    {
      title: t('about.value_2_title'),
      desc: t('about.value_2_desc'),
    },
    {
      title: t('about.value_3_title'),
      desc: t('about.value_3_desc'),
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* 1. MISSION HEADER */}
        <header className="max-w-4xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
            {t('about.subtitle')}
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl text-slate-900 leading-[1.1] tracking-tight">
            {t('about.title_main')} <br />
            <span className="font-light italic">{t('about.title_italic')}</span>
          </h1>
        </header>

        {/* 2. IMAGE & INTRO SPLIT */}
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 overflow-hidden rounded-2xl aspect-[16/9]">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
              alt="Our Vision"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-3000ms"
            />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-display text-3xl text-slate-900">{t('about.vision_title')}</h2>
            <p className="text-slate-500 font-light leading-relaxed text-lg italic">
              "{t('about.vision_quote')}"
            </p>
            <p className="text-slate-600 font-light leading-relaxed">
              {t('about.vision_desc')}
            </p>
          </div>
        </section>

        {/* 3. CORE VALUES GRID */}
        <section className="mt-32 border-t border-slate-100 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, i) => (
              <div key={i} className="space-y-4">
                <span className="text-xs font-bold text-slate-300">0{i + 1}</span>
                <h3 className="font-display text-xl text-slate-900 uppercase tracking-wider">
                  {value.title}
                </h3>
                <p className="text-slate-500 font-light leading-relaxed text-sm">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. THE SIGNATURE BOTTOM */}
        <section className="mt-32 text-center py-20 bg-slate-50 rounded-3xl">
          <h2 className="font-display text-4xl text-slate-900 italic mb-8">
            {t('about.footer_text')}
          </h2>
          <div className="mx-auto h-px w-20 bg-slate-300 mb-8" />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">
            Hospedaje por Dias
          </p>
        </section>
      </div>
    </div>
  );
};