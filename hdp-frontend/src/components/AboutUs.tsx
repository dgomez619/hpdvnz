import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import abimg1sm from '../assets/abimg1sm.jpg';
import abimg2sm from '../assets/abimg2sm.jpg';

type LazyImageProps = {
  lowResSrc: string;
  highResSrc: string;
  alt: string;
  className?: string;
};

const LazyImage = ({ lowResSrc, highResSrc, alt, className }: LazyImageProps) => {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.src = highResSrc;

    const handleLoad = () => {
      if (isMounted) {
        setIsHighResLoaded(true);
      }
    };

    const handleError = () => {
      if (isMounted) {
        setIsHighResLoaded(false);
      }
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      isMounted = false;
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [highResSrc]);

  return (
    <div className={`relative ${className ?? ''}`}>
      <img
        src={lowResSrc}
        alt={alt}
        loading="eager"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out hover:scale-105 ${
          isHighResLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <img
        src={highResSrc}
        alt={alt}
        loading="eager"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out hover:scale-105 ${
          isHighResLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

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

        {/* 2. IMAGE & INTRO CONTENT */}
        <section className="flow-root mt-20 max-w-5xl">
          <h2 className="mb-6 font-display text-3xl text-slate-900">{t('about.vision_title')}</h2>
          <LazyImage
            lowResSrc={abimg1sm}
            highResSrc="https://res.cloudinary.com/dwrinmdz0/image/upload/v1786046791/WebAssets/araguaney_yqlauv.jpg"
            alt="Our Vision"
            className="mb-5 w-full overflow-hidden rounded-2xl aspect-video sm:float-left sm:mr-8 sm:mb-4 sm:w-56"
          />
          <p className="mb-6 text-lg font-light leading-relaxed text-slate-500 italic">
            "{t('about.vision_quote')}"
          </p>
          <p className="font-light leading-relaxed text-slate-600">
            {t('about.vision_desc')}
          </p>
        </section>

        <section className="flow-root mt-20 max-w-5xl">
          <h2 className="mb-6 font-display text-3xl text-slate-900">{t('about.vision_title2')}</h2>
          <LazyImage
            lowResSrc={abimg2sm}
            highResSrc="https://res.cloudinary.com/dwrinmdz0/image/upload/v1786046790/WebAssets/vnz1_t9avt7.jpg"
            alt="Our Vision"
            className="mb-5 w-full overflow-hidden rounded-2xl aspect-video sm:float-right sm:mb-4 sm:ml-8 sm:w-56"
          />
          <p className="mb-6 text-lg font-light leading-relaxed text-slate-500">
            {t('about.vision_quote2')}
          </p>
          <p className="font-light leading-relaxed text-slate-600">
            {t('about.vision_desc2')}
          </p>
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