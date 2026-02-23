import { useTranslation } from 'react-i18next';
// import { useParams } from 'react-router-dom'; // Later for dynamic IDs
import type { Property } from '../types/property';

import { useNavigate } from 'react-router-dom';

// For the MVP, we'll pass the property as a prop or find it in our mock data
interface PropertyDetailProps {
    property: Property;
}

export const PropertyDetail = ({ property }: PropertyDetailProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white pt-24"> {/* pt-24 to clear the fixed Navbar */}

            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
                ← {t('detail.back_to_collection')}
            </button>

            {/* 1. Image Gallery Grid */}
            <section className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                    <div className="md:col-span-2 h-full">
                        <img src={property.images[0]} className="w-full h-full object-cover rounded-l-lg" alt="Main" />
                    </div>
                    <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-4 h-full">
                        <img src={property.images[0]} className="w-full h-full object-cover" alt="Detail 1" />
                        <img src={property.images[0]} className="w-full h-full object-cover rounded-tr-lg" alt="Detail 2" />
                        <img src={property.images[0]} className="w-full h-full object-cover" alt="Detail 3" />
                        <img src={property.images[0]} className="w-full h-full object-cover rounded-br-lg" alt="Detail 4" />
                    </div>
                </div>
            </section>

            {/* 2. Content Layout */}
            <section className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2">
                        <div className="border-b border-gray-100 pb-8">
                            <h1 className="font-display text-4xl text-slate-900">{property.title}</h1>
                            <p className="mt-2 text-slate-500 font-light text-lg">{property.location}</p>

                            <div className="mt-6 flex gap-6 text-sm uppercase tracking-widest text-slate-400">
                                <span>{property.beds} {t('properties.beds')}</span>
                                <span>{property.baths} {t('properties.baths')}</span>
                                <span>{property.sqft} {t('properties.sqft')}</span>
                            </div>
                        </div>

                        <div className="py-8">
                            <h2 className="font-display text-2xl mb-4">{t('detail.about_space')}</h2>
                            <p className="text-slate-600 font-light leading-relaxed">
                                {/* This would be your dynamic description from MongoDB */}
                                Experience the ultimate in Venezuelan luxury. This property is part of
                                the exclusive Hospedaje por Dias collection, ensuring a seamless stay
                                with premium amenities and 24/7 personalized support.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="relative">
                        <div className="sticky top-28 rounded-xl border border-gray-100 p-8 shadow-xl bg-white">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-2xl font-bold">${property.pricePerNight} <span className="text-sm font-light text-slate-500">/ night</span></span>
                                <span className="text-sm font-medium">★ {property.rating}</span>
                            </div>

                            {/* Simplified Booking Form */}
                            <div className="space-y-4">
                                <button className="w-full bg-slate-900 text-white py-4 font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
                                    {t('detail.reserve_button')}
                                </button>
                            </div>

                            <p className="mt-4 text-center text-xs text-slate-400">
                                {t('detail.no_charge_yet')}
                            </p>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};