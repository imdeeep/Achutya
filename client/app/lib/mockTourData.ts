import type { TourData } from "~/types/tour";

export const mockTourData: TourData = {
  id: "1",
  title: "7 Days Spiti Full Circuit Roadtrip",
  subtitle:
    "High Altitude Desert Adventure - Experience the pristine beauty of the Himalayas",
  rating: 4.8,
  reviewCount: 248,
  price: 23499,
  originalPrice: 28999,
  discount: 19,
  duration: "6N - 7D",
  location: "Delhi - Delhi",
  maxGroupSize: 16,
  difficulty: "Moderate",
  heroImage:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  highlights: [
    "Visit Key Monastery - One of the most important Buddhist pilgrimage sites in Spiti Valley",
    "Explore Langza Village - Ancient fossil village with 1000-year-old Buddha statue",
    "Send postcards from world's highest post office at Hikkim village (4440m)",
    "Experience Chandratal Lake's pristine beauty - Moon Lake at 4300m altitude",
    "Journey through challenging Himalayan roads including Rohtang Pass and Kunzum Pass",
    "Witness the confluence of Spiti and Pin rivers at Attargo",
    'Visit Tabo Monastery - Often called the "Ajanta of the Himalayas"',
    "Experience overnight camping under million stars at Chandratal",
    "Cross the famous Chicham Bridge - Asia's highest suspension bridge",
  ],
  overview: {
    description:
      'Embark on an extraordinary journey through the mystical Spiti Valley, often referred to as "Little Tibet." This comprehensive 7-day adventure takes you through one of the most remote and spectacular regions of the Indian Himalayas. Spiti, meaning "The Middle Land," sits between Tibet and India, offering a unique blend of Tibetan Buddhist culture and dramatic high-altitude landscapes. From ancient monasteries perched on cliff edges to pristine alpine lakes reflecting snow-capped peaks, this tour promises an unforgettable experience. You\'ll traverse challenging mountain passes, visit traditional villages where time seems to have stood still, and witness some of the most breathtaking vistas on Earth. The journey includes comfortable accommodations, expert local guides, and carefully planned itineraries to ensure you experience the best of Spiti while acclimatizing safely to the high altitude. This is not just a tour; it\'s a transformative journey into one of the last remaining Shangri-Las on our planet.',
    features: [
      {
        title: "High Altitude Adventure",
        description:
          "Experience the thrill of traveling at altitudes ranging from 3,000m to 4,500m above sea level",
      },
      {
        title: "Cultural Immersion",
        description:
          "Deep dive into Tibetan Buddhist culture with visits to ancient monasteries and local villages",
      },
      {
        title: "Photography Paradise",
        description:
          "Capture stunning landscapes, ancient architecture, and unique flora & fauna",
      },
      {
        title: "Expert Guidance",
        description:
          "Professional tour leaders with extensive knowledge of local culture and geography",
      },
      {
        title: "Small Group Experience",
        description:
          "Maximum 16 travelers ensuring personalized attention and intimate experiences",
      },
      {
        title: "Sustainable Tourism",
        description:
          "Responsible travel practices supporting local communities and environmental conservation",
      },
    ],
  },
  itinerary: [
    {
      day: 0,
      title: "Departure from Delhi",
      description:
        "Begin your Spiti adventure with an overnight Volvo bus journey from Delhi to Shimla. The comfortable AC bus ensures a restful journey through the night as you travel towards the mountains.",
      activities: [
        "Evening departure from Delhi (Kashmere Gate ISBT)",
        "Overnight journey by luxury Volvo bus",
        "Rest and prepare for the mountain adventure ahead",
      ],
      accommodation: "Overnight in Volvo Bus",
      meals: "Dinner on your own",
    },
    {
      day: 1,
      title: "Shimla to Chitkul (Last Indian Village)",
      description:
        "Arrive in Shimla early morning and transfer to our vehicle for the scenic drive to Chitkul. Pass through beautiful apple orchards, terraced fields, and traditional Himachali villages. Chitkul, known as the last inhabited village near the Indo-China border, offers stunning views of snow-capped peaks.",
      activities: [
        "Arrival in Shimla and meet your tour leader",
        "Scenic drive through Kinnaur valley",
        "Breakfast stop at Narkanda with panoramic mountain views",
        "Visit Sarahan Bhimakali Temple (optional)",
        "Explore Chitkul village and interact with locals",
        "Evening leisure time by Baspa river",
      ],
      distance: "220km",
      duration: "9-10 Hours",
      accommodation: "Hotel/Guesthouse in Chitkul/Sangla",
      meals: "Breakfast & Dinner",
    },
    {
      day: 2,
      title: "Chitkul to Kalpa",
      description:
        "Wake up to a magnificent sunrise over the Kinnaur Kailash range. After exploring Chitkul village, drive to Kalpa, famous for its apple orchards and stunning views of the Kinnaur Kailash peaks. Kalpa offers a perfect introduction to the high Himalayas.",
      activities: [
        "Early morning sunrise photography",
        "Village walk and interaction with local Kinnauri people",
        "Visit to ancient temples in Chitkul",
        "Scenic drive to Kalpa with multiple photo stops",
        "Check-in at Kalpa with evening tea",
        "Sunset viewing from Kalpa with Kinnaur Kailash backdrop",
      ],
      distance: "80km",
      duration: "3-4 Hours",
      accommodation: "Hotel in Kalpa",
      meals: "Breakfast & Dinner",
    },
    {
      day: 3,
      title: "Kalpa to Kaza via Nako & Tabo",
      description:
        'Today marks your official entry into Spiti Valley! Cross the famous Sumdo border checkpoint and enter the high-altitude desert. Visit the picturesque Nako village with its ancient lake and the renowned Tabo Monastery, often called the "Ajanta of the Himalayas."',
      activities: [
        "Cross Sumdo border checkpoint (carry valid IDs)",
        "Visit Nako village and its ancient lake",
        "Explore Tabo Monastery - UNESCO World Heritage site",
        "Drive through the dramatic landscape transformation",
        "Navigate the famous Ka loops (hairpin bends)",
        "Arrive in Kaza - the subdivisional headquarters of Spiti",
      ],
      distance: "220km",
      duration: "8-9 Hours",
      accommodation: "Hotel in Kaza",
      meals: "Breakfast & Dinner",
    },
    {
      day: 4,
      title: "Explore Key Monastery & Spiti Villages",
      description:
        "Dedicate the entire day to exploring the spiritual and cultural heart of Spiti. Visit Key Monastery, the largest monastery in Spiti, and explore the highest villages in the world including Komic, Hikkim, and Langza.",
      activities: [
        "Early morning visit to Key Monastery for prayer ceremonies",
        "Drive to Chicham Bridge - Asia's highest suspension bridge",
        "Visit Kibber village - one of the highest motorable villages",
        "Explore Hikkim - send postcards from world's highest post office",
        "Visit Komic village - highest village connected by motorable road",
        "Evening in Langza village with fossil hunting and Buddha statue visit",
      ],
      distance: "120km (total)",
      duration: "Full day",
      accommodation: "Hotel in Kaza",
      meals: "Breakfast & Dinner",
    },
    {
      day: 5,
      title: "Kaza to Chandratal Lake",
      description:
        "Journey to the jewel of Spiti - Chandratal Lake. Also known as Moon Lake, this pristine high-altitude lake at 4,300m offers crystal-clear reflections of surrounding peaks. Experience camping under a canopy of stars.",
      activities: [
        "Early morning departure from Kaza",
        "Drive through Losar village - last village before Tibet",
        "Cross Kunzum Pass (4,551m) with prayer flag ceremony",
        "First glimpse of Chandratal from viewpoint",
        "Trek to Chandratal Lake (2km easy walk)",
        "Camping setup and evening by the lake",
        "Stargazing session with clear Himalayan skies",
      ],
      distance: "95km",
      duration: "5-6 Hours",
      accommodation: "Camping at Chandratal",
      meals: "Breakfast, Lunch & Dinner",
    },
    {
      day: 6,
      title: "Chandratal to Manali",
      description:
        "Wake up to a serene sunrise at Chandratal before beginning your descent to Manali. Cross the challenging Rohtang Pass and experience the dramatic change from high-altitude desert to lush green valleys.",
      activities: [
        "Sunrise photography at Chandratal Lake",
        "Pack up camp and begin descent",
        "Cross Rohtang Pass (3,978m) - weather permitting",
        "Dramatic landscape change from desert to greenery",
        "Arrive in Manali and check into hotel",
        "Evening exploration of Old Manali cafes",
      ],
      distance: "120km",
      duration: "6-7 Hours",
      accommodation: "Hotel in Manali",
      meals: "Breakfast & Dinner",
    },
    {
      day: 7,
      title: "Manali Exploration & Departure",
      description:
        "Your final day allows you to explore the beautiful hill station of Manali before your journey back to Delhi. Visit iconic temples, enjoy local cuisine, and shop for souvenirs.",
      activities: [
        "Visit Hadimba Devi Temple (optional)",
        "Explore Old Manali streets and cafes",
        "Shopping at Mall Road for local handicrafts",
        "Lunch at a traditional Himachali restaurant",
        "Departure to Delhi by Volvo bus",
        "Overnight journey back to Delhi",
      ],
      distance: "540km to Delhi",
      duration: "12-14 Hours",
      accommodation: "Overnight in Volvo Bus",
      meals: "Breakfast",
    },
  ],
  inclusions: [
    "Transportation by luxury Volvo bus from Delhi to Shimla and Manali to Delhi",
    "Entire travel within Spiti by comfortable Tempo Traveler with experienced driver",
    "6 nights accommodation in twin/triple sharing (hotels, guesthouses, and camps)",
    "Total of 11 meals as per detailed itinerary (breakfast and dinner)",
    "Professional tour leader cum guide throughout the journey",
    "All driver charges, toll taxes, parking fees, and fuel costs",
    "Inner line permits for restricted areas",
    "Oxygen cylinder and basic first aid kit for emergency situations",
    "24x7 road assistance and backup support",
    "All applicable government taxes and service charges",
  ],
  exclusions: [
    "GST (Goods and Services Tax) @ 5% extra on total package cost",
    "Personal expenses such as laundry, telephone calls, and tips",
    "Entry fees to monasteries, museums, and monuments",
    "Any meals not mentioned in the inclusions",
    "Travel insurance (highly recommended)",
    "Any expenses due to natural calamities, landslides, or road blockages",
    "Porter services and any adventure activities not mentioned",
    "Anything not specifically mentioned in the inclusions section",
  ],
  essentials: [
    "Valid government-issued photo ID card (Aadhaar, Passport, Driving License)",
    "Warm clothing including down jacket for high altitude areas",
    "Waterproof trekking shoes with good grip for uneven terrain",
    "High SPF sunscreen and UV protection sunglasses",
    "Personal medicines especially for altitude sickness (consult doctor)",
    "Power bank and extra camera batteries (limited charging facilities)",
    "Reusable water bottle and water purification tablets",
    "Light cotton clothes for lower altitude areas",
    "Personal toiletries and quick-dry towel",
    "Small backpack for day trips and camera equipment",
  ],
  notes: [
    "This tour involves high altitude travel (up to 4,500m). Please consult your doctor before booking if you have any medical conditions.",
    "Weather in the mountains can be unpredictable. Itinerary may be modified due to weather conditions, road blocks, or natural calamities.",
    "Accommodation in Spiti is basic but clean. Don't expect luxury amenities in remote areas.",
    "Mobile network connectivity is limited or absent in most areas of Spiti Valley.",
    "Respect local customs and traditions. Photography inside monasteries may require permission.",
    "Carry sufficient cash as ATMs are rare in Spiti. Some places may not accept cards.",
    "Pack light but smart. Excess luggage can be stored in Delhi or left in the vehicle.",
    "The roads can be challenging with sharp turns and steep climbs. Those prone to motion sickness should carry appropriate medication.",
    "This tour is not recommended for pregnant women, children under 10 years, and people with serious heart or respiratory conditions.",
    'Environmental conservation is crucial. Do not litter and follow the principle of "Leave No Trace."',
  ],
};
