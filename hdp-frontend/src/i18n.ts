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
            // English
            en: {
                translation: {
                    nav: {
                        home: "Home",
                        about: "About Us",
                        properties: "The Collection",
                        services: "Additional Services",
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
                        description: "Unlike massive platforms, we personally manage every property in our collection. We guarantee professional cleaning, 24/7 concierge support, and the highest standards of comfort for every guest.",
                        tagline: "Authentic Hospitality"
                    },
                    detail: {
                        about_space: "About this space",
                        reserve_button: "Check Availability",
                        no_charge_yet: "You won't be charged yet",
                        amenities: "What this place offers",
                        show_all_photos: "Show all photos",
                        share: "Share",
                        save: "Save",
                        back_to_previous: "Previous Page"
                    },
                    booking: {
                        check_in: "Check-in",
                        check_out: "Check-out",
                        guests: "Guests",
                        guest: "Guest",
                        guests_plural: "Guests",
                        night: "night",
                        nights_plural: "nights",
                        total: "Total",
                        reserve: "Check Availability",
                        no_charge: "You won't be charged yet",
                        cleaning_fee: "Cleaning fee",
                        service_fee: "Service fee",
                        taxes: "Taxes"
                    },
                    amenities: {
                        title: "What this place offers",
                        wifi: "High-speed Wi-Fi",
                        ac: "Air conditioning",
                        kitchen: "Fully equipped kitchen",
                        parking: "Free parking on premises",
                        pool: "Private pool",
                        tv: "Smart TV",
                        workspace: "Dedicated workspace"
                    },
                    catalog: {
                        title: "The Full Collection",
                        subtitle: "Browse our entire portfolio of exclusively managed properties across the most iconic locations.",
                        filter_location: "Filter by Location",
                        results_found: "Properties found"
                    },
                    services: {
                        page_title: "Elevated Experiences",
                        page_subtitle: "Beyond luxury stays, we offer a curated suite of services to ensure your time in Venezuela is seamless and unforgettable.",
                        cat_logistics: "Logistics",
                        cat_experience: "Exploration",
                        cat_leisure: "Leisure",
                        transport_title: "Airport Transfers",
                        transport_desc: "Private, secure, and professional pick-ups and drop-offs in premium vehicles.",
                        tours_title: "City Gastronomy & Culture",
                        tours_desc: "Bespoke tours of the city's hidden gems, fine dining, and historical attractions.",
                        beaches_title: "Coastal Escapes",
                        beaches_desc: "Private day trips to Venezuela's most pristine beaches and crystal-clear keys.",
                        inquire_now: "Inquire for Details"
                    }
                }
            },
            es: {
                // Spanish
                translation: {
                    nav: {
                        home: "Inicio",
                        about: "Sobre Nosotros",
                        properties: "La Colección",
                        services: "Servicios Adicionales",
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
                        description: "A diferencia de las grandes plataformas, gestionamos personalmente cada propiedad de nuestra colección. Garantizamos limpieza profesional, soporte de conserjería 24/7 y los más altos estándares de confort para cada huésped.",
                        tagline: "Hospitalidad Auténtica"
                    },
                    detail: {
                        about_space: "Sobre este espacio",
                        reserve_button: "Consultar Disponibilidad",
                        no_charge_yet: "No se te cobrará nada aún",
                        amenities: "Lo que este lugar ofrece",
                        show_all_photos: "Mostrar todas las fotos",
                        share: "Compartir",
                        save: "Guardar",
                        back_to_previous: "Volver"
                    },
                    booking: {
                        check_in: "Llegada",
                        check_out: "Salida",
                        guests: "Huéspedes",
                        guest: "Huésped",
                        guests_plural: "Huéspedes",
                        night: "noche",
                        nights_plural: "noches",
                        total: "Total",
                        reserve: "Consultar disponibilidad",
                        no_charge: "No se te cobrará nada aún",
                        cleaning_fee: "Gastos de limpieza",
                        service_fee: "Comisión por servicio",
                        taxes: "Impuestos"
                    },
                    amenities: {
                        title: "Lo que este lugar ofrece",
                        wifi: "Wi-Fi de alta velocidad",
                        ac: "Aire acondicionado",
                        kitchen: "Cocina totalmente equipada",
                        parking: "Estacionamiento gratuito",
                        pool: "Piscina privada",
                        tv: "Smart TV",
                        workspace: "Zona de trabajo dedicada"
                    },
                    catalog: {
                        title: "La Colección Completa",
                        subtitle: "Explore nuestro portafolio completo de propiedades gestionadas exclusivamente en las ubicaciones más icónicas.",
                        filter_location: "Filtrar por Ubicación",
                        results_found: "Propiedades encontradas"
                    },
                    services: {
                        page_title: "Experiencias Elevadas",
                        page_subtitle: "Más allá de estancias de lujo, ofrecemos una suite curada de servicios para asegurar que su tiempo en Venezuela sea perfecto e inolvidable.",
                        cat_logistics: "Logística",
                        cat_experience: "Exploración",
                        cat_leisure: "Ocio",
                        transport_title: "Traslados al Aeropuerto",
                        transport_desc: "Recogidas y traslados privados, seguros y profesionales en vehículos de alta gama.",
                        tours_title: "Cultura y Gastronomía",
                        tours_desc: "Recorridos personalizados por las joyas ocultas de la ciudad, alta cocina y atracciones históricas.",
                        beaches_title: "Escapadas Costeras",
                        beaches_desc: "Excursiones de un día a las playas más prístinas y cayos de aguas cristalinas de Venezuela.",
                        inquire_now: "Solicitar Información"
                    }


                }
            }
        }
    });

export default i18n;