import { useTranslation } from 'react-i18next';

export const AdditionalServices = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 'transport',
      category: t('services.cat_logistics'),
      title: t('services.transport_title'),
      description: t('services.transport_desc'),
      image: 'https://images.unsplash.com/photo-1449965024614-23b7405fc2b1?q=80&w=800'
    },
    {
      id: 'tours',
      category: t('services.cat_experience'),
      title: t('services.tours_title'),
      description: t('services.tours_desc'),
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800'
    },
    {
      id: 'beaches',
      category: t('services.cat_leisure'),
      title: t('services.beaches_title'),
      description: t('services.beaches_desc'),
      image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <header className="max-w-3xl mb-16">
          <h1 className="font-display text-5xl md:text-6xl text-slate-900 italic">
            {t('services.page_title')}
          </h1>
          <p className="mt-6 text-lg text-slate-500 font-light leading-relaxed">
            {t('services.page_subtitle')}
          </p>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                {service.category}
              </span>
              <h3 className="mt-2 font-display text-2xl text-slate-900">
                {service.title}
              </h3>
              <p className="mt-3 text-slate-500 font-light leading-relaxed">
                {service.description}
              </p>
              
              <button className="mt-6 text-[10px] font-bold uppercase tracking-widest border-b border-slate-900 pb-1 hover:text-brand-gold hover:border-brand-gold transition-all">
                {t('services.inquire_now')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};