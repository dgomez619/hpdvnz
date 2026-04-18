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
                        book_now: "Reserve Now",
                    },
                    hero: {
                        title: "Premium Stays, Personalized for You",
                        subtitle: "Hand-picked luxury rentals with a human touch."
                    },
                    search: {
                        location: "Where",
                        placeholder_location: "Select City",
                        dates: "When",
                        check_in: "Check-in",
                        check_out: "Check-out",
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
                        night_plural: "nights",
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
                        taxes: "Taxes",
                        request_title: "Booking Request",
                        request_sent: "Request sent!",
                        redirect_whatsapp: "We are redirecting you to WhatsApp to finalize details...",
                        summary_title: "Booking summary",
                        summary_check_in: "Check-in",
                        summary_check_out: "Check-out",
                        summary_guests: "Guests",
                        full_name: "Full name",
                        full_name_placeholder: "Ex: Dan Smith",
                        contact_label: "Email or WhatsApp",
                        contact_placeholder: "email@example.com or +1...",
                        processing: "Processing...",
                        confirm_and_contact: "Confirm and contact",
                        whatsapp_intro: "Hello! I'm interested in booking {{title}}.",
                        whatsapp_details: "Details:"
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
                    },
                    about: {
                        subtitle: "Our Philosophy",
                        title_main: "Redefining the art of",
                        title_italic: "Venezuelan hospitality.",
                        vision_title: "A Curated Approach",
                        vision_quote: "Luxury is not about price; it's about the peace of mind that comes from perfect management.",
                        vision_desc: "Hospedaje por Dias was born from the need to bridge the gap between high-end real estate and boutique hotel services. We don't just list properties; we curate experiences.",
                        value_1_title: "Exclusivity",
                        value_1_desc: "We only manage a limited collection of properties to ensure each receives our full attention.",
                        value_2_title: "Trust",
                        value_2_desc: "Verified properties, professional cleaning, and 24/7 support for every single guest.",
                        value_3_title: "Local Heritage",
                        value_3_desc: "Deeply rooted in Venezuela, we showcase the best of our culture through sophisticated living.",
                        footer_text: "Welcome to your home away from home."
                    },
                    common: {
                        loading_collection: "Loading collection..."
                    }
            }},
            es: {
                // Spanish
                translation: {
                    nav: {
                        home: "Inicio",
                        about: "Sobre Nosotros",
                        properties: "La Colección",
                        services: "Servicios Adicionales",
                        book_now: "Reservar Ahora",
                    },
                    hero: {
                        title: "Estancias Premium, Personalizadas para Ti",
                        subtitle: "Alquileres de lujo seleccionados con un toque humano."
                    },
                    search: {
                        location: "Dónde",
                        placeholder_location: "Elegir Ciudad",
                        dates: "Cuándo",
                        check_in: "Llegada",
                        check_out: "Salida",
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
                        night_plural: "noches",
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
                        taxes: "Impuestos",
                        request_title: "Solicitud de reserva",
                        request_sent: "¡Solicitud enviada!",
                        redirect_whatsapp: "Te estamos redirigiendo a WhatsApp para finalizar los detalles...",
                        summary_title: "Resumen de reserva",
                        summary_check_in: "Llegada",
                        summary_check_out: "Salida",
                        summary_guests: "Huéspedes",
                        full_name: "Nombre completo",
                        full_name_placeholder: "Ej: Dan Smith",
                        contact_label: "Email o WhatsApp",
                        contact_placeholder: "email@ejemplo.com o +58...",
                        processing: "Procesando...",
                        confirm_and_contact: "Confirmar y contactar",
                        whatsapp_intro: "¡Hola! Me interesa reservar {{title}}.",
                        whatsapp_details: "Detalles:"
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
                    },
                    about: {
                        subtitle: "Nuestra Filosofía",
                        title_main: "Redefiniendo el arte de la",
                        title_italic: "hospitalidad venezolana.",
                        vision_title: "Un Enfoque Curado",
                        vision_quote: "El lujo no se trata de precio; se trata de la tranquilidad que brinda una gestión perfecta.",
                        vision_desc: "Hospedaje por Dias nació de la necesidad de cerrar la brecha entre el sector inmobiliario de alta gama y los servicios de hoteles boutique.",
                        value_1_title: "Exclusividad",
                        value_1_desc: "Solo gestionamos una colección limitada de propiedades para asegurar nuestra total atención.",
                        value_2_title: "Confianza",
                        value_2_desc: "Propiedades verificadas, limpieza profesional y soporte 24/7 para cada huésped.",
                        value_3_title: "Herencia Local",
                        value_3_desc: "Profundamente arraigados en Venezuela, mostramos lo mejor de nuestra cultura.",
                        footer_text: "Bienvenidos a su hogar lejos de casa."
                    },
                    common: {
                        loading_collection: "Cargando colección..." 
                    }
                 
            }
        }
    }});

export default i18n;