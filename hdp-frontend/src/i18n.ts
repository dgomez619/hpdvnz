import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector) // Automatically detects user language
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes for us
        },
        resources: {
            en: {
                translation: {
                    nav: {
                        properties: "The Collection",
                        about: "Our Philosophy",
                        book_now: "Reserve Now"
                    },
                    hero: {
                        title: "Premium Stays, Personalized for You",
                        subtitle: "Hand-picked luxury rentals with a human touch."
                    },
                    search: {
                        location: "Where",
                        placeholder_location: "Select City",
                        dates: "When",
                        guests: "Guests",
                        guest: "Guest",
                        guests_plural: "Guests",
                        how_many: "How many?",
                        button: "Search"
                    },
                    properties: {
                        title: "The Collection",
                        subtitle: "Hand-picked sanctuaries designed for comfort and inspiration.",
                        view_all: "Explore the Collection",
                        beds: "bd",
                        baths: "ba",
                        sqft: "ft²",
                        night: "night",
                        managed: "Managed by Lumina"
                    },
                    guarantee: {
                        title: "The Hospedaje por Dias Standard",
                        description: "Unlike massive platforms, we personally manage every property in our collection. We guarantee professional cleaning, 24/7 concierge support, and the highest standards of comfort for every guest."
                    }
                }
            },
            es: {
                translation: {
                    nav: {
                        properties: "La Colección",
                        about: "Nuestra Filosofía",
                        book_now: "Reservar Ahora"
                    },
                    hero: {
                        title: "Estancias Premium, Personalizadas para Ti",
                        subtitle: "Alquileres de lujo seleccionados con un toque humano."
                    },
                    search: {
                        location: "Dónde",
                        placeholder_location: "Elegir Ciudad",
                        dates: "Cuándo",
                        guests: "Huéspedes",
                        guest: "Huésped",
                        guests_plural: "Huéspedes",
                        how_many: "¿Cuántos?",
                        button: "Buscar"
                    },
                    properties: {
                        title: "La Colección",
                        subtitle: "Santuarios seleccionados a mano, diseñados para el confort y la inspiración.",
                        view_all: "Explorar la Colección",
                        beds: "hab",
                        baths: "baños",
                        sqft: "m²",
                        night: "noche",
                        managed: "Gestionado por Lumina"
                    },
                    guarantee: {
                        title: "El Estándar de Hospedaje por Dias",
                        description: "A diferencia de las grandes plataformas, gestionamos personalmente cada propiedad de nuestra colección. Garantizamos limpieza profesional, soporte de conserjería 24/7 y los más altos estándares de confort para cada huésped."
                    }

                }
            }
        }
    });

export default i18n;