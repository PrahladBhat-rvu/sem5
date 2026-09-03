import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    languageName: "English",

    nav: {
      workouts: "WORKOUTS",
      programs: "PROGRAMS",
      healthyLiving: "HEALTHY LIVING",
      community: "COMMUNITY",
      about: "ABOUT",
      store: "STORE",
      membership: "MEMBERSHIP",
      signIn: "Hi! Sign In",
      myFitness: "MY FITNESS",
    },

    hero: {
      titleLine1: "Feel Great.",
      titleLine2: "Body and Mind.",
      description:
        "Choose from hundreds of workouts, healthy recipes, relaxing meditations, and expert articles, for a whole body and mind approach to feeling great.",
      button: "Join Now",
    },

    cards: {
      trainer: {
        title: "Trainer Series",
        description:
          "Exercise with your favorite trainer in our new Trainer Series programs.",
        button: "View Series",
      },

      membership: {
        titleLine1: "Earn a Free Plus",
        titleLine2: "Membership",
        description:
          "Share your referral code and every sign up earns rewards to put toward your membership.",
        button: "Learn About Rewards",
      },

      powerblock: {
        titleLine1: "Small Footprint",
        titleLine2: "Big Gains",
        description:
          "The perfect dumbbells for any space. Use discount code FBXPB20 for $20 off an order of $200 or more.",
        button: "Shop PowerBlock",
      },

      specialty: {
        title: "Specialty Content",
        description:
          "Pilot programs provide special content for smaller audiences, conditions, or life events.",
        button: "Browse Pilot Programs",
      },

      videos: {
        title: "Workout Videos",
        description:
          "Exercise with certified personal trainers whether you're at home or on the road.",
        button: "Find a Workout",
      },

      community: {
        titleLine1: "Supportive",
        titleLine2: "Community",
        description:
          "Stay motivated and engaged with a little help from a supportive community of other members.",
        button: "Visit Community",
      },
    },

    footer: {
      workouts: "WORKOUTS",
      workoutVideos: "Workout Videos",
      customWorkouts: "Custom Workouts",
      programs: "Programs",
      workoutPrograms: "Workout Programs",
      mealPlans: "Meal Plans",

      healthyLiving: "HEALTHY LIVING",
      fitness: "Fitness",
      health: "Health",
      nutrition: "Nutrition",
      healthyRecipes: "Healthy Recipes",
      experts: "Experts",

      about: "ABOUT",
      careers: "Careers",
      tutorials: "Tutorials",
      ourTeam: "Our Team",
      b2b: "B2B Options",

      membership: "MEMBERSHIP",
      plus: "FB Plus",
      community: "Community",
      referral: "Referral Program",
      blog: "Blog",
      contact: "Contact Us",
      faq: "FAQ",
      store: "Store",

      copyright: "Copyright © 2026 Fitness Blender. All rights reserved.",
      terms: "Terms of Use",
      privacy: "Privacy Policy",
    },
  },

  es: {
    languageName: "Español",

    nav: {
      workouts: "ENTRENAMIENTOS",
      programs: "PROGRAMAS",
      healthyLiving: "VIDA SALUDABLE",
      community: "COMUNIDAD",
      about: "ACERCA DE",
      store: "TIENDA",
      membership: "MEMBRESÍA",
      signIn: "Iniciar sesión",
      myFitness: "MI FITNESS",
    },

    hero: {
      titleLine1: "Siéntete genial.",
      titleLine2: "Cuerpo y mente.",
      description:
        "Elige entre cientos de entrenamientos, recetas saludables, meditaciones relajantes y artículos de expertos para cuidar tu cuerpo y tu mente.",
      button: "Únete ahora",
    },

    cards: {
      trainer: {
        title: "Series con entrenadores",
        description:
          "Entrena con tu entrenador favorito en nuestros nuevos programas de series.",
        button: "Ver series",
      },

      membership: {
        titleLine1: "Obtén una membresía",
        titleLine2: "Plus gratis",
        description:
          "Comparte tu código de referido y recibe recompensas con cada registro.",
        button: "Ver recompensas",
      },

      powerblock: {
        titleLine1: "Poco espacio",
        titleLine2: "Grandes resultados",
        description:
          "Las mancuernas perfectas para cualquier espacio. Usa el código FBXPB20 para obtener $20 de descuento en pedidos de $200 o más.",
        button: "Comprar PowerBlock",
      },

      specialty: {
        title: "Contenido especial",
        description:
          "Programas con contenido especial para diferentes públicos, condiciones o situaciones de vida.",
        button: "Ver programas",
      },

      videos: {
        title: "Videos de entrenamiento",
        description:
          "Entrena con instructores personales certificados, estés en casa o de viaje.",
        button: "Buscar entrenamiento",
      },

      community: {
        titleLine1: "Comunidad",
        titleLine2: "de apoyo",
        description:
          "Mantente motivado con la ayuda de una comunidad de otros miembros.",
        button: "Visitar comunidad",
      },
    },

    footer: {
      workouts: "ENTRENAMIENTOS",
      workoutVideos: "Videos de entrenamiento",
      customWorkouts: "Entrenamientos personalizados",
      programs: "Programas",
      workoutPrograms: "Programas de entrenamiento",
      mealPlans: "Planes de comida",

      healthyLiving: "VIDA SALUDABLE",
      fitness: "Fitness",
      health: "Salud",
      nutrition: "Nutrición",
      healthyRecipes: "Recetas saludables",
      experts: "Expertos",

      about: "ACERCA DE",
      careers: "Empleo",
      tutorials: "Tutoriales",
      ourTeam: "Nuestro equipo",
      b2b: "Opciones B2B",

      membership: "MEMBRESÍA",
      plus: "FB Plus",
      community: "Comunidad",
      referral: "Programa de referidos",
      blog: "Blog",
      contact: "Contáctanos",
      faq: "Preguntas frecuentes",
      store: "Tienda",

      copyright: "Copyright © 2026 Fitness Blender. Todos los derechos reservados.",
      terms: "Términos de uso",
      privacy: "Política de privacidad",
    },
  },

  de: {
    languageName: "Deutsch",

    nav: {
      workouts: "WORKOUTS",
      programs: "PROGRAMME",
      healthyLiving: "GESUNDES LEBEN",
      community: "COMMUNITY",
      about: "ÜBER UNS",
      store: "SHOP",
      membership: "MITGLIEDSCHAFT",
      signIn: "Anmelden",
      myFitness: "MEIN FITNESS",
    },

    hero: {
      titleLine1: "Fühl dich großartig.",
      titleLine2: "Körper und Geist.",
      description:
        "Wähle aus Hunderten von Workouts, gesunden Rezepten, entspannenden Meditationen und Expertenartikeln für ein ganzheitliches Wohlbefinden.",
      button: "Jetzt beitreten",
    },

    cards: {
      trainer: {
        title: "Trainer-Serie",
        description:
          "Trainiere mit deinem Lieblingscoach in unseren neuen Trainer-Serien.",
        button: "Serie ansehen",
      },

      membership: {
        titleLine1: "Kostenlose Plus-",
        titleLine2: "Mitgliedschaft",
        description:
          "Teile deinen Empfehlungscode und erhalte mit jeder Anmeldung Prämien für deine Mitgliedschaft.",
        button: "Prämien ansehen",
      },

      powerblock: {
        titleLine1: "Wenig Platz",
        titleLine2: "Große Ergebnisse",
        description:
          "Die perfekten Kurzhanteln für jeden Raum. Verwende den Code FBXPB20 für 20 $ Rabatt bei Bestellungen ab 200 $.",
        button: "PowerBlock kaufen",
      },

      specialty: {
        title: "Spezielle Inhalte",
        description:
          "Spezielle Programme für unterschiedliche Zielgruppen, Bedingungen oder Lebenssituationen.",
        button: "Programme ansehen",
      },

      videos: {
        title: "Workout-Videos",
        description:
          "Trainiere mit zertifizierten Personal Trainern, egal ob zu Hause oder unterwegs.",
        button: "Workout suchen",
      },

      community: {
        titleLine1: "Unterstützende",
        titleLine2: "Community",
        description:
          "Bleib motiviert und tausche dich mit anderen Mitgliedern aus.",
        button: "Community besuchen",
      },
    },

    footer: {
      workouts: "WORKOUTS",
      workoutVideos: "Workout-Videos",
      customWorkouts: "Individuelle Workouts",
      programs: "Programme",
      workoutPrograms: "Workout-Programme",
      mealPlans: "Ernährungspläne",

      healthyLiving: "GESUNDES LEBEN",
      fitness: "Fitness",
      health: "Gesundheit",
      nutrition: "Ernährung",
      healthyRecipes: "Gesunde Rezepte",
      experts: "Experten",

      about: "ÜBER UNS",
      careers: "Karriere",
      tutorials: "Tutorials",
      ourTeam: "Unser Team",
      b2b: "B2B-Optionen",

      membership: "MITGLIEDSCHAFT",
      plus: "FB Plus",
      community: "Community",
      referral: "Empfehlungsprogramm",
      blog: "Blog",
      contact: "Kontakt",
      faq: "FAQ",
      store: "Shop",

      copyright:
        "Copyright © 2026 Fitness Blender. Alle Rechte vorbehalten.",
      terms: "Nutzungsbedingungen",
      privacy: "Datenschutzrichtlinie",
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("fitness-blender-language") || "en";
  });

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("fitness-blender-language", newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}