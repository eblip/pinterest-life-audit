export type Category = {
  id: string;
  label: string;
  emoji: string;
  /** Mots-clés sans accents, en minuscules (FR + EN). */
  keywords: string[];
  insight: string;
  actions: string[];
  questions: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "sante",
    label: "Santé & sport",
    emoji: "💪",
    keywords: [
      "workout", "fitness", "gym", "yoga", "pilates", "sport", "running", "muscu", "exercice",
      "stretching", "health", "sante", "wellness", "meditation", "sommeil", "sleep", "cardio",
      "entrainement", "training", "bien etre", "abdos", "marche",
    ],
    insight: "Votre tableau montre un vrai désir de prendre soin de votre corps et de votre énergie.",
    actions: [
      "Bloquer 3 créneaux de 30 min d'activité physique dans votre agenda cette semaine.",
      "Choisir UNE routine vue sur vos épingles et la tester 7 jours de suite.",
      "Fixer une heure de coucher régulière pour soutenir vos objectifs de forme.",
    ],
    questions: ["Quelle activité physique vous donne vraiment envie de revenir ?"],
  },
  {
    id: "food",
    label: "Cuisine & alimentation",
    emoji: "🥗",
    keywords: [
      "recipe", "recette", "cuisine", "meal", "repas", "dinner", "diner", "breakfast",
      "petit dejeuner", "smoothie", "salade", "vegan", "vegetarien", "gateau", "cake", "dessert",
      "snack", "batch cooking", "mealprep", "food", "plat", "soupe", "pasta", "pates", "pain",
    ],
    insight: "L'alimentation et le plaisir de cuisiner occupent une place importante dans vos inspirations.",
    actions: [
      "Planifier 3 repas de la semaine à partir de vos recettes épinglées.",
      "Cuisiner une nouvelle recette de votre tableau ce week-end.",
      "Faire une liste de courses unique pour réduire le gaspillage et les achats impulsifs.",
    ],
    questions: ["Cuisinez-vous aujourd'hui autant que ce que ces épingles laissent espérer ?"],
  },
  {
    id: "home",
    label: "Maison & déco",
    emoji: "🏡",
    keywords: [
      "deco", "decor", "interior", "interieur", "maison", "home", "salon", "living", "chambre",
      "bedroom", "kitchen", "bathroom", "salle de bain", "rangement", "organisation", "organization",
      "minimalist", "minimaliste", "furniture", "meuble", "apartment", "appartement", "cocon",
      "hygge", "declutter", "desencombrer", "renovation", "amenagement",
    ],
    insight: "Votre environnement de vie compte beaucoup : vous cherchez un lieu qui vous ressemble.",
    actions: [
      "Désencombrer une seule zone (tiroir, étagère) en 20 minutes.",
      "Définir 3 mots qui décrivent l'ambiance voulue et trier vos achats déco avec eux.",
      "Établir un budget et une priorité : une pièce à transformer en premier.",
    ],
    questions: ["Quelle pièce vous éloigne le plus de l'ambiance de vos épingles ?"],
  },
  {
    id: "travel",
    label: "Voyage & aventure",
    emoji: "✈️",
    keywords: [
      "travel", "voyage", "trip", "vacation", "vacances", "destination", "itinerary", "itineraire",
      "beach", "plage", "island", "road trip", "city break", "hotel", "backpack", "europe",
      "japan", "japon", "italie", "italy", "greece", "grece", "portugal", "espagne", "spain",
      "iceland", "islande", "thailande", "thailand", "bali", "wanderlust",
    ],
    insight: "L'envie d'ailleurs et de découverte revient souvent dans vos inspirations.",
    actions: [
      "Choisir UNE destination prioritaire et fixer une période réaliste.",
      "Ouvrir une cagnotte voyage avec un montant mensuel automatique.",
      "Planifier une micro-aventure (week-end à moins de 2 h) dans les 60 jours.",
    ],
    questions: ["Si le budget n'était pas un obstacle, où seriez-vous dans 6 mois ?"],
  },
  {
    id: "career",
    label: "Carrière & argent",
    emoji: "💼",
    keywords: [
      "career", "carriere", "business", "entrepreneur", "freelance", "productivity", "productivite",
      "budget", "money", "argent", "finance", "invest", "epargne", "saving", "savings", "salaire",
      "salary", "side hustle", "marketing", "startup", "travail", "bureau", "office", "linkedin",
    ],
    insight: "Vos épingles parlent d'ambition professionnelle et/ou de stabilité financière.",
    actions: [
      "Écrire un objectif pro à 12 mois en une phrase et le décomposer en 3 étapes.",
      "Mettre en place un suivi de budget simple (revenus, fixes, épargne).",
      "Consacrer 2 h par semaine à une compétence ou un projet qui vous rapproche de cet objectif.",
    ],
    questions: ["Quel changement professionnel ou financier ferait la plus grande différence ?"],
  },
  {
    id: "style",
    label: "Style & mode",
    emoji: "👗",
    keywords: [
      "outfit", "fashion", "mode", "style", "look", "wardrobe", "garde robe", "capsule", "vetement",
      "clothes", "dress", "robe", "jeans", "sneakers", "streetwear", "accessoires", "bijoux",
      "jewelry", "ootd", "tenue",
    ],
    insight: "Votre identité visuelle et la façon dont vous vous présentez sont un sujet central.",
    actions: [
      "Faire l'inventaire de votre garde-robe : garder, donner, manquer.",
      "Définir 3 silhouettes ou combinaisons que vous portez vraiment avec plaisir.",
      "Acheter moins mais mieux : une pièce clé par trimestre.",
    ],
    questions: ["Votre garde-robe actuelle reflète-t-elle la personne de vos épingles ?"],
  },
  {
    id: "beauty",
    label: "Beauté & soin de soi",
    emoji: "✨",
    keywords: [
      "skincare", "beauty", "beaute", "makeup", "maquillage", "hair", "cheveux", "coiffure", "nails",
      "ongles", "soin", "selfcare", "self care", "parfum", "perfume", "manucure", "peau", "glow",
    ],
    insight: "Le soin de soi et les rituels de beauté semblent être un moment précieux pour vous.",
    actions: [
      "Instaurer une routine simple matin et soir de 5 minutes.",
      "Planifier un moment de soin hebdomadaire sans écran.",
      "Faire le tri de vos produits et ne garder que ceux que vous utilisez.",
    ],
    questions: ["Quel rituel vous fait vraiment du bien, au-delà de l'apparence ?"],
  },
  {
    id: "creative",
    label: "Créativité & loisirs",
    emoji: "🎨",
    keywords: [
      "art", "drawing", "dessin", "painting", "peinture", "photography", "photo", "craft", "diy",
      "creatif", "creative", "knitting", "tricot", "crochet", "couture", "sewing", "poterie",
      "pottery", "bullet journal", "calligraphie", "music", "musique", "guitar", "guitare",
      "illustration", "design",
    ],
    insight: "Vous avez une envie claire de créer, de faire de vos mains ou d'explorer un art.",
    actions: [
      "Réserver 2 créneaux de 45 min par semaine pour un projet créatif, sans objectif de résultat.",
      "Choisir un petit projet terminable en un week-end.",
      "Rejoindre un atelier ou une communauté locale ou en ligne.",
    ],
    questions: ["Qu'est-ce qui vous empêche de commencer aujourd'hui ?"],
  },
  {
    id: "mind",
    label: "Développement personnel",
    emoji: "🧠",
    keywords: [
      "growth", "mindset", "motivation", "habit", "habits", "habitude", "habitudes", "goals", "goal",
      "objectif", "objectifs", "gratitude", "affirmation", "affirmations", "quote", "quotes",
      "citation", "citations", "psychologie", "psychology", "confidence", "confiance", "discipline",
      "reading", "lecture", "livre", "livres", "book", "books", "therapy", "therapie", "mental",
      "intention", "manifest", "vision board", "journaling",
    ],
    insight: "Vous cherchez à vous améliorer, à clarifier vos priorités et à construire de meilleures habitudes.",
    actions: [
      "Définir 1 habitude minuscule (2 minutes) à ancrer pendant 21 jours.",
      "Tenir un journal : 3 lignes chaque soir (gratitude, leçon, priorité de demain).",
      "Choisir un livre de vos épingles et lire 10 pages par jour.",
    ],
    questions: ["Quelle habitude, si elle devenait automatique, changerait le plus votre quotidien ?"],
  },
  {
    id: "relations",
    label: "Famille & relations",
    emoji: "❤️",
    keywords: [
      "family", "famille", "wedding", "mariage", "baby", "bebe", "kids", "enfant", "enfants",
      "couple", "love", "amour", "friends", "amis", "amitie", "date", "parenting", "maternite",
      "pregnancy", "grossesse", "anniversaire", "birthday", "party", "fete", "gift", "cadeau",
      "cadeaux", "invite",
    ],
    insight: "Les liens avec les autres (famille, amis, couple) occupent une place centrale dans vos inspirations.",
    actions: [
      "Planifier un moment de qualité avec une personne proche cette semaine.",
      "Organiser un petit rituel récurrent (dîner, appel, sortie) et le mettre à l'agenda.",
      "Écrire à quelqu'un à qui vous pensez depuis longtemps.",
    ],
    questions: ["Avec qui aimeriez-vous passer plus de temps ?"],
  },
  {
    id: "nature",
    label: "Nature & plein air",
    emoji: "🌿",
    keywords: [
      "nature", "garden", "jardin", "plante", "plantes", "plant", "plants", "hiking", "randonnee",
      "camping", "mountain", "montagne", "forest", "foret", "outdoor", "plein air", "fleur", "fleurs",
      "flower", "flowers", "ocean", "sunset", "paysage", "landscape", "cabin", "cabane", "potager",
    ],
    insight: "Vous êtes attiré par la nature, le calme et le contact avec l'extérieur.",
    actions: [
      "Faire une sortie nature d'au moins 1 h par semaine, téléphone en mode avion.",
      "Ajouter 2 ou 3 plantes faciles chez vous.",
      "Repérer une randonnée ou un lieu vert à moins d'une heure et y aller ce mois-ci.",
    ],
    questions: ["À quelle fréquence êtes-vous réellement dehors aujourd'hui ?"],
  },
];
