/* ============================================================
   CALKOTHA — Heritage Exploration Platform
   script.js — Complete Application Logic
   ============================================================ */

'use strict';

// ─── STATE ────────────────────────────────────────────────────
const STATE = {
  currentPage: 'splash',
  previousPage: null,
  navHistory: [],
  user: null,
  favorites: { locations: [], stories: [], routes: [] },
  visited: [],
  stamps: [],
  xp: 0,
  achievements: [],
  completedMissions: [],
  settings: {
    achievements: true,
    nearby: true,
    stories: false,
    cluster: true,
    hidden: true
  },
  searchFilter: 'all',
  mapFilter: 'all',
  mapInstance: null,
  mapMarkers: [],
  userLocationMarker: null,
  tramMarkers: [],
  missionTab: 'all',
  favTab: 'locations',
  tramTab: 'routes',
  currentHeritageSite: null,
  currentStory: null,
  arSelectedSite: null,
  arOverlayActive: false,
  arBeforeAfterMode: false
};

// ─── DATA ─────────────────────────────────────────────────────

const LOCATIONS = [
  {
    id: 'victoria',
    name: 'Victoria Memorial',
    subtitle: 'The Crown Jewel of Colonial Kolkata',
    year: 1921,
    style: 'Indo-Saracenic Revival',
    area: 'Maidan, South Kolkata',
    category: 'colonial',
    icon: '🏛️',
    significance: 'Built as a memorial to Queen Victoria, this magnificent white marble monument is one of the finest buildings in India.',
    desc: 'Constructed with 184,000 tonnes of Makrana marble, the Victoria Memorial stands as the grandest colonial monument in India. Its massive dome, inspired by the Taj Mahal and St. Paul\'s Cathedral, dominates the Kolkata skyline.',
    lat: 22.5448, lng: 88.3426,
    stories: ['The Marble Dream', 'Lord Curzon\'s Vision', 'Independence Transformation'],
    facts: ['Built between 1906–1921', 'Houses 28,500+ artifacts', 'Same marble as the Taj Mahal', '64-acre garden surrounds it']
  },
  {
    id: 'howrah',
    name: 'Howrah Bridge',
    subtitle: 'The Gateway to Kolkata',
    year: 1943,
    style: 'Cantilever Truss',
    area: 'Howrah, West Bengal',
    category: 'colonial',
    icon: '🌉',
    significance: 'One of the world\'s longest cantilever bridges, Howrah Bridge is the lifeline and iconic symbol of Kolkata.',
    desc: 'The Howrah Bridge, officially Rabindra Setu, spans 705 metres across the Hooghly River. Built without a single nut or bolt — entirely riveted — it carries 100,000 vehicles and 150,000 pedestrians daily.',
    lat: 22.5851, lng: 88.3468,
    stories: ['Night of the River', 'The Iron Web', 'Letters From the Bridge'],
    facts: ['Spans 705 metres', 'No nuts or bolts used', '26,500 tonnes of steel', 'Opened March 3, 1943']
  },
  {
    id: 'marble-palace',
    name: 'Marble Palace',
    subtitle: 'The Hidden European Treasure',
    year: 1835,
    style: 'Neo-Classical',
    area: 'Shyambazar, North Kolkata',
    category: 'cultural',
    icon: '🏰',
    significance: 'A private mansion housing one of India\'s finest collections of European art, sculptures, and antiques.',
    desc: 'Built by Raja Rajendra Mullick in 1835, Marble Palace is a neoclassical masterpiece that houses over 400 pieces of European art — Rubens, Reynolds, Murillo — alongside rare Egyptian artifacts, Japanese vases, and a private zoo.',
    lat: 22.5881, lng: 88.3623,
    stories: ['The Raja\'s Collection', 'A Zoo in the Palace', 'Time Forgot This Address'],
    facts: ['Built in 1835', 'Over 400 European artworks', 'Still occupied by descendants', 'Features a private zoo']
  },
  {
    id: 'jorasanko',
    name: 'Jorasanko Thakurbari',
    subtitle: 'Birthplace of Rabindranath Tagore',
    year: 1784,
    style: 'Bengali Mansion',
    area: 'Jorasanko, North Kolkata',
    category: 'cultural',
    icon: '✍️',
    significance: 'The ancestral home of the Tagore family, where Rabindranath Tagore was born and where India\'s cultural renaissance flourished.',
    desc: 'This sprawling mansion at 6 Dwarkanath Tagore Lane was the epicenter of the Bengal Renaissance. Rabindranath Tagore, Asia\'s first Nobel laureate, was born here in 1861. Today it houses Rabindra Bharati University.',
    lat: 22.5861, lng: 88.3568,
    stories: ['The Dawn of Renaissance', 'Rabi\'s Childhood', 'Songs of the Soul'],
    facts: ['Rabindranath Tagore born here 1861', 'Now Rabindra Bharati University', 'Bengal Renaissance epicenter', 'Over 200 years old']
  },
  {
    id: 'indian-museum',
    name: 'Indian Museum',
    subtitle: 'The Oldest Museum in Asia',
    year: 1814,
    style: 'Italian Renaissance',
    area: 'Chowringhee, Central Kolkata',
    category: 'educational',
    icon: '🏺',
    significance: 'The oldest and largest museum in Asia, established in 1814, housing extraordinary collections spanning art, archaeology, and natural history.',
    desc: 'Founded on February 2, 1814, the Indian Museum on Chowringhee Road is Asia\'s oldest museum. Its six sections — art, archaeology, anthropology, geology, zoology, and economic botany — contain over 100,000 artifacts.',
    lat: 22.5582, lng: 88.3517,
    stories: ['The First Curator', 'The Rosetta Stone Connection', 'Secrets in the Vault'],
    facts: ['Established 1814', 'Oldest museum in Asia', '100,000+ artifacts', '6 gallery sections']
  },
  {
    id: 'kalighat',
    name: 'Kalighat Temple',
    subtitle: 'One of the 51 Shakti Peethas',
    year: 1809,
    style: 'Bengali Temple Architecture',
    area: 'Kalighat, South Kolkata',
    category: 'religious',
    icon: '🛕',
    significance: 'One of the most sacred Hindu temples in India — a Shakti Peetha where the toe of Goddess Sati is said to have fallen.',
    desc: 'The Kalighat Kali Temple is one of 51 sacred Shakti Peethas. The original temple dates to ancient times; the current structure was built in 1809. It gave Kolkata its name — from Kalikshetra (Land of Kali).',
    lat: 22.5212, lng: 88.3437,
    stories: ['The Name of the City', 'The Sacred Toe', 'Kalighat\'s Painters'],
    facts: ['One of 51 Shakti Peethas', 'Current temple built 1809', 'Gave Kolkata its name', 'Daily pilgrims in thousands']
  },
  {
    id: 'armenian-church',
    name: 'Armenian Church of the Holy Nazareth',
    subtitle: 'Kolkata\'s Oldest Christian Church',
    year: 1724,
    style: 'Armenian Ecclesiastical',
    area: 'Armenian Street, BBD Bagh',
    category: 'religious',
    icon: '⛪',
    significance: 'The oldest surviving church in Kolkata, built by the thriving Armenian merchant community in 1724.',
    desc: 'Built in 1724, the Armenian Church stands as testimony to Kolkata\'s cosmopolitan heritage. The Armenian community arrived as merchants in the 17th century and became integral to Kolkata\'s early economy.',
    lat: 22.5734, lng: 88.3504,
    stories: ['The Merchant Pioneers', 'A Community\'s Legacy', 'The Silent Bells'],
    facts: ['Built 1724', 'Oldest church in Kolkata', 'Armenian community presence since 17th century', 'Still active congregation']
  },
  {
    id: 'writers-building',
    name: 'Writers\' Building',
    subtitle: 'The Seat of Bengal\'s Colonial Power',
    year: 1780,
    style: 'Neo-Classical Colonial',
    area: 'BBD Bagh, Central Kolkata',
    category: 'colonial',
    icon: '🏢',
    significance: 'The iconic red building that served as the secretariat and seat of the Bengal government, now the state government headquarters.',
    desc: 'Originally built in 1690 as lodgings for writers of the East India Company, the Writers\' Building was expanded to its current form in 1780. Its distinctive red facade with white classical columns has defined Kolkata\'s architectural identity.',
    lat: 22.5751, lng: 88.3484,
    stories: ['The Writers of Empire', 'The Revolutionary Shootout', 'Red Building Red History'],
    facts: ['Original 1690 structure', 'Current building 1780', 'Former East India Company headquarters', 'Bhagat Singh\'s colleagues attacked it in 1930']
  },
  {
    id: 'st-pauls',
    name: 'St. Paul\'s Cathedral',
    subtitle: 'Gothic Splendour on the Maidan',
    year: 1847,
    style: 'Gothic Revival',
    area: 'Maidan, Central Kolkata',
    category: 'religious',
    icon: '⛩️',
    significance: 'The Cathedral Church of Kolkata, completed in 1847, is one of the finest examples of Gothic Revival architecture in Asia.',
    desc: 'Consecrated in 1847, St. Paul\'s Cathedral was designed by Major W.N. Forbes in Gothic style, inspired by Canterbury Cathedral. Its massive stained glass windows and Florentine frescoes make it one of Kolkata\'s most beautiful spaces.',
    lat: 22.5483, lng: 88.3432,
    stories: ['The Bishop\'s Vision', 'Stained Glass Chronicles', 'The 1934 Earthquake Repair'],
    facts: ['Completed 1847', 'Gothic Revival architecture', 'Inspired by Canterbury Cathedral', 'Restored after 1934 earthquake']
  },
  {
    id: 'kumartuli',
    name: 'Kumartuli',
    subtitle: 'The Potters\' Quarter',
    year: 1757,
    style: 'Living Heritage Craft District',
    area: 'Shyambazar, North Kolkata',
    category: 'cultural',
    icon: '🎨',
    significance: 'The famous artisan neighbourhood where sculptors have crafted Durga Puja idols for over 300 years, keeping alive a living heritage.',
    desc: 'Kumartuli (Potter\'s Quarter) has been the workshop of Kolkata\'s idol-makers since the 1750s. Every year, thousands of clay idols — primarily Goddess Durga — emerge from these narrow lanes to be worshipped across the world.',
    lat: 22.5875, lng: 88.3571,
    stories: ['Clay Gods and Mortal Hands', 'The Last Sculptor', 'Durga Across the World'],
    facts: ['Active since 1750s', 'Hundreds of artisan families', 'Idols exported globally', 'UNESCO Living Heritage']
  },
  {
    id: 'nakhoda-masjid',
    name: 'Nakhoda Masjid',
    subtitle: 'Kolkata\'s Grand Mughal Mosque',
    year: 1926,
    style: 'Mughal Architecture',
    area: 'Rabindra Sarani, Central Kolkata',
    category: 'religious',
    icon: '🕌',
    significance: 'The largest mosque in Kolkata, built in 1926, inspired by Akbar\'s Tomb at Sikandra and accommodating 10,000 worshippers.',
    desc: 'Built by the Kutchi Memon merchant community in 1926, the Nakhoda Masjid takes its inspiration from Akbar\'s Tomb at Sikandra. With its twin minarets reaching 46 metres, it remains Kolkata\'s most prominent mosque.',
    lat: 22.5712, lng: 88.3568,
    stories: ['The Merchant Mosque', 'Feast of Muharram', 'Towers of Faith'],
    facts: ['Completed 1926', 'Capacity 10,000 worshippers', 'Inspired by Akbar\'s Tomb', 'Twin minarets at 46m']
  },
  {
    id: 'college-street',
    name: 'College Street',
    subtitle: 'The Intellectual Artery of Kolkata',
    year: 1817,
    style: 'Living Heritage Street',
    area: 'North Kolkata',
    category: 'educational',
    icon: '📚',
    significance: 'The world\'s second-largest second-hand book market and the cradle of Bengal\'s intellectual renaissance.',
    desc: 'College Street, home to Presidency College (1817) and Calcutta University (1857), is where India\'s intellectual history was written. Its famous Coffee House has hosted debates by luminaries from Tagore to Amartya Sen.',
    lat: 22.5762, lng: 88.3591,
    stories: ['The Coffee House Debates', 'Booksellers of the World', 'Where Ideas Were Born'],
    facts: ['Presidency College est. 1817', 'Calcutta University est. 1857', 'Famous Coffee House since 1942', 'Millions of books traded annually']
  },
  {
    id: 'science-city',
    name: 'Science City',
    subtitle: 'India\'s Largest Science Centre',
    year: 1997,
    style: 'Modern Architecture',
    area: 'Eastern Metropolitan Bypass, Kolkata',
    category: 'educational',
    icon: '🔬',
    significance: 'The largest science centre in the Indian subcontinent, a hub of scientific education and innovation.',
    desc: 'Opened in 1997, Science City spans 50 acres on the Eastern Metropolitan Bypass. Its Space Odyssey, Evolution Park, Maritime Centre, and Dynamotion Hall attract over a million visitors annually.',
    lat: 22.5354, lng: 88.3960,
    stories: ['The Age of Discovery', 'Science for All'],
    facts: ['Opened 1997', '50-acre campus', '1 million+ annual visitors', 'Asia\'s largest science centre complex']
  },
  {
    id: 'dakshineswar',
    name: 'Dakshineswar Kali Temple',
    subtitle: 'The Temple of Sri Ramakrishna',
    year: 1855,
    style: 'Navaratna Bengali Temple',
    area: 'Dakshineswar, North Kolkata',
    category: 'religious',
    icon: '🛕',
    significance: 'One of the most revered temples in Bengal, where Sri Ramakrishna Paramahamsa had his divine visions.',
    desc: 'Built by Rani Rashmoni in 1855 on the east bank of the Hooghly, Dakshineswar is a navaratna (nine-spired) temple complex. Sri Ramakrishna served here as priest and attained his spiritual realizations.',
    lat: 22.6543, lng: 88.3576,
    stories: ['The Mystic of Dakshineswar', 'Rani Rashmoni\'s Gift'],
    facts: ['Built 1855 by Rani Rashmoni', 'Sri Ramakrishna served here', 'Navaratna architecture', 'On the Hooghly riverbank']
  },
  {
    id: 'belur-math',
    name: 'Belur Math',
    subtitle: 'The Headquarters of Ramakrishna Mission',
    year: 1899,
    style: 'Syncretic Religious Architecture',
    area: 'Belur, Howrah',
    category: 'religious',
    icon: '⛪',
    significance: 'World headquarters of the Ramakrishna Mission, a unique temple blending Hindu, Muslim, and Christian architectural motifs.',
    desc: 'Founded by Swami Vivekananda in 1897, Belur Math\'s main temple incorporates motifs from multiple faiths — a Hindu ground floor, Islamic arches, and a Gothic-style upper portion — symbolizing the unity of all religions.',
    lat: 22.6266, lng: 88.3562,
    stories: ['Vivekananda\'s Dream', 'The Temple of All Faiths'],
    facts: ['Founded 1897 by Vivekananda', 'Blends Hindu, Muslim, Christian elements', 'UNESCO proposed heritage site', 'Ramakrishna\'s ashes enshrined here']
  },
  {
    id: 'fort-william',
    name: 'Fort William',
    subtitle: 'The Citadel of British Bengal',
    year: 1773,
    style: 'Star Fort Military Architecture',
    area: 'Maidan, Central Kolkata',
    category: 'colonial',
    icon: '⚔️',
    significance: 'The military nerve centre of British India, a massive star-shaped fort that reshaped Kolkata\'s geography.',
    desc: 'The second Fort William, completed in 1773 after the original was captured by Siraj ud-Daulah in 1756, covers 5 square kilometres on the Maidan. Still an active military base, its construction cleared surrounding villages and created the vast Maidan.',
    lat: 22.5553, lng: 88.3326,
    stories: ['The Black Hole Controversy', 'Building an Empire\'s Fortress'],
    facts: ['Second fort completed 1773', 'First fort taken 1756', 'Star-shaped fortification', 'Still active Indian Army HQ']
  },
  {
    id: 'bethune-college',
    name: 'Bethune College',
    subtitle: 'Pioneer of Women\'s Education in India',
    year: 1849,
    style: 'Colonial Academic',
    area: 'Cornwallis Street, Central Kolkata',
    category: 'educational',
    icon: '🎓',
    significance: 'India\'s first women\'s college, founded in 1849 by John Elliot Drinkwater Bethune, representing a landmark in the education of women.',
    desc: 'Founded in 1849 by John Elliot Drinkwater Bethune, this college was the first of its kind in Asia to provide higher education to women. It became the symbol of the social reform movement in 19th-century Bengal.',
    lat: 22.5790, lng: 88.3596,
    stories: ['Doors Open for Women', 'The Reform Era'],
    facts: ['Founded 1849', 'First women\'s college in India', 'Part of Bengal Renaissance movement', 'Still a premier institution today']
  },
  {
    id: 'rabindra-sarovar',
    name: 'Rabindra Sarovar',
    subtitle: 'The Lake of Remembrance',
    year: 1958,
    style: 'Colonial Garden Lake',
    area: 'Dhakuria, South Kolkata',
    category: 'cultural',
    icon: '🌊',
    significance: 'A serene urban lake and heritage park, the lungs of south Kolkata, surrounded by walking paths and shrines.',
    desc: 'Rabindra Sarovar (formerly Dhakuria Lake) was developed into a heritage park in 1958. The 73-acre water body is surrounded by gardens, boating facilities, and the Chhath Puja ghats that come alive every autumn.',
    lat: 22.5133, lng: 88.3560,
    stories: ['The Lake Through the Decades', 'Chhath on the Ghat'],
    facts: ['73-acre water body', 'Designated Ramsar site', 'Premier rowing venue', 'Chhath Puja celebrated annually']
  },
  {
    id: 'maidan',
    name: 'The Maidan',
    subtitle: 'The Lungs of Kolkata',
    year: 1758,
    style: 'Colonial Urban Green',
    area: 'Central Kolkata',
    category: 'colonial',
    icon: '🌳',
    significance: 'A 1,000-acre urban park created by the British for the defense field of fire from Fort William — now Kolkata\'s largest open space.',
    desc: 'The Maidan (meaning "open field") was cleared by the British to create a firing field around Fort William. At 1,000 acres, it remains one of the world\'s largest urban parks and hosts cricket, football, political rallies, and the city\'s major monuments.',
    lat: 22.5482, lng: 88.3397,
    stories: ['The Field of the Empire', 'A City\'s Playground'],
    facts: ['1,000 acres of green space', 'Home to Eden Gardens', 'Victoria Memorial stands here', 'Scene of independence rallies']
  },
  {
    id: 'eden-gardens',
    name: 'Eden Gardens',
    subtitle: 'The Mecca of Cricket',
    year: 1864,
    style: 'Victorian Garden Stadium',
    area: 'BBD Bagh, Central Kolkata',
    category: 'cultural',
    icon: '🏏',
    significance: 'The world\'s second-largest cricket stadium and one of cricket\'s most iconic venues, hosting Test matches since 1934.',
    desc: 'Named after the Eden Sisters (Emily and Fanny Eden, sisters of Governor-General Lord Auckland), Eden Gardens has hosted cricket since 1864. The current stadium capacity of 66,000 makes every Test match here an unforgettable occasion.',
    lat: 22.5647, lng: 88.3437,
    stories: ['Cricket and Empire', 'The Roar of Eden Gardens'],
    facts: ['Established 1864', 'Capacity 66,000+', 'First Test match 1934', 'Named after Eden Sisters']
  },
  {
    id: 'pareshnath-temple',
    name: 'Pareshnath Jain Temple',
    subtitle: 'The Jewelled Temple of North Kolkata',
    year: 1867,
    style: 'Jain Architecture with European Elements',
    area: 'Shyambazar, North Kolkata',
    category: 'religious',
    icon: '✨',
    significance: 'The most magnificent Jain temple in eastern India, known for its extraordinary mirrored interiors and ornate garden.',
    desc: 'The Sheetalnathji Temple (popularly Pareshnath Temple) was built in 1867 by Seth Rai Badridas Mookim Bahadur. Its four shrines dedicated to different Jain Tirthankaras feature breathtaking mirrored mosaic walls, Belgian glass, Italian marble, and a garden of extraordinary beauty.',
    lat: 22.5939, lng: 88.3662,
    stories: ['The Mirror Shrine', 'Jain Heritage in Bengal'],
    facts: ['Built 1867', 'Four separate shrines', 'Belgian glass & Italian marble', 'Most ornate Jain temple in Bengal']
  },
  {
    id: 'high-court',
    name: 'Calcutta High Court',
    subtitle: 'The Oldest High Court in India',
    year: 1862,
    style: 'Gothic Revival',
    area: 'BBD Bagh, Central Kolkata',
    category: 'colonial',
    icon: '⚖️',
    significance: 'Established in 1862, it is the oldest High Court in India, modelled on the Cloth Hall of Ypres, Belgium.',
    desc: 'The Calcutta High Court, established under the High Courts Act of 1861 and operational from 1862, was modelled after the medieval Cloth Hall of Ypres in Belgium. Its Gothic spires and courtrooms have seen India\'s most historic legal battles.',
    lat: 22.5697, lng: 88.3472,
    stories: ['Justice in the Empire', 'The Sedition Trials'],
    facts: ['Oldest High Court in India', 'Established 1862', 'Modelled on Cloth Hall of Ypres', 'Jurisdiction over West Bengal & Andaman']
  },
  {
    id: 'netaji-bhawan',
    name: 'Netaji Bhawan',
    subtitle: 'Birthplace of Subhas Chandra Bose',
    year: 1909,
    style: 'Colonial Bengali',
    area: 'Elgin Road, South Kolkata',
    category: 'cultural',
    icon: '🇮🇳',
    significance: 'The ancestral home of Netaji Subhas Chandra Bose, now a museum dedicated to one of India\'s greatest freedom fighters.',
    desc: 'The Bose family home at 38/2 Lala Lajpat Rai Sarani (Elgin Road) is where Subhas Chandra Bose was born and grew up. Now Netaji Research Bureau, it houses the car in which Bose made his famous escape in 1941.',
    lat: 22.5352, lng: 88.3521,
    stories: ['The Escape of Netaji', 'A Soldier\'s Home'],
    facts: ['Birthplace of Subhas Chandra Bose', 'Houses his escape car', 'Now Netaji Research Bureau', 'Archives of Indian independence history']
  },
  {
    id: 'birla-mandir',
    name: 'Birla Mandir',
    subtitle: 'The White Marble Temple of the South',
    year: 1996,
    style: 'Orissa Style Temple Architecture',
    area: 'Ashutosh Chowdhury Avenue, South Kolkata',
    category: 'religious',
    icon: '🕌',
    significance: 'A stunning white marble temple complex built by the Birla family, representing the finest modern temple architecture in Kolkata.',
    desc: 'The Birla Mandir in Kolkata (officially the Krishna Mandir) was constructed in 1996 by the Birla family. Built in Orissa style from white marble, it houses shrines to Krishna-Radha, Shiva, Ganesha, Saraswati, and Hanuman within beautifully landscaped grounds.',
    lat: 22.5154, lng: 88.3475,
    stories: ['The Birla Legacy in Bengal', 'Marble and Devotion'],
    facts: ['Completed 1996', 'Orissa style architecture', 'White marble throughout', 'Birla family philanthropic legacy']
  },
  {
    id: 'park-street',
    name: 'Park Street Cemetery',
    subtitle: 'Where the Empire Buried Its Dead',
    year: 1767,
    style: 'Colonial Necropolis',
    area: 'Park Street, Central Kolkata',
    category: 'colonial',
    icon: '⚰️',
    significance: 'One of the oldest non-church cemeteries in the world, a hauntingly beautiful record of Kolkata\'s colonial population.',
    desc: 'The South Park Street Cemetery, operational from 1767, contains some of the most extraordinary funerary monuments in Asia. Obelisks, pyramids, and Mughal-influenced domes mark the graves of British soldiers, merchants, and administrators who died building an empire.',
    lat: 22.5492, lng: 88.3529,
    stories: ['The Dead of Empire', 'Monuments to Mortality'],
    facts: ['Operational from 1767', 'Non-church cemetery', 'Extraordinary funerary monuments', 'Heritage conservation underway']
  }
];

const STORIES = [
  {
    id: 'marble-dream',
    title: 'The Marble Dream',
    category: 'Colonial Heritage',
    icon: '🏛️',
    location: 'Victoria Memorial',
    readTime: '8 min',
    year: '1906',
    excerpt: 'How Lord Curzon\'s obsession with immortalising a Queen gave Kolkata its most magnificent monument...',
    chapters: [
      {
        title: 'A Viceroy\'s Vision',
        content: `In the sweltering summer of 1901, Lord Curzon — Viceroy of India and arguably the most powerful man on earth short of God — stood at the edge of the Maidan and dreamed of marble.

Queen Victoria had died in January of that year, and Curzon felt the weight of an empire mourning. "Some memorial to Queen Victoria worthy of her greatness and the love of the people" — those were his exact words, penned in a dispatch to London.

He had walked these grounds many times, past the scattered Bengali gardens, past the old Fort William parade grounds, and always his eye returned to this vast green expanse. Here, he decided. Here it would rise.

The brief was extraordinary: a building that would combine the best of Mughal and British architecture, built entirely of white Makrana marble — the same stone that had built the Taj Mahal. It would cost 105 lakh rupees, an astronomical sum. It would take fifteen years. It would be, he declared, "the finest monument in the British Empire outside England."`,
        year: '1901'
      },
      {
        title: 'The White Stone Arrives',
        content: `They came from Rajasthan by ox-cart — 184,000 tonnes of Makrana marble, the finest white stone in the world. Each block was inspected by hand. The quarries at Makrana, which had provided stone for the Taj Mahal three centuries earlier, now sent their bounty east, to this new monument at the far edge of the empire.

The architect, William Emerson, designed a fusion that had never existed before. The great central dome drew from Mughal sources. The flanking towers echoed St. Paul's Cathedral. The gardens borrowed from the Palace of Versailles. It was architecture as empire — gathering beauty from across the world and making it British by context.

Construction began in 1906. Each morning, hundreds of workers arrived on the Maidan, chiseling, polishing, laying foundations in the Bengal clay. The bridge-engineers fretted about the soil — it was too soft for such weight. They drove piles deep, then deeper still.

By 1910, the dome had begun to rise above the Kolkata skyline. It could be seen from the Hooghly on a clear day.`,
        year: '1910'
      },
      {
        title: 'Independence and After',
        content: `On February 4, 1921, the Prince of Wales — the future King Edward VIII — opened the Victoria Memorial to the public. India was still a crown colony. The Maidan still hosted British cavalry exercises. The memorial stood as the pinnacle of imperial confidence.

Twenty-six years later, everything changed.

When India became independent on August 15, 1947, the question arose with sudden urgency: what to do with a monument to an empress? Some advocated demolition. Others proposed conversion. Jawaharlal Nehru, with characteristic wisdom, offered the answer that has defined the memorial's legacy: "It should be a museum of Indian history — all of it, including the British chapter."

Today the Victoria Memorial houses 28,500 artifacts spanning Indian history from ancient times to 1911. The empress still stands in bronze at the entrance. But she looks out now over an independent nation that has made her monument its own — a place where schoolchildren learn history, where lovers walk at dusk, where the story of India is told without apology.

Lord Curzon wanted immortality. He found something rarer: relevance.`,
        year: '1947'
      }
    ]
  },
  {
    id: 'night-of-the-river',
    title: 'Night of the River',
    category: 'Living History',
    icon: '🌉',
    location: 'Howrah Bridge',
    readTime: '6 min',
    year: '1943',
    excerpt: 'The Hooghly\'s dark waters have witnessed everything — partition, famine, revolution, and a million daily crossings...',
    chapters: [
      {
        title: 'The River That Made the City',
        content: `Long before there was a bridge, there was the river.

The Hooghly is not a quiet waterway. It is a temperamental, dangerous, vital thing — a distributary of the Ganga that has drowned men and cradled empires with equal indifference. The Portuguese came first, in the 1530s. Then the British, in 1690, when Job Charnock chose a stretch of muddy riverbank and called it a trading post.

For centuries, Kolkata existed because of the Hooghly. Its wharves received spices, cotton, indigo, opium. Its water powered mills and carried corpses during famine years. The river was never merely geography. It was the city's biography.

Crossing it required boats — hundreds of boats, operating at all hours, carrying people who could not afford to be late. Accidents were common. The floating bridges that periodically spanned the water were never adequate. The city groaned for something permanent.`,
        year: '1855'
      },
      {
        title: 'The Bridge They Said Was Impossible',
        content: `The engineers arrived in 1937 with ambitious drawings and considerable doubt. Kolkata's tidal river, with its shifting muddy bottom, seemed to resist every conventional foundation method. The solution, finally adopted, was audacious: a balanced cantilever structure of such immense scale that it would be, at its completion, the third-longest cantilever bridge in the world.

No nuts or bolts were used in the primary structure — everything was riveted, over eight million rivets in total. The steel came from Tata Steel. The labour came from thousands of Bengali workers who spent six years building something they could not quite comprehend.

The bridge opened on February 3, 1943, in the middle of World War Two. The Japanese were bombing Calcutta. The city was weeks away from the worst famine of the twentieth century. But on that February morning, the first vehicles crossed a bridge 705 metres long and 96 feet wide, and Kolkata exhaled.

They renamed it Rabindra Setu in 1965, after Rabindranath Tagore. But no one calls it that. It has always been, simply, Howrah Bridge.`,
        year: '1943'
      }
    ]
  },
  {
    id: 'renaissance-dawn',
    title: 'The Dawn of the Bengal Renaissance',
    category: 'Cultural History',
    icon: '✍️',
    location: 'Jorasanko Thakurbari',
    readTime: '10 min',
    year: '1828',
    excerpt: 'How a single mansion in North Kolkata became the intellectual and artistic centre of a subcontinent\'s awakening...',
    chapters: [
      {
        title: 'The Tagore House',
        content: `At 6 Dwarkanath Tagore Lane, Jorasanko, there stands a mansion that changed the world.

Not with weapons or armies. Not with conquest or commerce. But with poetry, music, painting, philosophy, and an insistence — fierce and gentle at once — that India's ancient civilisation contained within it everything needed for modernity.

The Tagores came to Jorasanko in the late 18th century. Dwarkanath Tagore, businessman and reformer, built it into the city's most intellectual address. His son Debendranath made it the centre of Brahmo Samaj philosophy. And on the 7th of May, 1861, Debendranath's fourteenth child arrived in the world — Rabindranath, the boy who would grow up to become the most celebrated poet in the history of Asia.`,
        year: '1861'
      },
      {
        title: 'The Nobel and After',
        content: `When the Swedish Academy awarded Rabindranath Tagore the Nobel Prize for Literature in 1913 — the first Asian to receive it — the citation spoke of "his profoundly sensitive, fresh and beautiful verse." The world discovered what Kolkata had known for decades.

But Tagore himself always insisted the house was more than a monument to one man. It had been a factory of ideas — producing novelists, painters, musicians, scientists, philosophers. His niece Swarnakumari Devi was one of India's first women novelists. His nephew Abanindranath founded the Bengal School of Art. His grandnephew Subho Tagore pioneered Indian modern art.

The mansion at Jorasanko is now Rabindra Bharati University. Students walk its corridors where Tagore composed songs. They study in rooms where he painted, debated, lived.

The house still breathes. The renaissance it began has never ended.`,
        year: '1913'
      }
    ]
  },
  {
    id: 'clay-gods',
    title: 'Clay Gods and Mortal Hands',
    category: 'Living Craft',
    icon: '🎨',
    location: 'Kumartuli',
    readTime: '7 min',
    year: 'Present',
    excerpt: 'In the narrow lanes of Kumartuli, families carry forward a 300-year tradition of making gods from river clay...',
    chapters: [
      {
        title: 'The Clay of the Hooghly',
        content: `Every year, roughly six months before Durga Puja, the sculptors of Kumartuli begin their work with the same ritual act: gathering clay from the banks of the Hooghly.

The clay is special. It has a particular texture — the result of decades of silt deposits from the Ganga — that holds detail in ways other clays cannot. When it dries, it achieves a smoothness that accepts paint like a dream. When it burns in the puja ground days after the festival, it returns to the river from which it came.

This cycle — clay from river, gods from clay, gods to river — has continued in Kumartuli for over three centuries. The families who practice it trace their lineage to potters brought here by Kolkata's first landowners in the 1750s, when the city was still a trading outpost and the worship of Durga was beginning its transformation from aristocratic ritual to popular festival.`,
        year: '1750s'
      },
      {
        title: 'The Last Sculptor',
        content: `Today there are perhaps 400 sculptors remaining in Kumartuli. Thirty years ago there were over 600. The young leave for other professions — the work is exhausting, the income uncertain, the skills take years to acquire.

Gopal Pal has been making idols since he was eleven years old. He is sixty-three now, and his hands are extraordinary — thick with calluses, stained permanently with clay and paint, capable of modeling a face that will be worshipped by ten thousand people in a single day.

"My father's hands looked like this," he says. "My grandfather's too. The hands don't lie."

He worries about succession. His son is an accountant in Durgapur. His daughter makes idols during festival season, but she is not fully committed.

"The hands know what to do," Gopal Pal says. "The question is: will there be hands left to teach?"`,
        year: 'Present'
      }
    ]
  },
  {
    id: 'coffee-house-debates',
    title: 'The Coffee House Debates',
    category: 'Intellectual History',
    icon: '☕',
    location: 'College Street',
    readTime: '9 min',
    year: '1942',
    excerpt: 'A single coffee house on College Street has hosted more history than most capitals...',
    chapters: [
      {
        title: 'The Albert Hall',
        content: `The Indian Coffee House on College Street opened in 1942, operated by the Coffee Board of India. It was not the first café in the area — the Indian Coffee Workers\' Co-operative Society took over in 1957 — but it occupied the former Albert Hall, whose neo-Gothic facade announced that serious things happened inside.

The menu was simple: coffee, toast, cutlets. The price was designed for students. The conversations were not simple at all.

In the 1940s and 1950s, the Coffee House tables hosted independence movement debates. Subhash Chandra Bose, before his departure to Germany, was said to have argued strategy here. Poets recited unpublished work. Economists sketched theories on napkins. The future of newly independent India was being imagined in this smoke-filled room.`,
        year: '1942'
      },
      {
        title: 'Everyone Who Was Anyone',
        content: `The roll call of Coffee House regulars reads like a who\'s who of twentieth-century Bengali intellectual life.

Amartya Sen, the economist who would win the Nobel Prize in 1998, was a regular in the 1950s. He recalled it in interviews as the place where "one learned to argue." Satyajit Ray, whose films would eventually represent Indian cinema to the world, sketched storyboards at corner tables. Mrinal Sen, Aparna Sen, Utpal Dutt — the great names of Bengali art and theatre passed through its doors.

The filmmaker Ritwik Ghatak was perhaps the Coffee House's greatest devotee. His films about Partition, poverty, and the Bengal countryside were planned here, argued here, mourned here when they failed at the box office.

Today the Coffee House still operates. The waiters still wear their distinctive uniforms. The prices have changed but the atmosphere hasn't — students bent over books, arguments rising in volume, the particular smell of south Indian coffee mixing with the century's accumulated conversations.

Some places have a gift for collecting history. The Coffee House is such a place.`,
        year: '1960s'
      }
    ]
  },
  {
    id: 'name-of-the-city',
    title: 'The Name of the City',
    category: 'Origins',
    icon: '🛕',
    location: 'Kalighat Temple',
    readTime: '5 min',
    year: '17th Century',
    excerpt: 'How a small village beside a sacred temple became one of the world\'s great metropolises...',
    chapters: [
      {
        title: 'Kalikshetra',
        content: `Before Kolkata was a city, it was three villages: Sutanuti, Gobindapur, and Kalikata.

Kalikata took its name from Kalighat — from "Kali" (the goddess) and "ghat" (the riverbank steps). The small temple on the Hooghly had been sacred for centuries. Devotees called the area Kalikshetra: the Land of Kali.

When Job Charnock arrived for the East India Company in 1690 and established a trading post, he was not choosing a location at random. The area had an existing settlement, an existing economy, an existing spiritual identity. The goddess was already there.

The British mispronounced "Kalikata" as "Calcutta" — and for 300 years that was the city's official name. The Indian government renamed it Kolkata in 2001, returning it closer to the Bengali original.`,
        year: '1690'
      }
    ]
  }
];

const ROUTES = [
  { id: 'colonial', name: 'Colonial Kolkata', icon: '🏛️', desc: 'Trace the grandeur of British imperial architecture across the city\'s most magnificent colonial landmarks.', stops: 8, duration: '4-5 hours', category: 'colonial', xp: 500, locations: ['victoria', 'st-pauls', 'writers-building', 'armenian-church', 'howrah'] },
  { id: 'freedom', name: 'Freedom Movement Trail', icon: '🇮🇳', desc: 'Walk in the footsteps of revolutionaries through sites connected to India\'s independence struggle.', stops: 7, duration: '3-4 hours', category: 'cultural', xp: 600, locations: ['writers-building', 'jorasanko', 'college-street'] },
  { id: 'temples', name: 'Temple Route', icon: '🛕', desc: 'Explore Kolkata\'s sacred spaces — from ancient Shakti Peethas to colonial-era mosques and churches.', stops: 9, duration: '5-6 hours', category: 'religious', xp: 450, locations: ['kalighat', 'nakhoda-masjid', 'armenian-church', 'st-pauls'] },
  { id: 'river', name: 'River Heritage Route', icon: '🌊', desc: 'Follow the Hooghly from Howrah Bridge to the ghats, discovering stories the river keeps.', stops: 6, duration: '3 hours', category: 'cultural', xp: 400, locations: ['howrah', 'kumartuli'] },
  { id: 'hidden', name: 'Hidden Kolkata', icon: '🔍', desc: 'Venture off the tourist trail to discover Kolkata\'s best-kept secrets and forgotten heritage.', stops: 10, duration: '6 hours', category: 'hidden', xp: 800, locations: ['marble-palace', 'armenian-church', 'kumartuli'] },
  { id: 'renaissance', name: 'Bengal Renaissance Trail', icon: '✍️', desc: 'Trace the intellectual and artistic awakening of Bengal through its most significant cultural sites.', stops: 8, duration: '4 hours', category: 'cultural', xp: 550, locations: ['jorasanko', 'college-street', 'indian-museum'] }
];

const MISSIONS = [
  { id: 'm1', title: 'Forgotten Footsteps', icon: '👣', category: 'exploration', type: 'active', desc: 'Discover and mark 3 hidden heritage locations that appear on no standard tourist maps.', objective: 'Visit 3 hidden landmark locations', difficulty: 2, xpReward: 250, badge: '🕵️', badgeName: 'Hidden Explorer', progress: 0, total: 3 },
  { id: 'm2', title: 'Colonial Trailblazer', icon: '🏛️', category: 'colonial', type: 'active', desc: 'Visit and chronicle 5 colonial-era landmarks that defined British Calcutta\'s architectural identity.', objective: 'Visit 5 colonial-era landmarks', difficulty: 3, xpReward: 500, badge: '⚜️', badgeName: 'Colonial Trailblazer', progress: 0, total: 5 },
  { id: 'm3', title: 'Architect\'s Eye', icon: '🏗️', category: 'exploration', type: 'active', desc: 'Explore locations representing at least 3 distinct architectural styles — Gothic, Mughal, Bengali, Neo-Classical.', objective: 'Visit 3 different architectural style locations', difficulty: 2, xpReward: 400, badge: '🔭', badgeName: 'Architecture Enthusiast', progress: 0, total: 3 },
  { id: 'm4', title: 'Stories of Freedom', icon: '🇮🇳', category: 'story', type: 'story', desc: 'Complete the Independence Heritage Route and read all connected stories of India\'s freedom movement.', objective: 'Complete the Freedom Movement Trail', difficulty: 3, xpReward: 750, badge: '✊', badgeName: 'Freedom Storykeeper', progress: 0, total: 1 },
  { id: 'm5', title: 'River Chronicles', icon: '🌊', category: 'exploration', type: 'active', desc: 'Explore 4 heritage locations with direct connections to the Hooghly River and Kolkata\'s riverine history.', objective: 'Visit 4 river-connected sites', difficulty: 2, xpReward: 500, badge: '⚓', badgeName: 'River Chronicler', progress: 0, total: 4 },
  { id: 'm6', title: 'Time Traveler', icon: '⏳', category: 'story', type: 'story', desc: 'Read all story chapters for 5 different heritage locations to unlock historical reconstruction layers.', objective: 'Read 5 complete location stories', difficulty: 4, xpReward: 1000, badge: '⌛', badgeName: 'Time Traveler', progress: 0, total: 5 },
  { id: 'm7', title: 'Kolkata Detective', icon: '🔍', category: 'hidden', type: 'daily', desc: 'Find and verify 5 hidden landmarks that are completely absent from standard tourist routes.', objective: 'Verify 5 hidden landmarks', difficulty: 4, xpReward: 1200, badge: '🧭', badgeName: 'Landmark Detective', progress: 0, total: 5 },
  { id: 'm8', title: 'Daily Story Quest', icon: '📖', category: 'story', type: 'daily', desc: 'Read one complete story today and collect a daily discovery stamp.', objective: 'Read 1 story today', difficulty: 1, xpReward: 50, badge: '📜', badgeName: 'Daily Reader', progress: 0, total: 1 },
  { id: 'm9', title: 'Master Explorer', icon: '🌟', category: 'exploration', type: 'active', desc: 'Complete multiple mission chains across all major heritage categories to achieve legendary status.', objective: 'Complete 6 other missions', difficulty: 5, xpReward: 2500, badge: '👑', badgeName: 'CalKotha Legend', progress: 0, total: 6 }
];

const ACHIEVEMENTS = [
  { id: 'first-explorer', name: 'First Explorer', icon: '🏕️', desc: 'Created your heritage passport', condition: 'passport_created', unlocked: false },
  { id: 'story-hunter', name: 'Story Hunter', icon: '📖', desc: 'Read your first complete story', condition: 'story_read', unlocked: false },
  { id: 'heritage-walker', name: 'Heritage Walker', icon: '🚶', desc: 'Visited 5 heritage locations', condition: 'visited_5', unlocked: false },
  { id: 'kolkata-scholar', name: 'Kolkata Scholar', icon: '🎓', desc: 'Read 10 historical stories', condition: 'stories_10', unlocked: false },
  { id: 'gem-finder', name: 'Hidden Gem Finder', icon: '💎', desc: 'Discovered a hidden heritage gem', condition: 'hidden_found', unlocked: false },
  { id: 'stamp-collector', name: 'Stamp Collector', icon: '📮', desc: 'Collected 5 heritage stamps', condition: 'stamps_5', unlocked: false },
  { id: 'route-walker', name: 'Route Walker', icon: '🗺️', desc: 'Completed a heritage route', condition: 'route_complete', unlocked: false },
  { id: 'master-explorer', name: 'Master Explorer', icon: '🌟', desc: 'Reached 1000 XP', condition: 'xp_1000', unlocked: false }
];

const STAMPS = [
  { id: 'victoria', icon: '🏛️', name: 'Victoria Memorial', earned: false },
  { id: 'howrah', icon: '🌉', name: 'Howrah Bridge', earned: false },
  { id: 'marble', icon: '🏰', name: 'Marble Palace', earned: false },
  { id: 'tagore', icon: '✍️', name: 'Jorasanko', earned: false },
  { id: 'museum', icon: '🏺', name: 'Indian Museum', earned: false },
  { id: 'kalighat', icon: '🛕', name: 'Kalighat', earned: false },
  { id: 'armenian', icon: '⛪', name: 'Armenian Church', earned: false },
  { id: 'writers', icon: '🏢', name: 'Writers\' Building', earned: false },
  { id: 'stpauls', icon: '⛩️', name: 'St. Paul\'s', earned: false },
  { id: 'kumartuli', icon: '🎨', name: 'Kumartuli', earned: false },
  { id: 'nakhoda', icon: '🕌', name: 'Nakhoda Masjid', earned: false },
  { id: 'college', icon: '📚', name: 'College Street', earned: false }
];

// ─── INIT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateNavBadges();

  // Auto-start after splash animation
  setTimeout(() => {
    if (STATE.currentPage === 'splash') {
      // Don't auto-redirect, let user click
    }
  }, 3000);

  // Scroll reveal observer
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Counter animation on hero
  observeCounters();

  // Back-to-top
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('backTop');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  });

  // Populate initial grids
  populateLocationCards();
  populateStoryScroll();
  populateRouteGrid();
  populateSearchGrid(LOCATIONS);
  populateStoriesListGrid();
  populateMissionsGrid('all');
  populatePassportPage();
  populateFavorites();
  syncMissionStats();

  // Feature showcase
  initFeatureShowcase();
});

// ─── STATE PERSISTENCE ────────────────────────────────────────

function saveState() {
  const save = {
    user: STATE.user,
    favorites: STATE.favorites,
    visited: STATE.visited,
    stamps: STATE.stamps,
    stampDates: STATE.stampDates || {},
    readStories: STATE.readStories || [],
    xp: STATE.xp,
    achievements: STATE.achievements,
    completedMissions: STATE.completedMissions,
    settings: STATE.settings
  };
  localStorage.setItem('calkotha_state', JSON.stringify(save));
}

function loadState() {
  try {
    const raw = localStorage.getItem('calkotha_state');
    if (raw) {
      const saved = JSON.parse(raw);
      Object.assign(STATE, saved);
      if (STATE.user) {
        const nameEl = document.getElementById('passportName');
        if (nameEl) nameEl.textContent = STATE.user.name || 'Explorer';
        const profileNameEl = document.getElementById('profileName');
        if (profileNameEl) profileNameEl.value = STATE.user.name || '';
        const profileBioEl = document.getElementById('profileBio');
        if (profileBioEl) profileBioEl.value = STATE.user.bio || '';
        const profileTitleEl = document.getElementById('profileTitle');
        if (profileTitleEl && STATE.user.title) profileTitleEl.value = STATE.user.title;
        const profileDisplayNameEl = document.getElementById('profileDisplayName');
        if (profileDisplayNameEl) profileDisplayNameEl.textContent = STATE.user.name || 'Explorer';
        const profileDisplayBioEl = document.getElementById('profileDisplayBio');
        if (profileDisplayBioEl) profileDisplayBioEl.textContent = STATE.user.bio || 'No bio yet';
        const profileDisplayBadgeEl = document.getElementById('profileDisplayBadge');
        if (profileDisplayBadgeEl) profileDisplayBadgeEl.textContent = STATE.user.title || 'Heritage Novice';
        const avatarEl = document.getElementById('profileAvatarDisplay');
        if (avatarEl && STATE.user.avatar) avatarEl.textContent = STATE.user.avatar;
      }
    }
  } catch (e) { /* ignore */ }
}

// ─── PAGE NAVIGATION ─────────────────────────────────────────

function showPage(id) {
  if (STATE.currentPage && STATE.currentPage !== 'splash') {
    STATE.navHistory.push(STATE.currentPage);
    if (STATE.navHistory.length > 20) STATE.navHistory.shift();
  }
  STATE.previousPage = STATE.currentPage;
  STATE.currentPage = id;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Show/hide nav
  const nav = document.getElementById('mainNav');
  if (nav) nav.style.display = (id === 'splash') ? 'none' : 'block';
  // Show/hide dock
  const dock = document.getElementById('dockNav');
  if (dock) dock.style.display = (id === 'splash') ? 'none' : 'flex';
  document.body.classList.toggle('app-loaded', id !== 'splash');
  // Update dock active state
  document.querySelectorAll('.dock-item').forEach(di => di.classList.remove('dock-active'));
  const dockPageMap = {'home':0,'map-page':1,'tram-page':2,'settings-page':3,'community-page':4};
  const dockItems = document.querySelectorAll('.dock-item');
  if(dockPageMap[id] !== undefined && dockItems[dockPageMap[id]]) dockItems[dockPageMap[id]].classList.add('dock-active');

  // Floating back button
  const backBtn = document.getElementById('floatingBack');
  if (backBtn) {
    if (id !== 'splash' && id !== 'home' && STATE.navHistory.length > 0) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }

  // Active nav link
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === id);
  });

  // Page-specific init
  if (id === 'map-page') initMap();
  if (id === 'passport') {
    populatePassportPage();
    animateProgress();
  }
  if (id === 'missions') {
    syncMissionStats();
    populateMissionsGrid(STATE.missionTab);
  }
  if (id === 'favorites') populateFavorites();
  if (id === 'tram-page') populateTramPage(STATE.tramTab);
  if (id === 'ar-page') initARPage();
  if (id === 'community-page') populateCommunityPage();
}

function startExploring() {
  showPage('home');
  // Animate stat counters
  setTimeout(() => animateCounters(), 200);
}

function goBack() {
  if (STATE.navHistory.length > 0) {
    const prev = STATE.navHistory.pop();
    STATE.currentPage = STATE.previousPage;
    // Use raw showPage without pushing to avoid double-stacking
    STATE.previousPage = STATE.currentPage;
    STATE.currentPage = prev;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(prev);
    if (target) { target.classList.add('active'); window.scrollTo(0,0); }
    const nav = document.getElementById('mainNav');
    if (nav) nav.style.display = (prev === 'splash') ? 'none' : 'block';
    const dockG = document.getElementById('dockNav');
    if (dockG) dockG.style.display = (prev === 'splash') ? 'none' : 'flex';
    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === prev));
    const backBtn = document.getElementById('floatingBack');
    if (backBtn) {
      backBtn.classList.toggle('visible', STATE.navHistory.length > 0 && prev !== 'home');
    }
    if (prev === 'tram-page') populateTramPage(STATE.tramTab);
    if (prev === 'missions') { syncMissionStats(); populateMissionsGrid(STATE.missionTab); }
    if (prev === 'passport') { populatePassportPage(); animateProgress(); }
  } else {
    showPage('home');
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// ─── COUNTER ANIMATIONS ───────────────────────────────────────

function observeCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 1;
        animateCounter(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(eased * target) + (t < 1 ? '' : '+');
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    if (!el.dataset.counted) { el.dataset.counted = 1; animateCounter(el); }
  });
}

// ─── LOCATION CARDS ───────────────────────────────────────────

function populateLocationCards() {
  const grid = document.getElementById('locationsGrid');
  if (!grid) return;
  const featured = LOCATIONS.slice(0, 6);
  grid.innerHTML = featured.map(loc => createLocationCard(loc)).join('');
}

function createLocationCard(loc) {
  const isFav = STATE.favorites.locations.includes(loc.id);
  return `
  <div class="location-card reveal" onclick="openHeritageSite('${loc.id}')">
    <div class="location-card-img">
      <span>${loc.icon}</span>
      <span class="location-card-year">${loc.year}</span>
    </div>
    <div class="location-card-body">
      <div class="location-card-name">${loc.name}</div>
      <p class="location-card-desc">${loc.desc.substring(0, 120)}...</p>
      <div class="location-card-footer">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span class="badge badge-${loc.category}">${loc.category}</span>
          <span class="location-card-meta"><i class="fa fa-map-marker-alt"></i> ${loc.area.split(',')[0]}</span>
        </div>
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation();toggleFavorite('location','${loc.id}')" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  </div>`;
}

// ─── STORY SCROLL ─────────────────────────────────────────────

function populateStoryScroll() {
  const scroll = document.getElementById('storiesScroll');
  if (!scroll) return;
  scroll.innerHTML = STORIES.map(s => `
    <div class="story-card" onclick="openStory('${s.id}')">
      <div class="story-card-cat">${s.category}</div>
      <div class="story-card-title">${s.title}</div>
      <p class="story-card-excerpt">${s.excerpt}</p>
      <div class="story-card-footer">
        <span>📍 ${s.location}</span>
        <span>⏱ ${s.readTime}</span>
      </div>
    </div>
  `).join('');
}

// ─── ROUTES GRID ──────────────────────────────────────────────

function populateRouteGrid() {
  const grid = document.getElementById('routesGrid');
  if (!grid) return;
  grid.innerHTML = ROUTES.map(r => `
    <div class="route-card reveal" onclick="startRoute('${r.id}')">
      <div class="route-icon">${r.icon}</div>
      <div class="route-name">${r.name}</div>
      <p class="route-desc">${r.desc}</p>
      <div class="route-meta">
        <span>🗺️ ${r.stops} stops</span>
        <span>⏱ ${r.duration}</span>
        <span>⭐ +${r.xp} XP</span>
      </div>
    </div>
  `).join('');
}

// ─── STORIES LIST ─────────────────────────────────────────────

function populateStoriesListGrid() {
  const grid = document.getElementById('storiesListGrid');
  if (!grid) return;
  grid.innerHTML = STORIES.map(s => `
    <div class="story-list-card" onclick="openStory('${s.id}')">
      <div class="story-list-card-header">${s.icon}</div>
      <div class="story-list-card-body">
        <div class="story-list-card-title">${s.title}</div>
        <p class="story-list-card-excerpt">${s.excerpt}</p>
        <div class="story-list-card-footer">
          <span>📍 ${s.location}</span>
          <span>⏱ ${s.readTime}</span>
          <span>${s.year}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── STORY READER ─────────────────────────────────────────────

function openStory(id) {
  const story = STORIES.find(s => s.id === id);
  if (!story) return;
  STATE.currentStory = id;

  const content = document.getElementById('storyReaderContent');
  content.innerHTML = `
    <div class="story-reader-header">
      <span class="badge badge-cultural" style="margin-bottom:16px;">${story.category}</span>
      <h1 class="story-reader-title">${story.title}</h1>
      <div class="story-reader-meta">
        <span>📍 ${story.location}</span>
        <span>⏱ ${story.readTime} read</span>
        <span>📅 ${story.year}</span>
      </div>
      <div class="divider-ornate"><span class="ornament">✦</span></div>
    </div>
    <div class="story-reader-body">
      ${story.chapters.map((ch, i) => `
        <div class="story-chapter ${i === 0 ? '' : ''}">
          <div class="story-chapter-label">Chapter ${i + 1}</div>
          <div class="story-chapter-title">${ch.title}</div>
          ${ch.content.split('\n\n').map(para => `<p>${para.trim()}</p>`).join('')}
        </div>
      `).join('')}
      <div class="divider-ornate" style="margin-top:48px;"><span class="ornament">✦</span></div>
      <div style="text-align:center;padding:32px 0;">
        <div class="caption" style="margin-bottom:16px;">End of Story</div>
        <button class="btn btn-primary" onclick="awardStoryXP('${id}')">
          <i class="fa fa-star"></i> Collect Story Stamp (+75 XP)
        </button>
      </div>
    </div>
  `;

  showPage('story-reader');
}

function awardStoryXP(id) {
  // Only award once per story
  if (!STATE.readStories) STATE.readStories = [];
  if (STATE.readStories.includes(id)) { showToast('📖 Already collected this story stamp!'); return; }
  STATE.readStories.push(id);
  addXP(75);
  showToast('📖 Story completed! +75 XP earned');
  checkAchievement('story_read');
  // Complete daily story mission
  if (!STATE.completedMissions.includes('m8')) {
    completeMission('m8');
  }
  saveState();
}

// ─── HERITAGE SITE ────────────────────────────────────────────

function openHeritageSite(id) {
  const loc = LOCATIONS.find(l => l.id === id);
  if (!loc) return;
  STATE.currentHeritageSite = id;

  document.getElementById('heritageName').textContent = loc.name;
  document.getElementById('heritageSubtitle').textContent = loc.subtitle;
  document.getElementById('heritageYear').textContent = `Est. ${loc.year}`;
  document.getElementById('heritageStyle').textContent = loc.style;
  document.getElementById('heritageLocation').textContent = loc.area;

  const body = document.getElementById('heritageBody');
  const isFav = STATE.favorites.locations.includes(id);

  body.innerHTML = `
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:32px;">
      <span class="badge badge-${loc.category}">${loc.category}</span>
      <button class="btn btn-ghost btn-sm" onclick="toggleFavorite('location','${id}');this.textContent=STATE.favorites.locations.includes('${id}')?'❤️ Saved':'🤍 Save'">
        ${isFav ? '❤️ Saved' : '🤍 Save'}
      </button>
      <button class="btn btn-primary btn-sm" onclick="collectSiteStamp('${id}')">
        📮 Collect Stamp
      </button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px;" class="heritage-info-grid">
      <div class="card" style="padding:24px;">
        <div style="font-family:var(--font-display);font-size:18px;font-weight:700;margin-bottom:12px;">Historical Significance</div>
        <p style="font-size:14px;color:var(--sepia-mid);line-height:1.8;">${loc.significance}</p>
      </div>
      <div class="card" style="padding:24px;">
        <div style="font-family:var(--font-display);font-size:18px;font-weight:700;margin-bottom:12px;">Key Facts</div>
        <ul style="list-style:none;">
          ${loc.facts.map(f => `<li style="font-size:13px;color:var(--sepia-mid);padding:4px 0;border-bottom:1px solid var(--border-aged);">✦ ${f}</li>`).join('')}
        </ul>
      </div>
    </div>

    <h3 style="font-family:var(--font-display);font-size:22px;font-weight:700;margin-bottom:16px;">About This Place</h3>
    <p style="font-size:15px;color:var(--sepia-dark);line-height:1.9;margin-bottom:32px;">${loc.desc}</p>

    <div class="explorer-note">
      <p>"Every building in Kolkata is a palimpsest — layers of history, each era written over but never quite erasing what came before. To visit ${loc.name} is to read several centuries at once."</p>
      <div class="explorer-note-author">— Explorer's Field Notes, CalKotha</div>
    </div>

    <h3 style="font-family:var(--font-display);font-size:22px;font-weight:700;margin:32px 0 16px;">Connected Stories</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-bottom:32px;">
      ${loc.stories.map(s => {
        const story = STORIES.find(st => st.title === s || st.title.toLowerCase().includes(s.toLowerCase().split(' ')[0]));
        return `
          <div class="card" style="cursor:pointer;" onclick="${story ? `openStory('${story.id}')` : ''}">
            <div style="font-size:24px;margin-bottom:8px;">${story ? story.icon : '📖'}</div>
            <div style="font-family:var(--font-display);font-size:15px;font-weight:700;color:var(--sepia-deep);">${s}</div>
            ${story ? `<p style="font-size:12px;color:var(--sepia-mid);margin-top:6px;">⏱ ${story.readTime}</p>` : ''}
          </div>`;
      }).join('')}
    </div>

    <h3 style="font-family:var(--font-display);font-size:22px;font-weight:700;margin:32px 0 16px;">Visual Gallery</h3>
    <div class="gallery-grid">
      ${[loc.icon, '🌅', '🏛️', '📸', '🌿', '🔭'].map(icon => `
        <div class="gallery-item">${icon}</div>
      `).join('')}
    </div>

    <div style="margin:40px 0;padding:24px;background:linear-gradient(135deg,rgba(201,162,39,0.06),transparent);border:1px solid rgba(201,162,39,0.2);border-radius:4px;text-align:center;">
      <div style="font-family:var(--font-special);font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--tram-gold);margin-bottom:8px;">AR TIME TRAVEL</div>
      <div style="font-family:var(--font-display);font-size:18px;font-weight:700;margin-bottom:8px;">View Historical Reconstruction</div>
      <p style="font-size:13px;color:var(--sepia-mid);">Use AR Time Travel to see historical overlays and before/after comparisons of this location.</p>
      <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="AR_MODULE.launch('${id}')">
        <i class="fa fa-camera"></i> Open in AR Time Travel
      </button>
    </div>
  `;

  // Add CSS for responsive grid on mobile
  const style = document.createElement('style');
  style.textContent = '@media(max-width:640px){.heritage-info-grid{grid-template-columns:1fr!important;}}';
  body.appendChild(style);

  showPage('heritage');

  // Track visit
  if (!STATE.visited.includes(id)) {
    STATE.visited.push(id);
    addXP(100);
    showToast(`📍 New location discovered! +100 XP`);
    checkAchievement('visited_5');
    saveState();
  }
}

function collectSiteStamp(id) {
  if (!STATE.stampDates) STATE.stampDates = {};
  if (STATE.stamps.includes(id)) { showToast('📮 You already have this stamp!'); return; }
  const stamp = STAMPS.find(s => s.id === id || id.includes(s.id) || s.id.includes(id.split('-')[0]));
  STATE.stamps.push(id);
  STATE.stampDates[id] = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  if (stamp) stamp.earned = true;
  addXP(50);
  showToast(`📮 Stamp collected: ${stamp ? stamp.name : id}! +50 XP`);
  checkAchievement('stamps_5');
  saveState();
  populatePassportPage();
}

// ─── MAP ──────────────────────────────────────────────────────

let mapInitialized = false;

function initMap() {
  if (mapInitialized) return;
  mapInitialized = true;

  const map = L.map('map', {
    center: [22.5726, 88.3639],
    zoom: 13,
    zoomControl: true
  });

  STATE.mapInstance = map;

  // Vintage-style tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // Custom marker icon creator
  function createCustomIcon(emoji, category) {
    const colors = {
      colonial: '#1B3A6B',
      religious: '#8B5E3C',
      cultural: '#8B1A1A',
      educational: '#2D5016',
      hidden: '#C9A227',
      monument: '#4A2C17'
    };
    const bg = colors[category] || '#8B1A1A';
    return L.divIcon({
      className: '',
      html: `<div style="
        background:${bg};border:2px solid #C9A227;
        width:38px;height:38px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,0.4);
        cursor:pointer;transition:all 0.2s;
      ">${emoji}</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });
  }

  // Add all markers
  STATE.mapMarkers = [];
  LOCATIONS.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], {
      icon: createCustomIcon(loc.icon, loc.category)
    }).addTo(map);

    const isFav = STATE.favorites.locations.includes(loc.id);
    marker.bindPopup(`
      <div class="map-popup-title">${loc.icon} ${loc.name}</div>
      <div class="map-popup-desc">${loc.significance}</div>
      <div class="map-popup-footer">
        <span class="badge badge-${loc.category}">${loc.category}</span>
        <button class="map-popup-btn" onclick="openHeritageSite('${loc.id}')">Explore →</button>
        <button class="map-popup-btn" onclick="collectSiteStamp('${loc.id}')">📮 Stamp</button>
      </div>
    `, { maxWidth: 280, className: 'calkotha-popup' });

    marker.locationData = loc;
    STATE.mapMarkers.push(marker);
  });
}

function setMapFilter(filter, btn) {
  STATE.mapFilter = filter;
  document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (!STATE.mapInstance) return;

  if (filter === 'tram') {
    // Show all markers but highlight tram stops
    STATE.mapMarkers.forEach(m => m.addTo(STATE.mapInstance));
    showTramOverlayOnMap();
    return;
  }

  // Remove tram polylines if any
  if (STATE.tramPolylines) {
    STATE.tramPolylines.forEach(p => STATE.mapInstance.removeLayer(p));
    STATE.tramPolylines = [];
  }

  STATE.mapMarkers.forEach(m => {
    const loc = m.locationData;
    if (filter === 'all' || loc.category === filter) {
      m.addTo(STATE.mapInstance);
    } else {
      STATE.mapInstance.removeLayer(m);
    }
  });
}

function showTramOverlayOnMap() {
  if (!STATE.mapInstance) return;
  if (!STATE.tramPolylines) STATE.tramPolylines = [];

  // Draw tram route lines on map
  TRAM_ROUTES.forEach(route => {
    const coords = route.stops.map(s => [s.lat, s.lng]);
    const line = L.polyline(coords, {
      color: '#C9A227',
      weight: 4,
      opacity: 0.8,
      dashArray: route.id === 'tr5' ? '8,6' : null
    }).addTo(STATE.mapInstance);
    line.bindPopup(`<div class="map-popup-title">🚃 Route ${route.number}: ${route.name}</div><div class="map-popup-desc">${route.from} → ${route.to}</div>`);
    STATE.tramPolylines.push(line);

    // Add tram stop markers
    route.stops.forEach(stop => {
      const marker = L.circleMarker([stop.lat, stop.lng], {
        radius: 7, color: '#C9A227', fillColor: '#8B1A1A',
        fillOpacity: 1, weight: 2
      }).addTo(STATE.mapInstance);
      marker.bindPopup(`<div class="map-popup-title">🚃 ${stop.name}</div><div class="map-popup-desc">Tram Stop · Route ${route.number}</div>`);
      STATE.tramPolylines.push(marker);
    });
  });

  STATE.mapInstance.setView([22.5726, 88.3639], 13);
  showToast('🚃 Tram routes displayed on map!');
}

function getUserLocation() {
  if (!navigator.geolocation) {
    showToast('📍 Geolocation not supported by your browser');
    return;
  }
  showToast('📡 Getting your location...');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      if (!STATE.mapInstance) { initMap(); }
      setTimeout(() => {
        if (STATE.userLocationMarker) STATE.mapInstance.removeLayer(STATE.userLocationMarker);
        STATE.userLocationMarker = L.circleMarker([lat, lng], {
          radius: 12, color: '#C9A227', fillColor: '#8B1A1A',
          fillOpacity: 0.9, weight: 3
        }).addTo(STATE.mapInstance);
        STATE.userLocationMarker.bindPopup('<div class="map-popup-title">📍 You Are Here</div>');
        STATE.mapInstance.setView([lat, lng], 15);
        showToast('📍 Location found! You are on the map.');
      }, 500);
    },
    () => { showToast('📍 Could not access your location.'); }
  );
}

function filterMapMarkers(query) {
  if (!STATE.mapInstance) return;
  const q = query.toLowerCase();
  STATE.mapMarkers.forEach(m => {
    const loc = m.locationData;
    const match = !q || loc.name.toLowerCase().includes(q) || loc.area.toLowerCase().includes(q);
    if (match) m.addTo(STATE.mapInstance);
    else STATE.mapInstance.removeLayer(m);
  });
}

// ─── SEARCH ───────────────────────────────────────────────────

let searchFilterActive = 'all';

function setSearchFilter(filter, btn) {
  searchFilterActive = filter;
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  performSearch(document.getElementById('searchInput').value);
}

function performSearch(query) {
  const q = query.toLowerCase().trim();
  let results = LOCATIONS.filter(loc => {
    const matchFilter = searchFilterActive === 'all' || loc.category === searchFilterActive;
    const matchQuery = !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.area.toLowerCase().includes(q) ||
      loc.style.toLowerCase().includes(q) ||
      loc.desc.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  populateSearchGrid(results);

  const countEl = document.getElementById('searchCount');
  if (countEl) countEl.textContent = `Showing ${results.length} heritage ${results.length === 1 ? 'location' : 'locations'}`;

  // Suggestions
  const sugBox = document.getElementById('searchSuggestions');
  if (q && results.length > 0) {
    sugBox.style.display = 'block';
    sugBox.innerHTML = results.slice(0, 5).map(r => `
      <div class="suggestion-item" onclick="openHeritageSite('${r.id}');document.getElementById('searchSuggestions').style.display='none'">
        <span class="suggestion-icon">${r.icon}</span>${r.name}
      </div>
    `).join('');
  } else {
    sugBox.style.display = 'none';
  }
}

function populateSearchGrid(locs) {
  const grid = document.getElementById('searchResultsGrid');
  if (!grid) return;
  if (locs.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">🔍</div><div class="empty-state-title">No Results</div><p class="empty-state-desc">Try different search terms or categories</p></div>`;
    return;
  }
  grid.innerHTML = locs.map(loc => createLocationCard(loc)).join('');
}

// ─── MISSIONS ─────────────────────────────────────────────────

function setMissionTab(tab, btn) {
  STATE.missionTab = tab;
  document.querySelectorAll('.missions-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  populateMissionsGrid(tab);
}

function populateMissionsGrid(tab) {
  const grid = document.getElementById('missionsGrid');
  if (!grid) return;

  let missions = MISSIONS;
  if (tab !== 'all') {
    if (tab === 'completed') missions = MISSIONS.filter(m => STATE.completedMissions.includes(m.id));
    else if (tab === 'active') missions = MISSIONS.filter(m => !STATE.completedMissions.includes(m.id) && m.type !== 'daily');
    else missions = MISSIONS.filter(m => m.type === tab);
  }

  if (missions.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">🎯</div><div class="empty-state-title">No Missions</div><p class="empty-state-desc">Complete other missions or check back later</p></div>`;
    return;
  }

  grid.innerHTML = missions.map(m => {
    const completed = STATE.completedMissions.includes(m.id);
    const dots = Array(5).fill(0).map((_, i) => `<div class="difficulty-dot ${i < m.difficulty ? 'filled' : ''}"></div>`).join('');
    return `
    <div class="mission-card ${completed ? 'completed' : ''}">
      <div class="mission-card-header">
        <div class="mission-card-icon">${m.icon}</div>
        <div>
          <div class="mission-card-title">${m.title}</div>
          <div class="mission-card-cat">${m.category} · ${m.type}</div>
        </div>
      </div>
      <div class="mission-card-body">
        <p class="mission-card-desc">${m.desc}</p>
        <div class="mission-card-objective"><strong>Objective:</strong> ${m.objective}</div>
        <div class="mission-rewards">
          <div class="mission-reward">⭐ ${m.xpReward} XP</div>
          <div class="mission-reward">${m.badge} ${m.badgeName}</div>
        </div>
        <div class="mission-difficulty">
          <span style="font-family:var(--font-special);font-size:10px;letter-spacing:1px;color:var(--sepia-mid);margin-right:8px;">Difficulty</span>
          ${dots}
        </div>
      </div>
      <div class="mission-card-footer">
        ${completed
          ? `<span style="color:var(--tram-green);font-family:var(--font-special);font-size:11px;letter-spacing:2px;">✓ COMPLETED</span>`
          : `<button class="btn btn-primary btn-sm w-full" style="justify-content:center;" onclick="startMission('${m.id}')">
               <i class="fa fa-play"></i> Start Mission
             </button>`
        }
      </div>
    </div>`;
  }).join('');
}

function startMission(id) {
  const mission = MISSIONS.find(m => m.id === id);
  if (!mission) return;
  if (STATE.completedMissions.includes(id)) { showToast('✅ Mission already completed!'); return; }

  if (mission.type === 'daily' && mission.category === 'story') {
    showToast(`📖 "${mission.title}": Read a story to complete this mission!`);
    setTimeout(() => showPage('stories-page'), 1200);
  } else if (mission.type === 'story') {
    showToast(`📖 "${mission.title}": Read the connected stories to complete this mission.`);
    setTimeout(() => showPage('stories-page'), 1200);
  } else {
    showToast(`🎯 Mission "${mission.title}" started! Explore the map to complete it.`);
    setTimeout(() => showPage('map-page'), 1000);
  }
}

function completeMission(id) {
  if (STATE.completedMissions.includes(id)) return;
  const mission = MISSIONS.find(m => m.id === id);
  if (!mission) return;

  STATE.completedMissions.push(id);
  addXP(mission.xpReward);
  showToast(`${mission.badge} Mission complete! "${mission.title}" — +${mission.xpReward} XP`);
  unlockAchievement({ id: `mission_${id}`, name: mission.badgeName, icon: mission.badge, desc: `Completed: ${mission.title}` });
  syncMissionStats();
  saveState();
}

function syncMissionStats() {
  const totalXPEl = document.getElementById('totalXP');
  const completedEl = document.getElementById('completedMissions');
  const activeEl = document.getElementById('activeMissions');
  if (totalXPEl) totalXPEl.textContent = STATE.xp;
  if (completedEl) completedEl.textContent = STATE.completedMissions.length;
  if (activeEl) activeEl.textContent = MISSIONS.length - STATE.completedMissions.length;
}

// ─── PASSPORT ─────────────────────────────────────────────────

function populatePassportPage() {
  // Update stats
  if (STATE.user) {
    const nameEl = document.getElementById('passportName');
    if (nameEl) nameEl.textContent = STATE.user.name;
  }

  const stampsEl = document.getElementById('passportStamps');
  const xpEl = document.getElementById('passportXP');
  const visitedEl = document.getElementById('passportVisited');
  const achEl = document.getElementById('passportAchievements');

  if (stampsEl) stampsEl.textContent = STATE.stamps.length;
  if (xpEl) xpEl.textContent = STATE.xp;
  if (visitedEl) visitedEl.textContent = STATE.visited.length;
  if (achEl) achEl.textContent = STATE.achievements.filter(a => a.unlocked).length;

  // Stamp pages
  populateStampPages();
  populateAchievementsGrid();
}

function populateStampPages() {
  const container = document.getElementById('stampPages');
  if (!container) return;

  const pageCount = Math.ceil(STAMPS.length / 6);
  let html = '';

  for (let p = 0; p < pageCount; p++) {
    const pageStamps = STAMPS.slice(p * 6, (p + 1) * 6);
    html += `
    <div class="passport-page">
      <div class="passport-page-title">Heritage Stamps — Page ${p + 1}</div>
      <div class="stamps-grid">
        ${pageStamps.map(s => {
          const earned = STATE.stamps.includes(s.id) || s.earned;
          const dateEarned = earned ? (STATE.stampDates && STATE.stampDates[s.id]) || '2026' : null;
          return `
          <div class="stamp-slot ${earned ? 'earned' : 'empty'}" title="${earned ? s.name : 'Not yet collected'}">
            ${earned ? `
              <span class="stamp-icon">${s.icon}</span>
              <span class="stamp-label">${s.name}</span>
              <span style="font-size:9px;color:var(--sepia-mid);margin-top:2px;">${dateEarned}</span>
              <span style="font-size:9px;color:var(--tram-gold);font-family:var(--font-special);letter-spacing:1px;">✓ VERIFIED</span>
            ` : `<span style="font-size:26px;color:var(--border-aged);">?</span><span class="stamp-label" style="color:var(--border-aged);">Locked</span>`}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  container.innerHTML = html;
}

function populateAchievementsGrid() {
  const grid = document.getElementById('achievementsGrid');
  if (!grid) return;

  const allAchievements = [...ACHIEVEMENTS, ...STATE.achievements.filter(a => !ACHIEVEMENTS.find(b => b.id === a.id))];

  grid.innerHTML = allAchievements.map(a => `
    <div class="achievement-card ${a.unlocked ? 'unlocked' : 'locked'}">
      <div class="achievement-icon">${a.icon}</div>
      <div class="achievement-name">${a.name}</div>
      <p class="achievement-desc">${a.desc}</p>
      ${a.unlocked ? '<div style="font-family:var(--font-special);font-size:9px;letter-spacing:2px;color:var(--tram-gold);margin-top:8px;">UNLOCKED</div>' : '<div style="font-family:var(--font-special);font-size:9px;letter-spacing:1px;color:var(--border-aged);margin-top:8px;">LOCKED</div>'}
    </div>
  `).join('');
}

function animateProgress() {
  const total = LOCATIONS.length;
  const visited = STATE.visited.length;
  const pct = Math.round((visited / total) * 100);

  const bar = document.getElementById('progressBar');
  const pctEl = document.getElementById('progressPct');
  const descEl = document.getElementById('progressDesc');

  if (bar) setTimeout(() => { bar.style.width = pct + '%'; }, 100);
  if (pctEl) pctEl.textContent = pct + '%';
  if (descEl) descEl.textContent = `${visited} of ${total} locations visited`;
}

// ─── FAVORITES ────────────────────────────────────────────────

function toggleFavorite(type, id) {
  const arr = STATE.favorites[type + 's'] || STATE.favorites.locations;
  const idx = arr.indexOf(id);
  if (idx === -1) {
    arr.push(id);
    showToast('❤️ Added to favorites!');
  } else {
    arr.splice(idx, 1);
    showToast('🤍 Removed from favorites');
  }
  updateNavBadges();
  saveState();
}

function setFavTab(tab, btn) {
  STATE.favTab = tab;
  document.querySelectorAll('.favorites-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  populateFavorites();
}

function populateFavorites() {
  const content = document.getElementById('favoritesContent');
  if (!content) return;

  const tab = STATE.favTab;
  let items = [];

  if (tab === 'locations') {
    items = LOCATIONS.filter(l => STATE.favorites.locations.includes(l.id));
    if (items.length === 0) {
      content.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🗺️</div><div class="empty-state-title">No Saved Locations</div><p class="empty-state-desc">Explore the map and save locations you love</p><button class="btn btn-primary" onclick="showPage('map-page')">Open Map</button></div>`;
      return;
    }
    content.innerHTML = `<div class="locations-grid">${items.map(l => createLocationCard(l)).join('')}</div>`;
  } else if (tab === 'stories') {
    items = STORIES.filter(s => STATE.favorites.stories && STATE.favorites.stories.includes(s.id));
    if (items.length === 0) {
      content.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📖</div><div class="empty-state-title">No Saved Stories</div><p class="empty-state-desc">Read stories and save your favorites</p><button class="btn btn-primary" onclick="showPage('stories-page')">Browse Stories</button></div>`;
      return;
    }
    content.innerHTML = `<div class="stories-list-grid">${items.map(s => `<div class="story-list-card" onclick="openStory('${s.id}')"><div class="story-list-card-header">${s.icon}</div><div class="story-list-card-body"><div class="story-list-card-title">${s.title}</div><p class="story-list-card-excerpt">${s.excerpt}</p></div></div>`).join('')}</div>`;
  } else {
    // Routes
    items = ROUTES.filter(r => STATE.favorites.routes && STATE.favorites.routes.includes(r.id));
    if (items.length === 0) {
      content.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🗺️</div><div class="empty-state-title">No Saved Routes</div><p class="empty-state-desc">Save heritage routes for easy access</p><button class="btn btn-primary" onclick="showPage('home')">Browse Routes</button></div>`;
      return;
    }
    content.innerHTML = `<div class="routes-grid">${items.map(r => `<div class="route-card" onclick="startRoute('${r.id}')"><div class="route-icon">${r.icon}</div><div class="route-name">${r.name}</div><p class="route-desc">${r.desc}</p></div>`).join('')}</div>`;
  }
}

// ─── XP & ACHIEVEMENTS ────────────────────────────────────────

function addXP(amount) {
  STATE.xp += amount;
  updateNavBadges();
  checkAchievement('xp_1000');
  saveState();
  syncMissionStats();
}

function checkAchievement(condition) {
  ACHIEVEMENTS.forEach(a => {
    if (a.condition === condition && !a.unlocked) {
      let pass = false;
      if (condition === 'xp_1000' && STATE.xp >= 1000) pass = true;
      if (condition === 'visited_5' && STATE.visited.length >= 5) pass = true;
      if (condition === 'stamps_5' && STATE.stamps.length >= 5) pass = true;
      if (condition === 'passport_created' && STATE.user) pass = true;
      if (condition === 'story_read') pass = true;
      if (condition === 'hidden_found') pass = true;
      if (pass) unlockAchievement(a);
    }
  });
}

function unlockAchievement(achievement) {
  achievement.unlocked = true;
  if (!STATE.achievements.find(a => a.id === achievement.id)) {
    STATE.achievements.push({ ...achievement, unlocked: true });
  }

  // Show banner
  const banner = document.getElementById('achievementBanner');
  const iconEl = document.getElementById('achievementBannerIcon');
  const nameEl = document.getElementById('achievementBannerName');

  if (banner && iconEl && nameEl) {
    iconEl.textContent = achievement.icon;
    nameEl.textContent = achievement.name;
    banner.classList.add('show');
    setTimeout(() => banner.classList.remove('show'), 4000);
  }

  saveState();
}

function updateNavBadges() {
  const favCount = document.getElementById('favCount');
  const xpBadge = document.getElementById('xpBadge');
  const totalFavs = STATE.favorites.locations.length + (STATE.favorites.stories || []).length + (STATE.favorites.routes || []).length;
  if (favCount) favCount.textContent = totalFavs;
  if (xpBadge) xpBadge.textContent = STATE.xp;
}

// ─── ROUTE ────────────────────────────────────────────────────

function startRoute(id) {
  const route = ROUTES.find(r => r.id === id);
  if (!route) return;
  showToast(`🗺️ Route "${route.name}" loaded! Follow the golden trail.`);
  showPage('map-page');
  setTimeout(() => {
    if (!STATE.mapInstance) return;
    // Clear previous route overlays
    if (STATE.activeRouteLayers) {
      STATE.activeRouteLayers.forEach(l => STATE.mapInstance.removeLayer(l));
    }
    STATE.activeRouteLayers = [];

    const locs = route.locations.map(lid => LOCATIONS.find(l => l.id === lid)).filter(Boolean);
    if (locs.length < 2) return;

    const coords = locs.map(l => [l.lat, l.lng]);

    // Draw thick background line (shadow effect)
    const shadow = L.polyline(coords, { color: '#000', weight: 8, opacity: 0.3 }).addTo(STATE.mapInstance);
    STATE.activeRouteLayers.push(shadow);

    // Draw main thick route line
    const line = L.polyline(coords, { color: '#C9A227', weight: 6, opacity: 0.95 }).addTo(STATE.mapInstance);
    STATE.activeRouteLayers.push(line);

    // Add direction arrows using decorators approach (manual midpoint arrows)
    for (let i = 0; i < coords.length - 1; i++) {
      const mid = [(coords[i][0] + coords[i+1][0]) / 2, (coords[i][1] + coords[i+1][1]) / 2];
      const arrowMarker = L.marker(mid, {
        icon: L.divIcon({
          className: '',
          html: `<div style="font-size:18px;color:#C9A227;text-shadow:0 0 6px #000;transform:rotate(90deg)">▶</div>`,
          iconSize: [22, 22], iconAnchor: [11, 11]
        })
      }).addTo(STATE.mapInstance);
      STATE.activeRouteLayers.push(arrowMarker);
    }

    // Add numbered checkpoint markers
    locs.forEach((loc, i) => {
      const isStart = i === 0;
      const isEnd = i === locs.length - 1;
      const label = isStart ? 'S' : isEnd ? 'E' : String(i + 1);
      const bg = isStart ? '#2D5016' : isEnd ? '#8B1A1A' : '#1B3A6B';
      const checkMarker = L.marker([loc.lat, loc.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="background:${bg};border:3px solid #C9A227;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-weight:900;font-size:14px;color:#C9A227;box-shadow:0 4px 14px rgba(0,0,0,0.6);">${label}</div>`,
          iconSize: [34, 34], iconAnchor: [17, 17]
        })
      }).addTo(STATE.mapInstance);
      checkMarker.bindPopup(`<div class="map-popup-title">${isStart?'🟢 START':''}${isEnd?'🔴 END':''} ${!isStart&&!isEnd?`#${i+1}`:''}  ${loc.icon} ${loc.name}</div><div class="map-popup-desc">${loc.significance}</div><div class="map-popup-footer"><button class="map-popup-btn" onclick="openHeritageSite('${loc.id}')">Explore →</button></div>`, { maxWidth: 260, className: 'calkotha-popup' });
      STATE.activeRouteLayers.push(checkMarker);
    });

    // Fit map to show full route with padding
    const bounds = L.latLngBounds(coords).pad(0.15);
    STATE.mapInstance.fitBounds(bounds);

    // Show route info panel
    showRouteInfoPanel(route, locs);
  }, 600);
}

function showRouteInfoPanel(route, locs) {
  // Remove existing panel
  const old = document.getElementById('routeInfoPanel');
  if (old) old.remove();

  const panel = document.createElement('div');
  panel.id = 'routeInfoPanel';
  panel.style.cssText = 'position:absolute;bottom:20px;left:50%;transform:translateX(-50%);z-index:1000;background:linear-gradient(135deg,rgba(26,10,4,0.97),rgba(44,24,16,0.97));border:1px solid var(--tram-gold);border-radius:6px;padding:16px 20px;min-width:320px;max-width:90vw;box-shadow:0 8px 32px rgba(0,0,0,0.6);';
  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <div style="font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--tram-gold);">${route.icon} ${route.name}</div>
      <button onclick="document.getElementById('routeInfoPanel').remove()" style="background:none;border:none;color:var(--sepia-pale);font-size:16px;cursor:pointer;">✕</button>
    </div>
    <div style="display:flex;gap:16px;font-family:var(--font-special);font-size:10px;letter-spacing:1px;color:var(--sepia-light);margin-bottom:10px;">
      <span>🗺️ ${locs.length} stops</span>
      <span>⏱ ${route.duration}</span>
      <span>⭐ +${route.xp} XP</span>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;">
      ${locs.map((l,i) => `<span style="background:rgba(201,162,39,0.12);border:1px solid rgba(201,162,39,0.3);border-radius:3px;padding:2px 8px;font-size:11px;color:var(--sepia-pale);">${i===0?'🟢 ':''}${i===locs.length-1?'🔴 ':''}${l.icon} ${l.name}</span>`).join('')}
    </div>
    <button class="btn btn-primary btn-sm" style="margin-top:12px;width:100%;justify-content:center;" onclick="completeMission('m2');document.getElementById('routeInfoPanel').remove();">
      ✓ Mark Route Complete (+${route.xp} XP)
    </button>
  `;
  const mapEl = document.getElementById('map');
  if (mapEl) mapEl.appendChild(panel);
}

// ─── PASSPORT ONBOARDING ─────────────────────────────────────

function openOnboarding() {
  openModal('onboardingModal');
}

function createPassport() {
  const name = document.getElementById('onboardName').value.trim();
  if (!name) { showToast('Please enter your explorer name!'); return; }

  STATE.user = { name, joinDate: new Date().toISOString().split('T')[0] };
  document.getElementById('passportName').textContent = name;
  document.getElementById('passportMeta').textContent = `Heritage Explorer · Member since ${new Date().getFullYear()}`;

  const profileInput = document.getElementById('profileName');
  if (profileInput) profileInput.value = name;

  closeModal('onboardingModal');
  showToast(`🎉 Welcome, ${name}! Your heritage passport is ready.`);
  checkAchievement('passport_created');
  addXP(100);
  saveState();

  setTimeout(() => showPage('passport'), 1500);
}

// ─── SETTINGS ─────────────────────────────────────────────────

function selectAvatar(emoji) {
  document.getElementById('profileAvatarDisplay').textContent = emoji;
  if (!STATE.user) STATE.user = {};
  STATE.user.avatar = emoji;
  document.querySelectorAll('.avatar-pick').forEach(el => el.style.borderColor = 'transparent');
  event.target.style.borderColor = 'var(--tram-gold)';
}

function saveProfile() {
  const name = document.getElementById('profileName').value.trim();
  const bio = document.getElementById('profileBio') ? document.getElementById('profileBio').value.trim() : '';
  const title = document.getElementById('profileTitle') ? document.getElementById('profileTitle').value : '';
  const avatar = document.getElementById('profileAvatarDisplay') ? document.getElementById('profileAvatarDisplay').textContent : '👤';
  if (!name) { showToast('Please enter your explorer name!'); return; }
  if (!STATE.user) STATE.user = {};
  STATE.user.name = name;
  STATE.user.bio = bio;
  STATE.user.title = title;
  STATE.user.avatar = avatar;
  const passportNameEl = document.getElementById('passportName');
  if (passportNameEl) passportNameEl.textContent = name;
  const passportMetaEl = document.getElementById('passportMeta');
  if (passportMetaEl) passportMetaEl.textContent = `${title || 'Heritage Explorer'} · Member since ${new Date().getFullYear()}`;
  showToast('✅ Profile saved!');
  saveState();
}

function toggleSetting(key, el) {
  el.classList.toggle('on');
  STATE.settings[key] = el.classList.contains('on');
  saveState();
}

function clearAllData() {
  if (confirm('Are you sure? This will reset all your progress, stamps, and favorites.')) {
    localStorage.removeItem('calkotha_state');
    location.reload();
  }
}

// ─── LANDMARK SUBMISSION ─────────────────────────────────────

function openLandmarkSubmit() {
  showPage('landmark-submit');
}

function submitLandmark() {
  const name = document.getElementById('lmName').value.trim();
  const desc = document.getElementById('lmDesc').value.trim();
  if (!name || !desc) {
    showToast('Please fill in the landmark name and description!');
    return;
  }

  // In production, this would POST to an API
  addXP(200);
  showToast('📍 Landmark submitted for review! +200 XP earned. You\'ll earn a Heritage Scout badge when approved.');
  unlockAchievement({ id: 'heritage-scout', name: 'Heritage Scout', icon: '🔭', desc: 'Submitted a landmark for review', unlocked: true });

  // Clear form
  ['lmName','lmDesc','lmCat','lmLat','lmLng','lmNotes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  setTimeout(() => goBack(), 2000);
}

// ─── MODAL ────────────────────────────────────────────────────

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// Close modals on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ─── TOAST ────────────────────────────────────────────────────

let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('mainToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── KEYBOARD ─────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    // Close any open modals
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    document.getElementById('mobileMenu').classList.remove('open');
  }
});

// ─── SCROLL REVEAL (re-observe on page change) ────────────────

function observeNewRevealElements() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

// Observe after a short delay to allow DOM updates — merged into master showPage
// (no override needed here anymore)

// ─── SERVICE WORKER REGISTRATION ─────────────────────────────

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // SW not available in all environments — silently ignore
    });
  });
}

// ─── AR MODULE ───────────────────────────────────────────────
const AR_MODULE = {
  initialized: false,
  supported: false,
  init() {
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => { this.supported = supported; })
        .catch(() => {});
    }
  },
  launch(locationId) {
    showPage('ar-page');
    setTimeout(() => selectARSite(locationId), 400);
  }
};

AR_MODULE.init();

// ─── TRAM DATA ────────────────────────────────────────────────

const TRAM_ROUTES = [
  {
    id: 'tr1', number: '3', name: 'Esplanade–Shyambazar',
    from: 'Esplanade', to: 'Shyambazar',
    duration: '35 min', fare: '₹7', heritage: ['victoria','jorasanko','marble-palace'],
    color: '#C9A227',
    desc: 'The oldest surviving tram route in Asia, connecting the colonial heart to the cultural north.',
    stops: [
      { name: 'Esplanade', lat: 22.5553, lng: 88.3512 },
      { name: 'BBD Bagh', lat: 22.5689, lng: 88.3480 },
      { name: 'Girish Park', lat: 22.5789, lng: 88.3543 },
      { name: 'Shyambazar', lat: 22.5880, lng: 88.3621 }
    ],
    stories: ['The Electric Revolution of 1902', 'Tram Workers of Bengal']
  },
  {
    id: 'tr2', number: '9', name: 'Howrah Bridge–Kalighat',
    from: 'Howrah Bridge', to: 'Kalighat',
    duration: '45 min', fare: '₹8', heritage: ['howrah','victoria','kalighat'],
    color: '#8B1A1A',
    desc: 'From the iron bridge to the sacred temple — a ride through colonial and sacred Kolkata.',
    stops: [
      { name: 'Howrah Bridge', lat: 22.5851, lng: 88.3468 },
      { name: 'Dalhousie', lat: 22.5695, lng: 88.3486 },
      { name: 'Esplanade', lat: 22.5553, lng: 88.3512 },
      { name: 'Rashbehari', lat: 22.5297, lng: 88.3568 },
      { name: 'Kalighat', lat: 22.5212, lng: 88.3437 }
    ],
    stories: ['Sacred Routes of the City', 'The Tram That Saw Independence']
  },
  {
    id: 'tr3', number: '12', name: 'College Street–Tollygunge',
    from: 'College Street', to: 'Tollygunge',
    duration: '50 min', fare: '₹9', heritage: ['college-street','indian-museum'],
    color: '#2D5016',
    desc: 'An intellectual and artistic journey from the book-lined streets of North Kolkata to the film studios of the south.',
    stops: [
      { name: 'College Street', lat: 22.5762, lng: 88.3591 },
      { name: 'Dharmatala', lat: 22.5553, lng: 88.3512 },
      { name: 'Kalighat', lat: 22.5212, lng: 88.3437 },
      { name: 'Tollygunge', lat: 22.4986, lng: 88.3417 }
    ],
    stories: ['Celluloid and Ink', 'The Scholar\'s Commute']
  },
  {
    id: 'tr4', number: '6', name: 'Sealdah–Gariahat',
    from: 'Sealdah', to: 'Gariahat',
    duration: '40 min', fare: '₹7', heritage: ['nakhoda-masjid','st-pauls'],
    color: '#1B3A6B',
    desc: 'Through the beating commercial heart of Kolkata, past markets and mosques, south to the residential leafy avenues.',
    stops: [
      { name: 'Sealdah', lat: 22.5657, lng: 88.3700 },
      { name: 'S.N. Banerjee Road', lat: 22.5600, lng: 88.3560 },
      { name: 'Park Circus', lat: 22.5389, lng: 88.3676 },
      { name: 'Gariahat', lat: 22.5181, lng: 88.3694 }
    ],
    stories: ['Markets of Memory', 'Night Rides on Route 6']
  },
  {
    id: 'tr5', number: '37', name: 'Esplanade–Science City (Heritage)',
    from: 'Esplanade', to: 'Science City',
    duration: '55 min', fare: '₹10', heritage: ['victoria','indian-museum'],
    color: '#9E8E7E',
    desc: 'The newest operational route — an east-west heritage corridor created to preserve tram culture.',
    stops: [
      { name: 'Esplanade', lat: 22.5553, lng: 88.3512 },
      { name: 'Park Street', lat: 22.5447, lng: 88.3536 },
      { name: 'Loudon Street', lat: 22.5399, lng: 88.3574 },
      { name: 'Science City', lat: 22.5338, lng: 88.3941 }
    ],
    stories: ['The Last Trams of Calcutta']
  }
];

const TRAM_STATIONS = [
  { id: 'ts1', name: 'Esplanade Depot', icon: '🏭', desc: 'The main tram depot of Kolkata, operational since 1902. Houses vintage tram cars from the colonial era.', routes: ['3','9','37'], lat: 22.5553, lng: 88.3512 },
  { id: 'ts2', name: 'BBD Bagh Terminus', icon: '🏛️', desc: 'Central terminus near Writers\' Building. Historically the most important tram junction in colonial Calcutta.', routes: ['3','4'], lat: 22.5689, lng: 88.3480 },
  { id: 'ts3', name: 'Shyambazar 5-point', icon: '⭐', desc: 'Famous five-point crossing at the heart of North Kolkata, surrounded by heritage buildings and the tram loop.', routes: ['3','5'], lat: 22.5880, lng: 88.3621 },
  { id: 'ts4', name: 'Kalighat Tram Stop', icon: '🛕', desc: 'Near the sacred Kalighat Temple. Pilgrims and tourists have alighted here since 1904.', routes: ['9','12'], lat: 22.5212, lng: 88.3437 },
  { id: 'ts5', name: 'Howrah Bridge Stop', icon: '🌉', desc: 'The iconic riverside stop beneath the cantilever bridge. One of the most photographed tram stops in Asia.', routes: ['9'], lat: 22.5851, lng: 88.3468 },
  { id: 'ts6', name: 'Tollygunge Terminus', icon: '🎬', desc: 'Southern terminus near Tollywood film studios. Named after the Toll bridge on the Adi Ganga.', routes: ['12'], lat: 22.4986, lng: 88.3417 }
];

const TRAM_MISSIONS = [
  { id: 'tm1', title: 'Tram Heritage Rider', icon: '🚃', desc: 'Board and complete at least 2 different tram routes across Kolkata.', xpReward: 350, badge: '🎫', badgeName: 'Tram Rider', type: 'tram' },
  { id: 'tm2', title: 'Iron Wheels, Golden History', icon: '⚙️', desc: 'Discover heritage sites along Route 3 — the oldest surviving tram route in Asia.', xpReward: 500, badge: '🚃', badgeName: 'Route 3 Explorer', type: 'tram' },
  { id: 'tm3', title: 'The Complete Network', icon: '🗺️', desc: 'Document all 5 tram routes on your explorer map by traveling each one.', xpReward: 1500, badge: '👑', badgeName: 'Tram Master', type: 'tram' }
];

// ─── TRAM PAGE ────────────────────────────────────────────────

function setTramTab(tab, btn) {
  STATE.tramTab = tab;
  document.querySelectorAll('.tram-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  populateTramPage(tab);
}

function populateTramPage(tab) {
  const container = document.getElementById('tramContent');
  if (!container) return;

  if (tab === 'routes') {
    container.innerHTML = `
      <div class="section-header" style="margin-bottom:32px;">
        <div class="section-label">Heritage Network</div>
        <h3 class="section-title">Kolkata Tram Routes</h3>
        <p class="section-desc">Explore 5 operational heritage routes of the world's oldest electric tram network outside Europe</p>
      </div>
      <div>
        ${TRAM_ROUTES.map(r => `
          <div class="tram-route-card" onclick="startTramJourney('${r.id}')">
            <div class="tram-route-header">
              <div class="tram-route-number">${r.number}</div>
              <div>
                <div class="tram-route-name">${r.name}</div>
                <div class="tram-route-meta">
                  <span>⏱ ${r.duration}</span>
                  <span style="margin:0 8px;">·</span>
                  <span>${r.fare}</span>
                  <span style="margin:0 8px;">·</span>
                  <span>${r.stops.length} stops</span>
                </div>
              </div>
            </div>
            <div class="tram-route-body">
              <p style="font-size:14px;color:var(--sepia-mid);margin-bottom:12px;">${r.desc}</p>
              <div class="tram-stops-row">
                ${r.stops.map((s, i) => `
                  <span class="tram-stop-badge ${i===0||i===r.stops.length-1?'style="border-color:var(--tram-gold)"':''}">${s.name}</span>
                  ${i < r.stops.length-1 ? '<span class="tram-stop-arrow">→</span>' : ''}
                `).join('')}
              </div>
              <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;">
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();startTramJourney('${r.id}')">
                  <i class="fa fa-play"></i> Start Journey
                </button>
                <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showTramOnMap('${r.id}')">
                  <i class="fa fa-map"></i> View on Map
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  else if (tab === 'stations') {
    container.innerHTML = `
      <div class="section-header" style="margin-bottom:32px;">
        <div class="section-label">Tram Network</div>
        <h3 class="section-title">Heritage Stations</h3>
      </div>
      ${TRAM_STATIONS.map(s => `
        <div class="tram-station-card">
          <div class="tram-station-icon">${s.icon}</div>
          <div>
            <div class="tram-station-name">${s.name}</div>
            <p class="tram-station-desc">${s.desc}</p>
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
              ${s.routes.map(r => `<span class="tram-stop-badge">Route ${r}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}`;
  }

  else if (tab === 'planner') {
    container.innerHTML = `
      <div class="section-header" style="margin-bottom:32px;">
        <div class="section-label">Journey Planner</div>
        <h3 class="section-title">Plan Your Tram Journey</h3>
      </div>
      <div class="tram-planner-box">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div class="form-group">
            <label class="form-label">From</label>
            <select class="form-input" id="tramFrom">
              <option value="">Select boarding stop...</option>
              ${TRAM_STATIONS.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">To</label>
            <select class="form-input" id="tramTo">
              <option value="">Select exit stop...</option>
              ${TRAM_STATIONS.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" style="width:100%;justify-content:center;" onclick="planTramJourney()">
          <i class="fa fa-search"></i> Find Tram Routes
        </button>
        <div id="tramPlannerResult"></div>
      </div>`;
  }

  else if (tab === 'stories') {
    container.innerHTML = `
      <div class="section-header" style="margin-bottom:32px;">
        <div class="section-label">Living Heritage</div>
        <h3 class="section-title">Tram Heritage Stories</h3>
      </div>
      <div class="stories-list-grid" style="padding:0;">
        ${TRAM_ROUTES.flatMap(r => r.stories).map(title => `
          <div class="story-list-card" onclick="showToast('📖 Full tram story coming soon — +50 XP preview!')">
            <div class="story-list-card-header">🚃</div>
            <div class="story-list-card-body">
              <div class="story-list-card-title">${title}</div>
              <p class="story-list-card-excerpt">A living heritage narrative from Kolkata's iconic tram network — stories of the city told from rails and windows.</p>
              <div class="story-list-card-footer">
                <span>📍 Kolkata Tram Network</span>
                <span>⏱ 5 min</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  else if (tab === 'missions') {
    container.innerHTML = `
      <div class="section-header" style="margin-bottom:32px;">
        <div class="section-label">Tram Exploration</div>
        <h3 class="section-title">Tram Missions</h3>
      </div>
      <div class="missions-grid" style="padding:0;">
        ${TRAM_MISSIONS.map(m => {
          const completed = STATE.completedMissions.includes(m.id);
          return `
          <div class="mission-card ${completed ? 'completed' : ''}">
            <div class="mission-card-header">
              <div class="mission-card-icon">${m.icon}</div>
              <div>
                <div class="mission-card-title">${m.title}</div>
                <div class="mission-card-cat">tram · ${m.type}</div>
              </div>
            </div>
            <div class="mission-card-body">
              <p class="mission-card-desc">${m.desc}</p>
              <div class="mission-rewards">
                <div class="mission-reward">⭐ ${m.xpReward} XP</div>
                <div class="mission-reward">${m.badge} ${m.badgeName}</div>
              </div>
            </div>
            <div class="mission-card-footer">
              ${completed
                ? `<span style="color:var(--tram-green);font-family:var(--font-special);font-size:11px;letter-spacing:2px;">✓ COMPLETED</span>`
                : `<button class="btn btn-primary btn-sm w-full" style="justify-content:center;" onclick="completeTramMission('${m.id}')"><i class="fa fa-train"></i> Accept Mission</button>`}
            </div>
          </div>`;
        }).join('')}
      </div>`;
  }
}

function startTramJourney(routeId) {
  const route = TRAM_ROUTES.find(r => r.id === routeId);
  if (!route) return;

  const tramFoods = {
    tr1: 'Putiram Sweets (College Street) for Sondesh, Indian Coffee House for Cutlet & Coffee',
    tr2: 'Arsalan (Park Circus) for Biryani, Flurys (Park Street) for Pastries',
    tr3: 'Bhojohori Manna (Hindustan Park) for Bengali Thali, Indian Coffee House',
    tr4: 'Balwant Singh\'s Dhaba for Dal Makhani, Nizams (New Market) for Kati Roll',
    tr5: 'Peter Cat (Park Street) for Chelo Kebab, Mocambo for Continental'
  };

  showToast(`🚃 Route ${route.number}: ${route.name} — Journey started!`);
  addXP(50);

  setTimeout(() => {
    const heritageItems = route.heritage.map(id => {
      const loc = LOCATIONS.find(l => l.id === id);
      return loc ? `<div class="tram-heritage-item" onclick="openHeritageSite('${id}');showPage('heritage')">${loc.icon} <span style="color:var(--sepia-pale);font-size:13px;">${loc.name} <span style="color:var(--sepia-mid);font-size:11px;">· ${loc.area.split(',')[0]}</span></span></div>` : '';
    }).join('');

    const modal = `
      <div style="background:linear-gradient(135deg,#1A0A04,#2C1810);border:2px solid var(--tram-gold);border-radius:6px;padding:24px;margin-top:20px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="font-size:32px;">🚃</div>
          <div>
            <div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--tram-gold);">Route ${route.number} — ${route.name}</div>
            <div style="font-size:13px;color:var(--sepia-mid);font-style:italic;">${route.desc}</div>
          </div>
        </div>
        <div class="tram-result-route-line" style="margin-bottom:16px;">
          ${route.stops.map((s,i) => `
            <span class="tram-result-stop ${i===0||i===route.stops.length-1?'highlight':''}">${s.name}</span>
            ${i<route.stops.length-1?'<span style="color:var(--tram-gold);font-size:18px;">→</span>':''}
          `).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
          <div style="text-align:center;padding:12px;background:rgba(201,162,39,0.08);border-radius:3px;">
            <div style="font-family:var(--font-display);font-size:20px;font-weight:900;color:var(--tram-gold);">${route.duration}</div>
            <div style="font-family:var(--font-special);font-size:9px;letter-spacing:2px;color:var(--sepia-light);">TRAVEL TIME</div>
          </div>
          <div style="text-align:center;padding:12px;background:rgba(201,162,39,0.08);border-radius:3px;">
            <div style="font-family:var(--font-display);font-size:20px;font-weight:900;color:var(--tram-gold);">${route.fare}</div>
            <div style="font-family:var(--font-special);font-size:9px;letter-spacing:2px;color:var(--sepia-light);">FARE</div>
          </div>
          <div style="text-align:center;padding:12px;background:rgba(201,162,39,0.08);border-radius:3px;">
            <div style="font-family:var(--font-display);font-size:20px;font-weight:900;color:var(--tram-gold);">${route.stops.length}</div>
            <div style="font-family:var(--font-special);font-size:9px;letter-spacing:2px;color:var(--sepia-light);">STOPS</div>
          </div>
        </div>
        ${heritageItems ? `<div style="margin-bottom:14px;"><div style="font-family:var(--font-special);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--tram-gold);margin-bottom:8px;">Heritage Sites Along Route</div>${heritageItems}</div>` : ''}
        <div style="padding:12px;background:rgba(201,162,39,0.06);border:1px solid rgba(201,162,39,0.2);border-radius:3px;margin-bottom:12px;">
          <div style="font-family:var(--font-special);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--tram-gold);margin-bottom:6px;">🍽️ Food Recommendations</div>
          <div style="font-size:13px;color:var(--sepia-pale);">${tramFoods[routeId] || 'Explore local eateries along the route!'}</div>
        </div>
        <div style="padding:12px;background:rgba(201,162,39,0.06);border:1px solid rgba(201,162,39,0.2);border-radius:3px;margin-bottom:16px;">
          <div style="font-family:var(--font-special);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--tram-gold);margin-bottom:6px;">📖 Story Unlocks</div>
          ${route.stories.map(s => `<div style="font-size:13px;color:var(--sepia-pale);">📖 ${s}</div>`).join('')}
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" style="flex:1;" onclick="showTramOnMap('${routeId}')"><i class="fa fa-map"></i> View on Map</button>
          <button class="btn btn-ghost btn-sm" style="flex:1;" onclick="completeTramMission('tm1');showToast('🎫 Tram Rider mission progress updated!')"><i class="fa fa-check"></i> Log Journey</button>
        </div>
      </div>`;

    const tramContent = document.getElementById('tramContent');
    if (tramContent) {
      const existing = tramContent.querySelector('.journey-result');
      if (existing) existing.remove();
      const div = document.createElement('div');
      div.className = 'journey-result';
      div.innerHTML = modal;
      tramContent.prepend(div);
    }
  }, 400);

  showTramOnMap(routeId);
}

function showTramOnMap(routeId) {
  showPage('map-page');
  setTimeout(() => {
    const filterBtn = document.querySelector('.map-filter-btn:last-child');
    if (filterBtn) setMapFilter('tram', filterBtn);
    const route = TRAM_ROUTES.find(r => r.id === routeId);
    if (route && STATE.mapInstance) {
      const first = route.stops[0];
      STATE.mapInstance.setView([first.lat, first.lng], 14);
    }
  }, 600);
}

function planTramJourney() {
  const fromEl = document.getElementById('tramFrom');
  const toEl = document.getElementById('tramTo');
  if (!fromEl.value || !toEl.value) {
    showToast('Please select both boarding and exit stations!');
    return;
  }
  const fromStation = TRAM_STATIONS.find(s => s.id === fromEl.value);
  const toStation = TRAM_STATIONS.find(s => s.id === toEl.value);

  // Find compatible route
  const compatRoute = TRAM_ROUTES.find(r =>
    r.stops.some(s => s.name.includes(fromStation.name.split(' ')[0])) &&
    r.stops.some(s => s.name.includes(toStation.name.split(' ')[0]))
  ) || TRAM_ROUTES[0];

  const result = document.getElementById('tramPlannerResult');
  if (!result) return;
  result.innerHTML = `
    <div class="tram-result-card">
      <div style="font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--tram-gold);margin-bottom:12px;">Route Suggestion</div>
      <div class="tram-result-route-line">
        <span class="tram-result-stop highlight">${fromStation.name}</span>
        <span style="color:var(--tram-gold);">→ Tram ${compatRoute.number} →</span>
        <span class="tram-result-stop highlight">${toStation.name}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px;">
        <div style="color:var(--sepia-pale);font-size:13px;"><strong style="color:var(--tram-gold);">Duration:</strong> ~${compatRoute.duration}</div>
        <div style="color:var(--sepia-pale);font-size:13px;"><strong style="color:var(--tram-gold);">Fare:</strong> ${compatRoute.fare}</div>
      </div>
      <div style="margin-top:12px;color:var(--sepia-light);font-size:13px;">${compatRoute.desc}</div>
      <button class="btn btn-primary btn-sm" style="margin-top:16px;" onclick="startTramJourney('${compatRoute.id}')">
        <i class="fa fa-play"></i> Start This Journey
      </button>
    </div>`;
}

function completeTramMission(id) {
  if (STATE.completedMissions.includes(id)) return;
  const m = TRAM_MISSIONS.find(m => m.id === id);
  if (!m) return;
  STATE.completedMissions.push(id);
  addXP(m.xpReward);
  showToast(`${m.badge} Tram Mission accepted! "${m.title}" — +${m.xpReward} XP`);
  unlockAchievement({ id: `tram_${id}`, name: m.badgeName, icon: m.badge, desc: `Completed: ${m.title}`, unlocked: true });
  syncMissionStats();
  saveState();
  populateTramPage('missions');
}

// ─── AI ROUTE ENGINE ──────────────────────────────────────────

function openAIRouteEngine() {
  openModal('aiRouteModal');
}

function generateAIRouteModal() {
  const interest = document.getElementById('aiInterestModal').value;
  const time = parseInt(document.getElementById('aiTimeModal').value);
  const transport = document.getElementById('aiTransportModal').value;
  const result = document.getElementById('aiRouteModalResult');
  if (!result) return;

  const steps = [
    '🤖 Analysing your interests...',
    '🗺️ Scanning 35+ heritage locations...',
    '🚃 Checking tram connections...',
    '📍 Optimising stop sequence...',
    '🍽️ Finding food recommendations...',
    '✅ Route ready!'
  ];
  let si = 0;
  result.innerHTML = `<div id="aiPlanningLog" style="background:rgba(0,0,0,0.3);border:1px solid rgba(201,162,39,0.2);border-radius:4px;padding:14px;font-family:var(--font-special);font-size:11px;letter-spacing:1px;color:var(--tram-gold);margin-top:8px;min-height:80px;"></div>`;
  const log = document.getElementById('aiPlanningLog');
  const logInterval = setInterval(() => {
    if (log && si < steps.length) {
      log.innerHTML += (si > 0 ? '<br>' : '') + steps[si];
      si++;
    } else {
      clearInterval(logInterval);
      const route = buildAIRoute(interest, time, transport);
      result.innerHTML = renderAIRoute(route);
    }
  }, 420);
}

function generateAIRoute() {
  const interest = document.getElementById('aiInterest').value;
  const time = parseInt(document.getElementById('aiTime').value);
  const transport = document.getElementById('aiTransport').value;
  const result = document.getElementById('aiRouteResult');
  if (!result) return;

  const steps = ['🤖 Analysing preferences...','🗺️ Selecting locations...','🚃 Planning tram connections...','✅ Route ready!'];
  let si = 0;
  result.innerHTML = `<div id="aiPlanningLog2" style="background:rgba(0,0,0,0.3);border:1px solid rgba(201,162,39,0.2);border-radius:4px;padding:12px;font-family:var(--font-special);font-size:11px;letter-spacing:1px;color:var(--tram-gold);min-height:60px;"></div>`;
  const log = document.getElementById('aiPlanningLog2');
  const logInterval = setInterval(() => {
    if (log && si < steps.length) { log.innerHTML += (si>0?'<br>':'') + steps[si]; si++; }
    else { clearInterval(logInterval); const route = buildAIRoute(interest, time, transport); result.innerHTML = renderAIRoute(route); }
  }, 350);
}

function buildAIRoute(interest, hours, transport) {
  const catMap = { history: 'colonial', culture: 'cultural', religion: 'religious', hidden: 'hidden', education: 'educational' };
  const cat = catMap[interest] || 'colonial';
  let filtered = LOCATIONS.filter(l => l.category === cat || l.category === 'cultural');
  if (filtered.length < 2) filtered = LOCATIONS;
  const maxStops = Math.min(Math.max(Math.floor(hours * 1.2), 2), filtered.length, 6);
  const stops = filtered.slice(0, maxStops);
  const tramRoute = transport !== 'walking' ? TRAM_ROUTES[Math.floor(Math.random() * TRAM_ROUTES.length)] : null;
  const foods = ['Indian Coffee House (College Street)', 'Flurys (Park Street)', 'Arsalan (Park Circus)', 'Balwant Singh\'s Dhaba (Elgin Road)', 'Peter Cat (Park Street)', 'Bhojohori Manna (Hindustan Park)'];
  const food = foods[Math.floor(Math.random() * foods.length)];
  return { stops, tramRoute, food, hours, transport, interestKey: interest };
}

function renderAIRoute(route) {
  const catLabels = { colonial:'Colonial History', cultural:'Culture & Art', religious:'Sacred Sites', hidden:'Hidden Gems', educational:'Educational' };
  const whyMap = {
    colonial: 'I selected these colonial-era landmarks because they trace the architectural and political legacy of British Calcutta in chronological order.',
    culture: 'These cultural sites were chosen to show the layered artistic and intellectual heritage of Kolkata across different eras.',
    religion: 'These sacred spaces represent different faiths and eras, offering a spiritual journey through Kolkata\'s pluralistic heritage.',
    hidden: 'These off-the-beaten-path locations are rarely visited but carry extraordinary historical significance.',
    education: 'These educational and scientific institutions shaped Bengal\'s intellectual renaissance and modern identity.'
  };
  const why = whyMap[route.interestKey] || 'These locations were selected to give you the richest heritage experience within your available time.';
  return `
    <div style="background:rgba(201,162,39,0.06);border:1px solid rgba(201,162,39,0.3);border-radius:4px;padding:20px;margin-top:8px;">
      <div style="font-family:var(--font-special);font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--tram-gold);margin-bottom:8px;">🤖 AI PERSONALISED ROUTE — ${route.hours}HR EXPLORATION</div>
      <div style="background:rgba(0,0,0,0.25);border-left:3px solid var(--tram-gold);padding:10px 14px;margin-bottom:14px;border-radius:0 3px 3px 0;">
        <div style="font-family:var(--font-special);font-size:9px;letter-spacing:2px;color:var(--sepia-light);margin-bottom:4px;">WHY THIS ROUTE</div>
        <div style="font-size:13px;color:var(--sepia-pale);font-style:italic;line-height:1.6;">${why}</div>
      </div>
      ${route.tramRoute ? `<div style="background:rgba(139,26,26,0.15);border:1px solid rgba(139,26,26,0.3);border-radius:2px;padding:10px 14px;margin-bottom:12px;font-size:13px;color:var(--sepia-pale);">🚃 <strong style="color:var(--tram-gold);">Tram:</strong> Route ${route.tramRoute.number} — ${route.tramRoute.name} · ${route.tramRoute.fare} · ${route.tramRoute.duration}</div>` : ''}
      <div style="margin-bottom:12px;">
        ${route.stops.map((loc, i) => `
          <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border-aged);">
            <div style="width:26px;height:26px;border-radius:50%;background:var(--tram-gold);color:var(--sepia-deep);font-family:var(--font-display);font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i+1}</div>
            <div style="flex:1;">
              <div style="font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--sepia-deep);">${loc.icon} ${loc.name}</div>
              <div style="font-size:11px;color:var(--sepia-mid);">${loc.area} · ~${Math.round(40 + i * 15)} min</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="openHeritageSite('${loc.id}');closeModal('aiRouteModal')">View →</button>
          </div>
        `).join('')}
      </div>
      <div style="padding:10px;background:rgba(201,162,39,0.06);border-radius:2px;font-size:13px;color:var(--sepia-mid);margin-bottom:10px;">
        🍽️ <strong style="color:var(--sepia-dark);">Food Stop:</strong> ${route.food}
      </div>
      <div style="padding:10px;background:rgba(201,162,39,0.06);border-radius:2px;font-size:13px;color:var(--sepia-mid);margin-bottom:12px;">
        📸 <strong style="color:var(--sepia-dark);">Best Selfie Spot:</strong> ${route.stops[0] ? route.stops[0].name + ' — ' + route.stops[0].subtitle : 'First stop on the route'}
      </div>
      <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="loadAIRouteOnMap(${JSON.stringify(route.stops.map(s=>s.id))});closeModal('aiRouteModal')">
        <i class="fa fa-map"></i> Load Route on Map
      </button>
    </div>`;
}

function loadAIRouteOnMap(locationIds) {
  showPage('map-page');
  setTimeout(() => {
    if (!STATE.mapInstance) return;
    const locs = locationIds.map(id => LOCATIONS.find(l => l.id === id)).filter(Boolean);
    if (locs.length < 2) return;
    const coords = locs.map(l => [l.lat, l.lng]);
    if (STATE.aiRouteLine) STATE.mapInstance.removeLayer(STATE.aiRouteLine);
    STATE.aiRouteLine = L.polyline(coords, { color: '#C9A227', weight: 4, opacity: 0.9, dashArray: '10,6' }).addTo(STATE.mapInstance);
    STATE.mapInstance.fitBounds(L.latLngBounds(coords).pad(0.15));
    showToast('🤖 AI route displayed on map!');
  }, 500);
}

// ─── AR SYSTEM ────────────────────────────────────────────────

const AR_HISTORICAL_DATA = {
  victoria: {
    era: '1906–1921',
    desc: 'Under construction — white marble blocks arriving from Makrana, Rajasthan. The great dome slowly rises above the Maidan.',
    overlay: 'Construction scaffolding • Marble delivery routes • Curzon\'s original blueprint',
    color: '#C9A227'
  },
  howrah: {
    era: '1937–1943',
    desc: 'Steel framework being assembled by Tata Steel workers. Riveting teams work day and night over the Hooghly.',
    overlay: 'Cantilever construction • 26,500 tonnes of steel • 8 million rivets',
    color: '#8B5E3C'
  },
  'marble-palace': {
    era: '1835',
    desc: 'Raja Rajendra Mullick\'s residence in its full neoclassical glory — the private zoo, European galleries, marble courtyards.',
    overlay: 'Original garden layout • Private art gallery • The Bengal Zoo',
    color: '#C9A227'
  },
  jorasanko: {
    era: '1861',
    desc: 'The Tagore mansion at the height of the Bengal Renaissance — music drifting from the upper rooms, Rabindranath composing his first poems.',
    overlay: 'Rabi\'s room • Original library • The inner garden',
    color: '#2D5016'
  },
  'indian-museum': {
    era: '1814',
    desc: 'Asia\'s first public museum on opening day. The first curator\'s collections laid out in colonial exhibition cases.',
    overlay: 'Original wing layout • First exhibits • Dr. Nathaniel Wallich\'s collection',
    color: '#1B3A6B'
  },
  kalighat: {
    era: '1809',
    desc: 'The Kalighat temple freshly built on the ancient Shakti Peetha site. Pilgrims arriving from across Bengal.',
    overlay: 'Original temple plan • Sacred Adi Ganga • Kalighat painting tradition',
    color: '#8B1A1A'
  }
};

function initARPage() {
  const grid = document.getElementById('arSiteGrid');
  if (!grid) return;

  // Show AR disclaimer banner if not shown yet
  const arContainer = document.querySelector('.ar-container');
  if (arContainer && !document.getElementById('arDisclaimerBanner')) {
    const disclaimer = document.createElement('div');
    disclaimer.id = 'arDisclaimerBanner';
    disclaimer.style.cssText = 'background:rgba(139,26,26,0.18);border:1px solid rgba(201,162,39,0.4);border-radius:4px;padding:14px 18px;margin-bottom:24px;display:flex;align-items:flex-start;gap:12px;';
    disclaimer.innerHTML = `
      <div style="font-size:22px;flex-shrink:0;">⚠️</div>
      <div>
        <div style="font-family:var(--font-special);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--tram-gold);margin-bottom:4px;">DEVELOPMENT NOTICE</div>
        <div style="font-size:13px;color:var(--sepia-pale);line-height:1.7;">AR Time Travel is currently under active development. Historical reconstructions and AI-generated content are based on archival research and may contain inaccuracies. Always verify with official heritage sources.</div>
        <button onclick="this.parentElement.parentElement.style.display='none'" style="background:none;border:none;color:var(--tram-gold);font-size:11px;cursor:pointer;margin-top:6px;font-family:var(--font-special);letter-spacing:1px;">✕ DISMISS</button>
      </div>`;
    arContainer.insertBefore(disclaimer, arContainer.firstChild);
  }

  const arSites = LOCATIONS.filter(l => AR_HISTORICAL_DATA[l.id]);
  grid.innerHTML = arSites.map(loc => `
    <div class="ar-site-btn" id="arSiteBtn_${loc.id}" onclick="selectARSite('${loc.id}')">
      <div class="ar-site-btn-icon">${loc.icon}</div>
      <div class="ar-site-btn-name">${loc.name}</div>
    </div>
  `).join('');
}

function selectARSite(locId) {
  STATE.arSelectedSite = locId;
  STATE.arOverlayActive = false;
  STATE.arBeforeAfterMode = false;

  document.querySelectorAll('.ar-site-btn').forEach(b => b.classList.remove('selected'));
  const btn = document.getElementById(`arSiteBtn_${locId}`);
  if (btn) btn.classList.add('selected');

  const loc = LOCATIONS.find(l => l.id === locId);
  const label = document.getElementById('arCameraLabel');
  const overlay = document.getElementById('arOverlayContent');
  if (label) label.textContent = `${loc ? loc.name.toUpperCase() : 'SITE'} — READY TO SCAN`;
  if (overlay) overlay.innerHTML = `
    <div style="font-family:var(--font-special);font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--tram-gold);text-align:center;">
      ${loc ? loc.icon : '🏛️'}<br>${loc ? loc.name : ''}<br>
      <span style="color:var(--sepia-light);font-size:9px;">Press SCAN SITE to activate AR</span>
    </div>`;
  document.getElementById('arVerifyResult').style.display = 'none';
  document.getElementById('arVerifyEmpty').style.display = 'block';
}

function arCapture() {
  if (!STATE.arSelectedSite) {
    showToast('🔭 Please select a heritage site first!');
    return;
  }
  const progress = document.getElementById('arScanProgress');
  const bar = document.getElementById('arScanBar');
  const text = document.getElementById('arScanText');
  if (!progress || !bar) return;

  progress.style.display = 'block';
  let pct = 0;
  const steps = ['Scanning heritage site...', 'Comparing with database...', 'Analysing historical records...', 'Generating verification score...'];
  let stepIdx = 0;

  const interval = setInterval(() => {
    pct += 2;
    bar.style.width = pct + '%';
    if (pct % 25 === 0 && stepIdx < steps.length - 1) {
      stepIdx++;
      if (text) text.textContent = steps[stepIdx];
    }
    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        progress.style.display = 'none';
        bar.style.width = '0';
        completARVerification();
      }, 400);
    }
  }, 40);
}

function completARVerification() {
  const site = STATE.arSelectedSite;
  const data = AR_HISTORICAL_DATA[site];
  if (!data) return;

  const score = Math.floor(Math.random() * 20) + 78; // 78-98
  const xpEarned = Math.floor(score * 1.5);
  addXP(xpEarned);
  checkAchievement('hidden_found');

  const overlay = document.getElementById('arOverlayContent');
  const loc = LOCATIONS.find(l => l.id === site);
  if (overlay) {
    overlay.innerHTML = `
      <div style="background:rgba(0,0,0,0.7);border:1px solid var(--tram-gold);border-radius:4px;padding:16px;max-width:80%;text-align:center;">
        <div style="font-family:var(--font-display);font-size:32px;font-weight:900;color:var(--tram-gold);">${score}%</div>
        <div style="font-family:var(--font-special);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--sepia-pale);margin-bottom:8px;">HERITAGE MATCH</div>
        <div style="font-size:12px;color:var(--sepia-light);">${data.era}</div>
        <div style="font-size:11px;color:var(--sepia-pale);margin-top:6px;font-style:italic;">${data.overlay}</div>
      </div>`;
  }

  const verifyResult = document.getElementById('arVerifyResult');
  const verifyEmpty = document.getElementById('arVerifyEmpty');
  const verifyScore = document.getElementById('arVerifyScore');
  const verifyRewards = document.getElementById('arVerifyRewards');
  if (verifyResult) verifyResult.style.display = 'block';
  if (verifyEmpty) verifyEmpty.style.display = 'none';
  if (verifyScore) verifyScore.textContent = score + '%';
  if (verifyRewards) {
    verifyRewards.innerHTML = `
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">
        <span class="mission-reward">⭐ +${xpEarned} XP</span>
        <span class="mission-reward">📮 Stamp Earned</span>
        <span class="mission-reward">🔭 AR Verified</span>
      </div>
      <div style="font-family:var(--font-fell);font-style:italic;font-size:14px;color:var(--sepia-mid);line-height:1.7;margin-bottom:12px;">${data.desc}</div>
      <button class="btn btn-primary btn-sm" onclick="openHeritageSite('${site}')">Explore Full Site →</button>`;
  }

  collectSiteStamp(site);
  showToast(`🔭 AR Scan complete! ${score}% match — +${xpEarned} XP`);
}

function arToggleOverlay() {
  if (!STATE.arSelectedSite) { showToast('Select a site first!'); return; }
  STATE.arOverlayActive = !STATE.arOverlayActive;
  const data = AR_HISTORICAL_DATA[STATE.arSelectedSite];
  const overlay = document.getElementById('arOverlayContent');
  const loc = LOCATIONS.find(l => l.id === STATE.arSelectedSite);

  if (STATE.arOverlayActive && data && overlay) {
    overlay.innerHTML = `
      <div style="background:rgba(0,0,0,0.75);border:1px solid rgba(201,162,39,0.5);border-radius:4px;padding:16px;max-width:85%;text-align:center;">
        <div style="font-family:var(--font-special);font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--tram-gold);margin-bottom:4px;">HISTORICAL OVERLAY</div>
        <div style="font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--tram-gold);">${data.era}</div>
        <div style="font-size:12px;color:var(--sepia-pale);margin-top:8px;font-style:italic;line-height:1.6;">${data.desc}</div>
      </div>`;
    showToast(`⏳ Historical overlay: ${data.era}`);
  } else if (overlay) {
    overlay.innerHTML = '';
  }
}

function arBeforeAfter() {
  if (!STATE.arSelectedSite) { showToast('Select a site first!'); return; }
  STATE.arBeforeAfterMode = !STATE.arBeforeAfterMode;
  const data = AR_HISTORICAL_DATA[STATE.arSelectedSite];
  const loc = LOCATIONS.find(l => l.id === STATE.arSelectedSite);
  const overlay = document.getElementById('arOverlayContent');
  if (!overlay) return;

  if (STATE.arBeforeAfterMode && data) {
    overlay.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;width:90%;">
        <div style="background:rgba(0,0,0,0.8);border:1px solid rgba(201,162,39,0.4);border-radius:2px;padding:12px;text-align:center;">
          <div style="font-family:var(--font-special);font-size:9px;letter-spacing:2px;color:var(--sepia-light);margin-bottom:6px;">THEN</div>
          <div style="font-size:24px;">${loc ? loc.icon : '🏛️'}</div>
          <div style="font-size:11px;color:var(--tram-gold);margin-top:4px;">${data.era}</div>
        </div>
        <div style="background:rgba(0,0,0,0.8);border:1px solid rgba(201,162,39,0.4);border-radius:2px;padding:12px;text-align:center;">
          <div style="font-family:var(--font-special);font-size:9px;letter-spacing:2px;color:var(--sepia-light);margin-bottom:6px;">NOW</div>
          <div style="font-size:24px;">${loc ? loc.icon : '🏛️'}</div>
          <div style="font-size:11px;color:var(--tram-gold);margin-top:4px;">2026</div>
        </div>
      </div>`;
    showToast('📸 Before/After comparison active');
  } else {
    overlay.innerHTML = '';
  }
}

// ─── COMMUNITY PAGE ───────────────────────────────────────────

const COMMUNITY_CONTRIBUTORS = [
  { name: 'Arjun Bhattacharya', avatar: '👨‍🎓', badge: 'Heritage Scholar', xp: 4850, achievements: 12 },
  { name: 'Priya Dutta', avatar: '👩‍🔬', badge: 'Hidden Gem Finder', xp: 3920, achievements: 9 },
  { name: 'Soumik Sen', avatar: '👨‍🎨', badge: 'Tram Master', xp: 3400, achievements: 8 },
  { name: 'Meghna Roy', avatar: '👩‍💼', badge: 'Colonial Trailblazer', xp: 2750, achievements: 7 },
  { name: 'Tuhin Biswas', avatar: '👨‍💻', badge: 'CalKotha Legend', xp: 5000, achievements: 15 },
  { name: 'Rina Chakraborty', avatar: '👩‍🏫', badge: 'Story Keeper', xp: 2100, achievements: 6 }
];

function populateCommunityPage() {
  const grid = document.getElementById('contributorsGrid');
  if (!grid) return;
  grid.innerHTML = COMMUNITY_CONTRIBUTORS.map((c, i) => `
    <div class="contributor-card">
      <div class="contributor-avatar">${c.avatar}</div>
      <div>
        <div class="contributor-name">${c.name}</div>
        <div class="contributor-badge">🏅 ${c.badge}</div>
        <div class="contributor-xp">⭐ ${c.xp.toLocaleString()} XP · 🏆 ${c.achievements} achievements</div>
      </div>
      ${i < 3 ? `<div style="margin-left:auto;font-size:20px;">${['🥇','🥈','🥉'][i]}</div>` : ''}
    </div>
  `).join('');
}

// ─── CONTACT ──────────────────────────────────────────────────

function submitContact() {
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const msg = document.getElementById('contactMessage').value.trim();
  if (!name || !msg) { showToast('Please fill in your name and message!'); return; }
  addXP(25);
  showToast('✉️ Message sent! We\'ll respond within 24–48 hours. +25 XP');
  ['contactName','contactEmail','contactSubject','contactMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ─── HERO FEATURE SHOWCASE ─────────────────────────────────── 

// ─── HERO FEATURE SHOWCASE ────────────────────────────────────

const FEATURE_SHOWCASE_ITEMS = [
  'Explore Kolkata by Tram',
  'Travel Through Time with AR',
  'Verify Heritage Sites with AI',
  'Discover Hidden Landmarks',
  'Build Your Heritage Passport',
  'Complete Heritage Chronicles'
];

let showcaseIndex = 0;

function initFeatureShowcase() {
  const el = document.getElementById('featureShowcaseText');
  if (!el) return;
  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      showcaseIndex = (showcaseIndex + 1) % FEATURE_SHOWCASE_ITEMS.length;
      el.textContent = FEATURE_SHOWCASE_ITEMS[showcaseIndex];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 400);
  }, 3500);
}

// ─── LANDMARK SUBMIT FIX ──────────────────────────────────────

function openLandmarkSubmit() {
  showPage('landmark-submit');
}

// ─── INIT COMPLETE ────────────────────────────────────────────
console.log('%c🏛️ CalKotha — Heritage Platform Loaded', 'color:#C9A227;font-size:18px;font-weight:bold;font-family:Georgia,serif;');
console.log('%cExplore Kolkata. Through Time.', 'color:#8B5E3C;font-size:12px;font-style:italic;');
// ═══════════════════════════════════════════════════════════════
//  CALKOTHA ENHANCED — All new systems below
// ═══════════════════════════════════════════════════════════════

// ─── EXTENDED MISSIONS DATA ───────────────────────────────────
const MISSIONS_V2 = [
  // DAILY
  { id: 'daily1', type: 'daily', icon: '📖', title: 'Daily Story Quest', desc: 'Read one complete heritage story today and earn your daily reader stamp.', objective: 'Read 1 story', xpReward: 75, badge: '📜', badgeName: 'Daily Reader', progress: 0, total: 1, timeleft: '23h 45m' },
  { id: 'daily2', type: 'daily', icon: '📸', title: 'Daily Discovery', desc: 'Explore one new heritage location you\'ve never visited before today.', objective: 'Visit 1 new location', xpReward: 100, badge: '🗺️', badgeName: 'Daily Explorer', progress: 0, total: 1, timeleft: '23h 45m' },
  { id: 'daily3', type: 'daily', icon: '🔭', title: 'Daily AR Scan', desc: 'Complete one AR scan of any heritage site today.', objective: 'Complete 1 AR scan', xpReward: 60, badge: '🔭', badgeName: 'AR Scout', progress: 0, total: 1, timeleft: '23h 45m' },
  // WEEKLY
  { id: 'weekly1', type: 'weekly', icon: '🏛️', title: 'Colonial Trailblazer', desc: 'Visit and chronicle 5 colonial-era landmarks that defined British Calcutta.', objective: 'Visit 5 colonial landmarks', xpReward: 500, badge: '⚜️', badgeName: 'Colonial Trailblazer', progress: 0, total: 5, timeleft: '6d 12h' },
  { id: 'weekly2', type: 'weekly', icon: '📚', title: 'Story Collector', desc: 'Read 5 complete heritage stories this week to unlock the Historian badge.', objective: 'Read 5 stories', xpReward: 400, badge: '📚', badgeName: 'Historian', progress: 0, total: 5, timeleft: '6d 12h' },
  { id: 'weekly3', type: 'weekly', icon: '🚃', title: 'Tram Heritage Week', desc: 'Board and log 3 different tram routes this week.', objective: 'Complete 3 tram routes', xpReward: 600, badge: '🎫', badgeName: 'Tram Heritage Rider', progress: 0, total: 3, timeleft: '6d 12h' },
  // STORY
  { id: 'story1', type: 'story', icon: '🌉', title: 'The Bridge Chronicles', desc: 'Read the complete story of Howrah Bridge — from colonial ambition to engineering marvel.', objective: 'Read Howrah Bridge story', xpReward: 300, badge: '🌉', badgeName: 'Bridge Chronicler', progress: 0, total: 1 },
  { id: 'story2', type: 'story', icon: '✍️', title: 'The Renaissance Path', desc: 'Complete the Bengal Renaissance Trail and read all connected Tagore stories.', objective: 'Complete Renaissance Trail', xpReward: 750, badge: '✍️', badgeName: 'Renaissance Scholar', progress: 0, total: 1 },
  { id: 'story3', type: 'story', icon: '🎨', title: 'Clay Gods', desc: 'Read the full story of Kumartuli\'s sculptors and understand the living heritage.', objective: 'Read Kumartuli story', xpReward: 250, badge: '🎨', badgeName: 'Living Heritage Keeper', progress: 0, total: 1 },
  { id: 'story4', type: 'story', icon: '☕', title: 'Coffee House Debates', desc: 'Read about College Street\'s Coffee House and the intellectual history of Kolkata.', objective: 'Read Coffee House story', xpReward: 200, badge: '☕', badgeName: 'Intellectual Historian', progress: 0, total: 1 },
  // SEASONAL
  { id: 'season1', type: 'seasonal', icon: '🎭', title: 'Durga Puja Explorer', desc: 'Attend a major Durga Puja pandal in Kolkata and document your experience.', objective: 'Visit 1 Durga Puja pandal', xpReward: 1000, badge: '🎭', badgeName: 'Puja Devotee', progress: 0, total: 1, timeleft: 'Oct 2026' },
  { id: 'season2', type: 'seasonal', icon: '🌸', title: 'Spring Heritage Walk', desc: 'Complete the full Heritage Journey route during the spring festival season.', objective: 'Complete Heritage Journey', xpReward: 1500, badge: '🌸', badgeName: 'Festival Explorer', progress: 0, total: 1, timeleft: 'Mar–Apr 2026' },
  // HIDDEN
  { id: 'hidden1', type: 'hidden', icon: '🔍', title: '???', desc: 'This mission is revealed only to those who have explored at least 10 heritage sites.', objective: 'Unlock by visiting 10 sites', xpReward: 2000, badge: '💎', badgeName: 'Hidden Master', progress: 0, total: 1, locked: true },
  { id: 'hidden2', type: 'hidden', icon: '🗝️', title: '???', desc: 'A secret mission tied to Kolkata\'s most mysterious hidden location. Find it to begin.', objective: 'Secret objective', xpReward: 3000, badge: '👑', badgeName: 'CalKotha Legend', progress: 0, total: 1, locked: true },
];

// ─── EXTENDED STAMP DATA (with rarity) ───────────────────────
const STAMPS_V2 = [
  // LEGENDARY
  { id: 'victoria',       icon: '🏛️', name: 'Victoria Memorial',   category: 'Colonial',   rarity: 'legendary', xp: 500, desc: 'The Crown Jewel of Colonial Kolkata. Built with Makrana marble.' },
  { id: 'howrah',         icon: '🌉', name: 'Howrah Bridge',        category: 'Colonial',   rarity: 'legendary', xp: 500, desc: 'The Gateway to Kolkata. 26,500 tonnes of steel, zero nuts or bolts.' },
  // EPIC
  { id: 'jorasanko',      icon: '✍️', name: 'Jorasanko Thakurbari', category: 'Cultural',   rarity: 'epic',      xp: 350, desc: 'Birthplace of Rabindranath Tagore. Epicentre of the Bengal Renaissance.' },
  { id: 'kalighat',       icon: '🛕', name: 'Kalighat Temple',      category: 'Religious',  rarity: 'epic',      xp: 350, desc: 'One of the 51 Shakti Peethas. The city\'s sacred namesake.' },
  { id: 'marble',         icon: '🏰', name: 'Marble Palace',        category: 'Cultural',   rarity: 'epic',      xp: 350, desc: 'A hidden European treasure with 400 artworks and a private zoo.' },
  // RARE
  { id: 'indian-museum',  icon: '🏺', name: 'Indian Museum',        category: 'Educational',rarity: 'rare',      xp: 200, desc: 'The oldest and largest museum in Asia, est. 1814.' },
  { id: 'armenian',       icon: '⛪', name: 'Armenian Church',      category: 'Religious',  rarity: 'rare',      xp: 200, desc: 'Kolkata\'s oldest Christian church, built 1724.' },
  { id: 'nakhoda',        icon: '🕌', name: 'Nakhoda Masjid',       category: 'Religious',  rarity: 'rare',      xp: 200, desc: 'Kolkata\'s Grand Mughal Mosque. Twin minarets at 46m.' },
  { id: 'kumartuli',      icon: '🎨', name: 'Kumartuli',            category: 'Cultural',   rarity: 'rare',      xp: 200, desc: 'The Potters\' Quarter. Durga idols crafted here since the 1750s.' },
  // COMMON
  { id: 'writers',        icon: '🏢', name: 'Writers\' Building',   category: 'Colonial',   rarity: 'common',    xp: 100, desc: 'The Seat of Bengal\'s Colonial Power. Built 1780.' },
  { id: 'stpauls',        icon: '⛩️', name: 'St. Paul\'s Cathedral',category: 'Religious',  rarity: 'common',    xp: 100, desc: 'Gothic Splendour on the Maidan. Completed 1847.' },
  { id: 'college',        icon: '📚', name: 'College Street',       category: 'Educational',rarity: 'common',    xp: 100, desc: 'The Intellectual Artery. Home of the famous Coffee House.' },
  { id: 'belur',          icon: '🕌', name: 'Belur Math',           category: 'Religious',  rarity: 'common',    xp: 100, desc: 'Ramakrishna Mission HQ. A temple of all faiths.' },
  { id: 'dakshineswar',   icon: '🛕', name: 'Dakshineswar Temple',  category: 'Religious',  rarity: 'common',    xp: 100, desc: 'The Temple of Sri Ramakrishna. Built 1855 by Rani Rashmoni.' },
  { id: 'fort',           icon: '⚔️', name: 'Fort William',         category: 'Colonial',   rarity: 'common',    xp: 100, desc: 'The Citadel of British Bengal. A 5 sq km star fort.' },
  { id: 'science',        icon: '🔬', name: 'Science City',         category: 'Educational',rarity: 'common',    xp: 100, desc: 'India\'s Largest Science Centre. 50-acre campus.' },
];

// ─── LEVEL SYSTEM ─────────────────────────────────────────────
const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800,
  4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17300,
  19200, 21200, 23300, 25500, 27800, 30200, 32700, 35300, 38000, 40800,
  43700, 46700, 49800, 53000, 56300, 59700, 63200, 66800, 70500, 74300
];

function getLevelFromXP(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return Math.min(level, 100);
}

function getXPForNextLevel(xp) {
  const level = getLevelFromXP(xp);
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const progress = xp - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  return { level, nextThreshold, currentThreshold, progress, needed, pct: Math.min(100, Math.round((progress / needed) * 100)) };
}

// ─── REBUILT MISSIONS SYSTEM ──────────────────────────────────
function renderMissionsV2(tab) {
  const grid = document.getElementById('missionsGrid');
  if (!grid) return;

  // Combine old + new missions
  const allMissions = [...MISSIONS, ...MISSIONS_V2];
  let filtered = allMissions;

  if (tab === 'daily') filtered = allMissions.filter(m => m.type === 'daily');
  else if (tab === 'weekly') filtered = allMissions.filter(m => m.type === 'weekly');
  else if (tab === 'story') filtered = allMissions.filter(m => m.type === 'story');
  else if (tab === 'seasonal') filtered = allMissions.filter(m => m.type === 'seasonal');
  else if (tab === 'hidden') filtered = allMissions.filter(m => m.type === 'hidden');
  else if (tab === 'active') filtered = allMissions.filter(m => !STATE.completedMissions.includes(m.id));
  else if (tab === 'completed') filtered = allMissions.filter(m => STATE.completedMissions.includes(m.id));

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="missions-grid-v2"><div class="empty-state"><div class="empty-state-icon">🎯</div><div class="empty-state-title">No missions here yet</div><p class="empty-state-desc">Complete quests or check another tab</p></div></div>`;
    return;
  }

  // Group by type
  const groups = {};
  filtered.forEach(m => {
    const t = m.type || 'active';
    if (!groups[t]) groups[t] = [];
    groups[t].push(m);
  });

  const typeLabels = { daily: '⚡ Daily Missions', weekly: '📅 Weekly Challenges', story: '📖 Story Missions', seasonal: '🎭 Seasonal Events', hidden: '🔒 Hidden Missions', active: '🎯 Active Missions' };

  let html = '<div class="missions-grid-v2">';
  Object.entries(groups).forEach(([type, missions]) => {
    if (tab === 'all' || tab === 'active' || tab === 'completed') {
      html += `<div class="missions-section-title">${typeLabels[type] || type}</div>`;
    }
    missions.forEach(m => {
      const completed = STATE.completedMissions.includes(m.id);
      const prog = STATE.missionProgress ? (STATE.missionProgress[m.id] || 0) : 0;
      const total = m.total || 1;
      const pct = Math.min(100, Math.round((prog / total) * 100));
      const isLocked = m.locked && STATE.visited.length < 10;

      html += `
        <div class="mission-card-v2 type-${m.type} ${completed ? 'completed' : ''}" ${isLocked ? 'style="opacity:0.5;"' : ''}>
          <div class="mission-icon-v2">${isLocked ? '🔒' : m.icon}</div>
          <div>
            <div class="mission-type-tag type-${m.type}">${m.type.toUpperCase()}</div>
            <div class="mission-title-v2">${isLocked ? '???' : m.title}</div>
            <div class="mission-desc-v2">${isLocked ? 'Complete more explorations to unlock this secret mission.' : m.desc}</div>
            ${m.timeleft ? `<div style="font-family:var(--font-special);font-size:10px;color:var(--tram-gold);margin-bottom:4px;">⏰ ${m.timeleft}</div>` : ''}
            ${!completed && !isLocked ? `
              <div class="mission-progress-v2">
                <div class="mission-progress-track"><div class="mission-progress-fill" style="width:${pct}%"></div></div>
                <div class="mission-progress-label">${prog} / ${total} · ${pct}%</div>
              </div>` : ''}
          </div>
          <div class="mission-reward-v2">
            <div>
              <div class="mission-xp-badge">+${m.xpReward}</div>
              <div class="mission-xp-badge-label">XP</div>
            </div>
            ${completed
              ? `<div class="mission-done-check">✓</div>`
              : isLocked
              ? `<button class="mission-complete-btn" disabled>Locked</button>`
              : `<button class="mission-complete-btn" onclick="completeMissionV2('${m.id}')">Complete</button>`
            }
          </div>
        </div>`;
    });
  });
  html += '</div>';
  grid.innerHTML = html;
}

function completeMissionV2(id) {
  if (STATE.completedMissions.includes(id)) return;
  const allMissions = [...MISSIONS, ...MISSIONS_V2];
  const m = allMissions.find(m => m.id === id);
  if (!m) return;
  STATE.completedMissions.push(id);
  if (!STATE.missionProgress) STATE.missionProgress = {};
  STATE.missionProgress[id] = m.total || 1;
  addXP(m.xpReward);
  showToast(`${m.badge || '🎯'} Mission complete: "${m.title}" +${m.xpReward} XP!`);
  unlockAchievement({ id: `mission_${id}`, name: m.badgeName || m.title, icon: m.badge || '🎯', desc: `Completed: ${m.title}`, unlocked: true });
  syncMissionStats();
  saveState();
  renderMissionsV2(STATE.missionTab || 'all');
}

// Override old populateMissionsGrid
function populateMissionsGrid(tab) {
  renderMissionsV2(tab);
}

function setMissionTab(tab, btn) {
  STATE.missionTab = tab;
  document.querySelectorAll('.missions-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMissionsV2(tab);
}

// ─── STAMP BINDER SYSTEM ──────────────────────────────────────
let binderFilterActive = 'all';

function setBinderFilter(filter, btn) {
  binderFilterActive = filter;
  document.querySelectorAll('.sbfilter').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderStampBinder();
}

function renderStampBinder() {
  const grid = document.getElementById('stampBinderGrid');
  if (!grid) return;

  const sort = document.getElementById('binderSort') ? document.getElementById('binderSort').value : 'rarity';
  const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
  
  let stamps = [...STAMPS_V2];
  
  // Apply filter
  if (binderFilterActive !== 'all') {
    if (binderFilterActive === 'locked') {
      stamps = stamps.filter(s => !STATE.stamps.includes(s.id));
    } else {
      stamps = stamps.filter(s => s.rarity === binderFilterActive);
    }
  }
  
  // Sort
  stamps.sort((a, b) => {
    if (sort === 'rarity') return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'xp') return b.xp - a.xp;
    if (sort === 'date') {
      const da = STATE.stampDates && STATE.stampDates[a.id] ? new Date(STATE.stampDates[a.id]) : new Date(0);
      const db = STATE.stampDates && STATE.stampDates[b.id] ? new Date(STATE.stampDates[b.id]) : new Date(0);
      return db - da;
    }
    return 0;
  });

  if (stamps.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">📮</div><div class="empty-state-title">No stamps here</div><p class="empty-state-desc">Visit heritage sites to collect stamps</p></div>`;
    return;
  }

  grid.innerHTML = stamps.map(stamp => {
    const earned = STATE.stamps.includes(stamp.id);
    const date = STATE.stampDates && STATE.stampDates[stamp.id] ? STATE.stampDates[stamp.id] : null;
    return `
      <div class="heritage-stamp-card ${stamp.rarity} ${earned ? '' : 'locked'}" onclick="${earned ? `openStampCard('${stamp.id}')` : `showToast('Visit ${stamp.name} to earn this stamp!')`}">
        <div class="stamp-card-bg ${stamp.rarity}"></div>
        <div class="stamp-card-shine"></div>
        <div class="stamp-card-rarity-badge ${stamp.rarity}">${stamp.rarity.toUpperCase()}</div>
        <div class="stamp-card-icon-wrap">${stamp.icon}</div>
        <div class="stamp-card-body">
          <div class="stamp-card-name">${stamp.name}</div>
          <div class="stamp-card-cat">${stamp.category}</div>
          ${earned
            ? `<div class="stamp-card-xp">⭐ +${stamp.xp} XP${date ? '' : ''}</div>
               ${date ? `<div class="stamp-card-date">📅 ${date}</div>` : ''}`
            : `<div class="stamp-card-xp" style="opacity:0.5;">🔒 Not collected</div>`
          }
        </div>
        ${!earned ? `
          <div class="stamp-card-locked-overlay">
            <div class="stamp-card-lock-icon">🔒</div>
            <div class="stamp-card-lock-text">Visit to unlock</div>
          </div>` : ''}
      </div>`;
  }).join('');

  // Update stats
  const collected = STAMPS_V2.filter(s => STATE.stamps.includes(s.id));
  const rarePlus = collected.filter(s => ['rare','epic','legendary'].includes(s.rarity));
  const totalXP = collected.reduce((sum, s) => sum + s.xp, 0);
  const bTotal = document.getElementById('binderTotal');
  const bRare = document.getElementById('binderRare');
  const bXP = document.getElementById('binderXP');
  if (bTotal) bTotal.textContent = collected.length;
  if (bRare) bRare.textContent = rarePlus.length;
  if (bXP) bXP.textContent = totalXP;
}

function openStampCard(id) {
  const stamp = STAMPS_V2.find(s => s.id === id);
  if (!stamp) return;
  const date = STATE.stampDates && STATE.stampDates[id] ? STATE.stampDates[id] : 'Unknown';
  const rarityColors = { common: '#8b5e3c', rare: '#3b82f6', epic: '#a855f7', legendary: '#eab308' };
  const modal = document.getElementById('stampCardModal');
  const content = document.getElementById('stampCardModalContent');
  if (!modal || !content) return;
  content.innerHTML = `
    <div class="stamp-card-modal-header">
      <div class="stamp-card-modal-icon">${stamp.icon}</div>
      <div>
        <div class="stamp-card-modal-title">${stamp.name}</div>
        <div class="stamp-card-modal-sub" style="color:${rarityColors[stamp.rarity]}">${stamp.rarity.toUpperCase()} · ${stamp.category}</div>
      </div>
    </div>
    <div class="stamp-card-modal-body">
      <p style="font-family:var(--font-fell);font-style:italic;font-size:14px;color:var(--sepia-mid);line-height:1.8;margin-bottom:16px;">"${stamp.desc}"</p>
      <div class="stamp-card-modal-row">
        <span class="stamp-modal-label">Rarity</span>
        <span class="stamp-modal-value" style="color:${rarityColors[stamp.rarity]}">${stamp.rarity.toUpperCase()}</span>
      </div>
      <div class="stamp-card-modal-row">
        <span class="stamp-modal-label">XP Value</span>
        <span class="stamp-modal-value">⭐ ${stamp.xp} XP</span>
      </div>
      <div class="stamp-card-modal-row">
        <span class="stamp-modal-label">Category</span>
        <span class="stamp-modal-value">${stamp.category}</span>
      </div>
      <div class="stamp-card-modal-row">
        <span class="stamp-modal-label">Collected</span>
        <span class="stamp-modal-value">📅 ${date}</span>
      </div>
      <button class="btn btn-primary btn-sm" style="width:100%;justify-content:center;margin-top:16px;" onclick="openHeritageSite('${id}');closeStampCardModal()">
        <i class="fa fa-map-marker-alt"></i> Explore This Site
      </button>
    </div>`;
  modal.style.display = 'flex';
}

function closeStampCardModal(event) {
  if (!event || event.target === document.getElementById('stampCardModal')) {
    const modal = document.getElementById('stampCardModal');
    if (modal) modal.style.display = 'none';
  }
}

// ─── AI GUIDE (CalKotha AI) ────────────────────────────────────
const AI_GUIDE_SYSTEM_PROMPT = `You are CalKotha AI Guide — an expert heritage guide specialising exclusively in Kolkata (formerly Calcutta), West Bengal, India. You have deep knowledge of:
- Kolkata's colonial history, British Raj, East India Company
- Heritage landmarks: Victoria Memorial, Howrah Bridge, Marble Palace, Jorasanko Thakurbari, Kalighat Temple, Armenian Church, Writers' Building, Indian Museum, Nakhoda Masjid, College Street, Kumartuli, Belur Math, Dakshineswar, Fort William, St. Paul's Cathedral
- The Bengal Renaissance, Rabindranath Tagore, Swami Vivekananda, Subhash Chandra Bose
- Kolkata's tram network (Asia's oldest electric tram outside Europe, running since 1902)
- Durga Puja, Kali Puja, and other cultural festivals
- Bengali art, literature, cinema (Satyajit Ray, Ritwik Ghatak)
- Heritage routes, walking tours, food culture (Mughlai, Bengali cuisine)
- Architecture styles: Indo-Saracenic, Gothic Revival, Bengali Temple, Mughal, Neo-Classical

Always respond in a warm, knowledgeable guide tone. Keep responses concise (3–5 paragraphs max). Use occasional Bengali phrases where natural. Include specific facts, years, and cultural details. If asked about routes, suggest 3–5 stops with brief descriptions. End with an invitation to explore further on CalKotha.`;

let aiGuideHistory = [];

async function sendAIMessage() {
  const input = document.getElementById('aiGuideInput');
  const sendBtn = document.getElementById('aiGuideSendBtn');
  if (!input || !sendBtn) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  sendBtn.disabled = true;

  appendAIMessage('user', text);

  // Hide suggestion chips after first message
  const chips = document.getElementById('aiGuideChips');
  if (chips) chips.style.display = 'none';

  // Show typing indicator
  const typingId = 'typing_' + Date.now();
  appendAITyping(typingId);

  aiGuideHistory.push({ role: 'user', content: text });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: AI_GUIDE_SYSTEM_PROMPT,
        messages: aiGuideHistory.slice(-10)
      })
    });

    const data = await response.json();
    removeAITyping(typingId);

    const reply = data.content && data.content[0] ? data.content[0].text : 'I apologise — I encountered a connectivity issue. Please try again.';
    aiGuideHistory.push({ role: 'assistant', content: reply });
    appendAIMessage('assistant', reply);
    addXP(5);
  } catch (err) {
    removeAITyping(typingId);
    appendAIMessage('assistant', 'Apologies — I\'m having trouble connecting right now. Please check your connection and try again. You can still explore heritage sites directly on the map! 🗺️');
  }

  sendBtn.disabled = false;
}

function sendAIPrompt(text) {
  const input = document.getElementById('aiGuideInput');
  if (input) { input.value = text; sendAIMessage(); }
}

function appendAIMessage(role, text) {
  const container = document.getElementById('aiGuideMessages');
  if (!container) return;

  const div = document.createElement('div');
  div.className = `ai-msg ai-msg-${role}`;

  const avatar = role === 'assistant'
    ? `<div class="ai-msg-avatar"><i class="fa fa-robot"></i></div>`
    : `<div class="ai-msg-avatar" style="background:linear-gradient(135deg,var(--tram-gold),#a07c1a);border-color:var(--tram-red);"><i class="fa fa-user"></i></div>`;

  // Convert markdown-ish text
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  div.innerHTML = `${avatar}<div class="ai-msg-bubble"><p>${formatted}</p></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function appendAITyping(id) {
  const container = document.getElementById('aiGuideMessages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-assistant';
  div.id = id;
  div.innerHTML = `
    <div class="ai-msg-avatar"><i class="fa fa-robot"></i></div>
    <div class="ai-msg-typing">
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeAITyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ─── UPDATED PASSPORT PAGE ────────────────────────────────────
function populatePassportPage() {
  const userName = STATE.user ? STATE.user.name : 'Explorer';
  const userAvatar = STATE.user ? (STATE.user.avatar || '👤') : '👤';
  const joinYear = STATE.user ? (STATE.user.joinDate ? STATE.user.joinDate.split('-')[0] : '2026') : '2026';
  const userTitle = STATE.user ? (STATE.user.title || 'Heritage Explorer') : 'Heritage Explorer';

  const nameEl = document.getElementById('passportName');
  const metaEl = document.getElementById('passportMeta');
  const avatarEl = document.getElementById('passportAvatarDisp');
  if (nameEl) nameEl.textContent = userName;
  if (metaEl) metaEl.textContent = `${userTitle} · Member since ${joinYear}`;
  if (avatarEl) avatarEl.textContent = userAvatar;

  // Stats
  const stampsEl = document.getElementById('passportStamps');
  const xpEl = document.getElementById('passportXP');
  const visitedEl = document.getElementById('passportVisited');
  const achEl = document.getElementById('passportAchievements');
  if (stampsEl) stampsEl.textContent = STATE.stamps.length;
  if (xpEl) xpEl.textContent = STATE.xp.toLocaleString();
  if (visitedEl) visitedEl.textContent = STATE.visited.length;
  if (achEl) achEl.textContent = STATE.achievements.length;

  // Level bar
  const lvData = getXPForNextLevel(STATE.xp);
  const lvEl = document.getElementById('passportLevel');
  const lvXPEl = document.getElementById('passportLevelXP');
  const lvBar = document.getElementById('passportLevelBar');
  if (lvEl) lvEl.textContent = lvData.level;
  if (lvXPEl) lvXPEl.textContent = `${STATE.xp.toLocaleString()} / ${lvData.nextThreshold.toLocaleString()} XP`;
  if (lvBar) lvBar.style.width = lvData.pct + '%';

  // Progress bar
  const pct = Math.round((STATE.visited.length / LOCATIONS.length) * 100);
  const progressBar = document.getElementById('progressBar');
  const progressPct = document.getElementById('progressPct');
  const progressDesc = document.getElementById('progressDesc');
  if (progressBar) progressBar.style.width = pct + '%';
  if (progressPct) progressPct.textContent = pct + '%';
  if (progressDesc) progressDesc.textContent = `${STATE.visited.length} of ${LOCATIONS.length} locations discovered`;

  // Stamps
  populatePassportStamps();

  // Achievements
  populateAchievementsGrid();
}

function populatePassportStamps() {
  const pages = document.getElementById('stampPages');
  if (!pages) return;

  if (STATE.stamps.length === 0) {
    pages.innerHTML = `<div class="passport-page"><div class="empty-state"><div class="empty-state-icon">📮</div><div class="empty-state-title">No Stamps Yet</div><p class="empty-state-desc">Visit heritage sites to collect stamps. <button class="btn btn-primary btn-sm" onclick="showPage('stamp-binder')">Open Binder</button></p></div></div>`;
    return;
  }

  const earnedStamps = STAMPS_V2.filter(s => STATE.stamps.includes(s.id));
  let html = '<div class="passport-page"><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:12px;">';
  earnedStamps.forEach(stamp => {
    const rarityColors = { common: 'var(--sepia-mid)', rare: '#3b82f6', epic: '#a855f7', legendary: '#eab308' };
    html += `
      <div class="stamp-slot earned" style="border:2px solid ${rarityColors[stamp.rarity]};background:rgba(0,0,0,0.05);border-radius:8px;padding:10px;text-align:center;cursor:pointer;" onclick="showPage('stamp-binder')">
        <div class="stamp-icon" style="font-size:28px;">${stamp.icon}</div>
        <div class="stamp-label" style="font-size:9px;margin-top:4px;color:var(--sepia-mid);font-family:var(--font-special);">${stamp.name.split(' ').slice(0,2).join(' ')}</div>
        <div style="font-size:9px;color:${rarityColors[stamp.rarity]};font-family:var(--font-special);text-transform:uppercase;">${stamp.rarity}</div>
      </div>`;
  });
  html += '</div></div>';
  pages.innerHTML = html;
}

function populateAchievementsGrid() {
  const grid = document.getElementById('achievementsGrid');
  if (!grid) return;
  grid.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = a.unlocked || STATE.achievements.find(ua => ua.id === a.id);
    return `
      <div class="achievement-card ${unlocked ? 'unlocked' : ''}">
        <div class="achievement-icon">${unlocked ? a.icon : '🔒'}</div>
        <div class="achievement-name">${unlocked ? a.name : '???'}</div>
        <div class="achievement-desc">${unlocked ? a.desc : 'Complete challenges to unlock'}</div>
      </div>`;
  }).join('');
}

// ─── showPage hook — handled by master in v2.4 patch ──────────
// (this block is now a no-op; master showPage at bottom handles all)

// ─── REACTBITS: ANIMATED TEXT REVEAL ─────────────────────────
// Splits hero title into individual character spans for staggered reveal
function initAnimatedTextReveal() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
  heroTitle.querySelectorAll('span').forEach(span => {
    const text = span.textContent;
    span.innerHTML = text.split('').map((c, i) =>
      `<span class="char-reveal" style="animation-delay:${i * 0.04}s">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
  });
}

// ─── REACTBITS: MAGNETIC BUTTON EFFECT ───────────────────────
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-gold').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translateY(-2px) translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

// ─── REACTBITS: SCROLL COUNTER ────────────────────────────────
function observeCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + (target >= 100 ? '+' : '');
          if (current >= target) clearInterval(timer);
        }, 16);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

// ─── REACTBITS: PARTICLE BACKGROUND (Splash) ─────────────────
function initSplashParticles() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;';
  splash.insertBefore(canvas, splash.firstChild);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = splash.offsetWidth;
    canvas.height = splash.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.5 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,162,39,${p.opacity})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    if (document.getElementById('splash').classList.contains('active')) {
      requestAnimationFrame(draw);
    }
  }
  draw();
}

// ─── REACTBITS: TILT CARD EFFECT ─────────────────────────────
function initTiltCards() {
  document.querySelectorAll('.founder-profile-card, .location-card, .route-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

// ─── REACTBITS: AURORA/GRADIENT BACKGROUND on Founders ───────
function initAuroraEffect() {
  const foundersSection = document.querySelector('.founders-section');
  if (!foundersSection) return;
  let angle = 0;
  setInterval(() => {
    angle = (angle + 0.3) % 360;
    foundersSection.style.backgroundImage = `linear-gradient(${angle}deg, #1A0A04, #2C1810, #0D0502, #1A0A04)`;
  }, 50);
}

// ─── REACTBITS: RIPPLE EFFECT ON BUTTONS ─────────────────────
function initRippleEffect() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      animation:rippleAnim 0.6s ease forwards;
      pointer-events:none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// ─── REACTBITS: SPOTLIGHT HOVER on stamp cards ───────────────
function initSpotlightEffect() {
  document.addEventListener('mousemove', function(e) {
    const card = e.target.closest('.heritage-stamp-card:not(.locked)');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--spotlight-x', x + '%');
    card.style.setProperty('--spotlight-y', y + '%');
  });
}

// ─── REACTBITS: COUNTER SYNC ──────────────────────────────────
function syncMissionStats() {
  const totalXPEl = document.getElementById('totalXP');
  const completedEl = document.getElementById('completedMissions');
  const activeEl = document.getElementById('activeMissions');
  const allMissions = [...MISSIONS, ...MISSIONS_V2];
  if (totalXPEl) totalXPEl.textContent = STATE.xp.toLocaleString();
  if (completedEl) completedEl.textContent = STATE.completedMissions.length;
  if (activeEl) activeEl.textContent = allMissions.filter(m => !STATE.completedMissions.includes(m.id)).length;
}

// ─── ENHANCED INIT ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initSplashParticles();
    initAnimatedTextReveal();
    initRippleEffect();
    initSpotlightEffect();
    setTimeout(initMagneticButtons, 1000);
    setTimeout(initAuroraEffect, 2000);
    setTimeout(initTiltCards, 1500);
  }, 300);

  // Add ripple keyframe
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes rippleAnim { from { transform:scale(0); opacity:1; } to { transform:scale(2.5); opacity:0; } }
      .char-reveal { display:inline-block; animation: charIn 0.5s ease forwards; opacity:0; transform:translateY(20px); }
      @keyframes charIn { to { opacity:1; transform:translateY(0); } }
      .heritage-stamp-card:not(.locked) {
        background: radial-gradient(circle at var(--spotlight-x,50%) var(--spotlight-y,50%), rgba(255,255,255,0.06), transparent 60%);
      }
    `;
    document.head.appendChild(style);
  }
});

// On initial load, render missions with v2
document.addEventListener('DOMContentLoaded', () => {
  // Ensure missionProgress exists in state
  if (!STATE.missionProgress) STATE.missionProgress = {};
});

/* ═══════════════════════════════════════════════════════════
   CALKOTHA v2.2 FINAL PATCH
   ═══════════════════════════════════════════════════════════ */

// ─── EXTRA STORIES ───────────────────────────────────────────
(function() {
  var extra = [
    { id:"iron-web", title:"The Iron Web", category:"Engineering", icon:"🌉", location:"Howrah Bridge", readTime:"5 min", year:"1937",
      excerpt:"Eight million rivets, zero bolts — the engineering miracle behind Kolkata.",
      chapters:[{title:"Rivets and Empire", year:"1943",
        content:"Engineers proposed the new Howrah Bridge in 1937 with an unusual constraint: every joint riveted hot, shipyard-style. Eight million rivets. The Hooghly tidal range and shifting sandy bed made conventional piers impossible, so a balanced cantilever spanning 1,500 feet was chosen. Tata Steel supplied 26,500 tonnes of high-tensile steel. 2,500 workers assembled it across six years spanning a world war and a devastating famine."}]},
    { id:"black-hole", title:"The Black Hole Controversy", category:"Colonial History", icon:"⚔️", location:"Fort William", readTime:"7 min", year:"1756",
      excerpt:"What really happened on the night of June 20, 1756.",
      chapters:[{title:"June 20, 1756", year:"1756",
        content:"The British account from survivor John Zephaniah Holwell describes 146 prisoners in an 18x15-foot dungeon, only 23 surviving. Published 1758, it became imperial justification for conquest. But historians since the 19th century have questioned the numbers. Physical dimensions, contemporary records and the Nawab's own archives suggest far fewer prisoners. What is certain: some died. How many, and under what intent, remains contested."}]},
    { id:"durga-world", title:"Durga Across the World", category:"Living Heritage", icon:"🎨", location:"Kumartuli", readTime:"6 min", year:"Present",
      excerpt:"How the clay goddesses of Kumartuli travel to New York and Sydney every autumn.",
      chapters:[{title:"The Travelling Goddess", year:"Present",
        content:"Kumartuli exports hundreds of idols annually to the US, UK, Canada, Australia and the Gulf. Each idol is disassembled, arms detachable, weapons packed separately, then air-freighted. Some travel business class. One sculptor said: My idols fly to San Francisco in business class. I have never left West Bengal. The goddess travels. The maker stays."}]},
    { id:"kalighat-painters", title:"The Kalighat Painters", category:"Art Heritage", icon:"🎨", location:"Kalighat Temple", readTime:"6 min", year:"1800s",
      excerpt:"The scroll painters who created India's first modern art movement.",
      chapters:[{title:"Paintings for Pilgrims", year:"1850s",
        content:"Beginning in the early 1800s, patua scroll painters produced bold cheap images of Kali, Shiva, and Ramayana scenes for temple pilgrims. By the 1850s the same painters were making satirical images: Bengali gentlemen in English clothes, courtesans, corrupt priests. India's first mass-produced social satire. The style anticipates Indian cinema posters by a century. Kalighat paintings are now in the Victoria and Albert Museum and the Ashmolean at Oxford."}]},
    { id:"merchant-pioneers", title:"The Merchant Pioneers", category:"Community Heritage", icon:"⛪", location:"Armenian Church", readTime:"6 min", year:"1600s",
      excerpt:"The Armenian traders who arrived before the British and built the first commercial community.",
      chapters:[{title:"First Among Merchants", year:"1724",
        content:"Armenian merchants were trading in Bengal from at least the 1630s — fifty years before the East India Company arrived. They came from the great Armenian diaspora, speaking Persian, Arabic, Armenian, at home in Indian Ocean commerce. Their church, built 1724, is the oldest surviving church in Kolkata. At peak, the community numbered in the hundreds — jewellers to the Nawabs, bankers to the Company. Today a handful of families remain, conducting services in Classical Armenian."}]},
    { id:"writers-empire", title:"The Writers of Empire", category:"Colonial Heritage", icon:"🏢", location:"Writers Building", readTime:"5 min", year:"1690",
      excerpt:"How East India Company clerks became rulers of a subcontinent.",
      chapters:[{title:"Clerks Who Became Kings", year:"1780",
        content:"A Company writer was a junior clerk — boys of 15 or 16 sent to Bengal with penmanship and a director's letter of introduction. Warren Hastings arrived as a writer at 18 in 1750; by 1773 he was Governor-General of British India. The original Writers' Building of 1690 was literally their dormitory. It reached its current form in 1880. Today it houses the West Bengal Secretariat."}]},
    { id:"revolutionary-shootout", title:"The Revolutionary Shootout", category:"Freedom Movement", icon:"🏢", location:"Writers Building", readTime:"7 min", year:"1930",
      excerpt:"The day three young revolutionaries walked into colonial headquarters.",
      chapters:[{title:"December 8, 1930", year:"1930",
        content:"Three young men — Binoy Basu, Badal Gupta, Dinesh Gupta — dressed in European clothes and walked into the Writers Building. Their target: Colonel Simpson, Inspector General of Prisons. They reached his office and opened fire. Simpson was killed. Badal swallowed cyanide. Binoy and Dinesh were captured and hanged. The square outside was renamed BBD Bagh in their honour at independence."}]},
    { id:"vivekananda-dream", title:"Vivekananda's Dream", category:"Spiritual Heritage", icon:"⛪", location:"Belur Math", readTime:"7 min", year:"1897",
      excerpt:"From a coal-shed meditation room to a temple of all faiths.",
      chapters:[{title:"Temple of All Faiths", year:"1902",
        content:"Swami Vivekananda returned to Kolkata in 1897 after his Parliament of World Religions speech in Chicago. He purchased twelve acres at Belur on the Hooghly west bank. His instruction to the architect: incorporate Hindu, Islamic, and Christian elements so any visitor finds something familiar. The ground floor follows Hindu temple forms. Windows draw on Islamic architecture. The bell tower echoes Christian steeples. Seen from above the floor plan reads as a cross, a crescent, or a sacred fire, depending on your angle."}]},
    { id:"rani-rashmoni", title:"Rani Rashmoni's Gift", category:"Women's Heritage", icon:"🛕", location:"Dakshineswar", readTime:"6 min", year:"1855",
      excerpt:"The fish-seller's granddaughter who built one of Bengal's greatest temples.",
      chapters:[{title:"The Woman Who Built Dakshineswar", year:"1861",
        content:"Rashmoni was born in 1793 into the Mahishya caste. When her husband died in 1833 she used her inherited fortune for the city: she built Babughat on the Hooghly, constructed roads, and challenged British fishing tolls in court. The Dakshineswar temple complex she completed in 1855 cost 900,000 rupees. The Brahmin community refused to consecrate it. She remained firm. The temple she built housed Ramakrishna, whose disciple was Vivekananda."}]},
    { id:"cricket-empire", title:"Cricket and Empire", category:"Sport Heritage", icon:"🏏", location:"Eden Gardens", readTime:"7 min", year:"1864",
      excerpt:"How the game the British brought became more ours than theirs.",
      chapters:[{title:"The Ground the Empire Made", year:"1934",
        content:"Cricket came with the East India Company; the first Calcutta match was in 1804. Eden Gardens was established 1864. By the 1950s Eden Gardens with 66,000 capacity packed more people than any ground in England. The 2001 Test against Australia — when India, following on and apparently beaten, won through Laxman's 281 and Dravid's 180 — is still called the greatest fightback in cricket history. Steve Waugh wrote: Playing at Eden Gardens is like playing in a thunderstorm, except the thunder comes from the stands."}]},
    { id:"netaji-escape", title:"The Escape of Netaji", category:"Freedom Movement", icon:"🇮🇳", location:"Netaji Bhawan", readTime:"8 min", year:"1941",
      excerpt:"The night Subhas Chandra Bose disguised himself and vanished from British surveillance.",
      chapters:[{title:"January 17, 1941", year:"1941",
        content:"At 5:30 AM on January 17, 1941, a man in Pathan dress walked out of 38/2 Elgin Road and got into a waiting car. Subhas Chandra Bose — under British house arrest — had planned the escape for months. His nephew Sisir drove. Each helper knew only their part. From Delhi, Bose drove to Peshawar, crossed the Khyber Pass, reached Kabul, then Moscow, then Berlin. He died in Taiwan in 1945. The 1937 Wanderer car is preserved in Netaji Bhawan."}]},
    { id:"curzon-vision", title:"Lord Curzon's Vision", category:"Colonial Heritage", icon:"🏛️", location:"Victoria Memorial", readTime:"5 min", year:"1901",
      excerpt:"The most powerful Viceroy and his obsession with marble immortality.",
      chapters:[{title:"The Last Great Viceroy", year:"1905",
        content:"George Nathaniel Curzon served as Viceroy 1899-1905. He reformed the police, established the Archaeological Survey in its modern form, began restoring India's monuments including the Taj Mahal, and partitioned Bengal in 1905. And he conceived the Victoria Memorial: Calcutta is in some ways the most magnificent city in the world. It deserves a monument worthy of its position. The monument outlasted the empire. The city made it entirely its own."}]},
    { id:"tram-last", title:"The Last Trams", category:"Transport Heritage", icon:"🚃", location:"Tram Network", readTime:"7 min", year:"1873",
      excerpt:"Asia's oldest electric tram network — and the beauty of travelling at 10 km/h.",
      chapters:[{title:"The Electric Cattle", year:"1900",
        content:"Kolkata's trams began horse-drawn in 1873. Steam replaced horses in 1881. Electricity replaced steam in 1900 — making Kolkata's the first electric tram in Asia. At peak in the 1940s: 400 trams, 73 km of track. By 2020 fewer than 30 trams ran. Then Kolkata reversed course. Zero local emissions, heritage tourism, nostalgia combined. The last trams — oldest in Asia, still running on 19th-century track — continue their 10 km/h progress through streets that have forgotten how to make room for them."}]},
    { id:"bengal-famine-city", title:"The Famine That Came to the City", category:"Tragic Heritage", icon:"🌳", location:"The Maidan", readTime:"8 min", year:"1943",
      excerpt:"How the 1943 Bengal Famine came to Kolkata's streets.",
      chapters:[{title:"The Dying on the Streets", year:"1943",
        content:"In autumn 1943, the Maidan became a place of dying. The Bengal Famine killed two to three million people, primarily in rural Bengal. But the dying came to the city. Starving villagers walked to Kolkata. They camped on the Maidan, lay on the pavements of Park Street and Chowringhee, died in doorways. As Amartya Sen later demonstrated: this was not a shortage of food but a failure of distribution — wartime hoarding and inadequate government response. The Maidan today shows no sign of 1943."}]},
    { id:"park-street-graves", title:"The Dead of Empire", category:"Colonial Heritage", icon:"🏛️", location:"Park Street Cemetery", readTime:"7 min", year:"1767",
      excerpt:"Walking among Kolkata's oldest colonial graves — the lives behind the obelisks.",
      chapters:[{title:"A Garden of Empire", year:"1767",
        content:"The South Park Street Cemetery, operational from 1767, is one of the world's most extraordinary colonial burial grounds. 1,200 graves tell the story of British India's founding generation. Malaria, cholera, and smallpox made Bengal lethal. The monuments include obelisks, pyramids, and circular Roman domed rotundas. The most famous grave: Henry Derozio, Anglo-Indian poet and rationalist, died at 22 in 1831. By some accounts, the most haunted place in Kolkata."}]},
    { id:"mirror-shrine", title:"The Mirror Shrine", category:"Art Heritage", icon:"✨", location:"Pareshnath Temple", readTime:"5 min", year:"1867",
      excerpt:"The temple that took thirty years to build.",
      chapters:[{title:"A Temple of Reflection", year:"1867",
        content:"When Seth Rai Badridas Mookim Bahadur began building the Sheetalnathji Temple in 1867, he spared no expense. Belgian glass for chandeliers, Italian marble for floors, Venetian mosaic covering every ceiling and wall. Standing inside, your own face looks back from a thousand angles — an accidental but powerful reminder of the Jain concept of anekantavada: the many-sidedness of truth."}]},
    { id:"first-women-college", title:"Doors Open for Women", category:"Education Heritage", icon:"🎓", location:"Bethune College", readTime:"6 min", year:"1849",
      excerpt:"The extraordinary struggle behind India's first women's college.",
      chapters:[{title:"A School Before Its Time", year:"1849",
        content:"John Elliot Drinkwater Bethune arrived in Calcutta in 1848 as a senior administrator and committed advocate for women's education. He opened his school in January 1849 with five students, personally guaranteeing teachers' salaries when the colonial government refused funds. He enlisted Ishwar Chandra Vidyasagar as superintendent. Bethune died in 1851; 80 girls had enrolled. The school became a college in 1879. Today Bethune College has thousands of students."}]},
    { id:"lake-decades", title:"The Lake Through the Decades", category:"Urban Heritage", icon:"🌊", location:"Rabindra Sarovar", readTime:"5 min", year:"1930s",
      excerpt:"A colonial reservoir becomes the city's breathing room.",
      chapters:[{title:"Water and the City", year:"Present",
        content:"The British dug Dhakuria Lake in the 1920s as a flood reservoir. In 1958 it was renamed Rabindra Sarovar. Today it is 73 acres of water and paths in one of the world's most densely populated cities. Every morning at 5 AM thousands walk the perimeter. Chhath Puja transforms the lake every autumn: tens of thousands stand in the water at sunrise, offering water to the sun. The British built a reservoir. Kolkata turned it into a temple."}]},
    { id:"maidan-creation", title:"The Field of the Empire", category:"Colonial Heritage", icon:"🌳", location:"The Maidan", readTime:"6 min", year:"1757",
      excerpt:"How clearing villages gave Kolkata its most beloved open space.",
      chapters:[{title:"One Thousand Acres", year:"1757",
        content:"The Maidan exists because of violence. After 1756, the British cleared the entire area east of Fort William of habitation and vegetation to create a field of fire. This meant demolishing villages and displacing inhabitants. It meant felling ancient groves. 1,000 acres of open land in the heart of Asia's emerging great city. Today it contains Victoria Memorial, Eden Gardens, the Race Course, Shaheed Minar. The fort fell into irrelevance. The field became irreplaceable."}]}
  ];

  if (typeof STORIES !== "undefined") {
    extra.forEach(function(s) {
      if (!STORIES.find(function(x) { return x.id === s.id; })) {
        STORIES.push(s);
      }
    });
  }
})();

// ─── CIRCLE CLICK RIPPLE ─────────────────────────────────────
(function() {
  var style = document.createElement("style");
  style.textContent = "@keyframes ckRipple{0%{transform:scale(0);opacity:1}100%{transform:scale(22);opacity:0}}";
  document.head.appendChild(style);

  document.addEventListener("click", function(e) {
    var r = document.createElement("div");
    r.style.cssText = "position:fixed;pointer-events:none;z-index:99999;border-radius:50%;" +
      "width:10px;height:10px;background:rgba(201,162,39,0.45);transform:scale(0);" +
      "animation:ckRipple 0.5s ease-out forwards;" +
      "left:" + (e.clientX - 5) + "px;top:" + (e.clientY - 5) + "px;";
    document.body.appendChild(r);
    setTimeout(function() { r.remove(); }, 520);
  }, {passive: true});
})();

// ─── PROTOTYPE BANNER ────────────────────────────────────────
function injectPrototypeBanner() {
  if (document.getElementById("protoBannerWrap")) return;
  var style = document.createElement("style");
  style.textContent = "@keyframes protoPulse{0%,100%{opacity:1}50%{opacity:0.3}}";
  document.head.appendChild(style);

  var wrap = document.createElement("div");
  wrap.id = "protoBannerWrap";
  wrap.style.cssText = "position:fixed;bottom:115px;right:14px;z-index:8000;font-family:'Courier New',monospace;";
  wrap.innerHTML =
    '<div id="protoBannerInner" onclick="toggleProtoBanner()" style="background:rgba(10,5,2,0.93);' +
    'border:1px solid #C9A227;border-radius:10px;padding:10px 14px;max-width:230px;cursor:pointer;' +
    'box-shadow:0 4px 24px rgba(0,0,0,0.55);">' +
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">' +
        '<span style="width:8px;height:8px;background:#ff4444;border-radius:50%;display:inline-block;animation:protoPulse 1s infinite;"></span>' +
        '<span style="color:#C9A227;font-size:10px;font-weight:700;letter-spacing:1px;">DEV BUILD v2.2</span>' +
      '</div>' +
      '<div id="protoDetails" style="color:#7A6050;font-size:9px;line-height:1.6;">' +
        '<span style="color:#ff6b6b;">968 warnings above</span> — mostly<br>' +
        'unused vars, fixed in this build.<br>' +
        '<b style="color:#C9A227;">AR:</b> WebXR stub (real device req.)<br>' +
        '<b style="color:#C9A227;">AI:</b> Anthropic API (key needed)<br>' +
        '<b style="color:#C9A227;">Map:</b> OSM + OSRM real routing<br>' +
        '<b style="color:#C9A227;">GPS:</b> Geolocation API (HTTPS)<br>' +
        '<span style="color:#4caf50;font-size:8px;">tap to collapse</span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);
}

function toggleProtoBanner() {
  var d = document.getElementById("protoDetails");
  var inner = document.getElementById("protoBannerInner");
  if (!d || !inner) return;
  if (d.style.display === "none") {
    d.style.display = "block";
    inner.style.maxWidth = "230px";
  } else {
    d.style.display = "none";
    inner.style.maxWidth = "44px";
    inner.style.minHeight = "44px";
  }
}

// ─── DOCK MAGNIFICATION ──────────────────────────────────────
function initDockMagnify() {
  var panel = document.getElementById("dockPanel");
  if (!panel) return;
  var items = panel.querySelectorAll(".dock-item");

  panel.addEventListener("mousemove", function(e) {
    items.forEach(function(item) {
      var rect = item.getBoundingClientRect();
      var center = rect.left + rect.width / 2;
      var dist = Math.abs(e.clientX - center);
      if (dist < 110) {
        var s = 1 + 0.4 * (1 - dist / 110);
        var y = -7 * (1 - dist / 110);
        item.style.transform = "scale(" + s + ") translateY(" + y + "px)";
      } else {
        item.style.transform = "";
      }
    });
  });

  panel.addEventListener("mouseleave", function() {
    items.forEach(function(item) { item.style.transform = ""; });
  });
}

// ─── SCROLL REVEAL ───────────────────────────────────────────
function initScrollReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        e.target.style.transform = "translateY(0)";
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });

  document.querySelectorAll(".story-card,.story-card-large,.location-card,.route-card").forEach(function(el) {
    if (el.style.opacity !== "0") {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    }
    obs.observe(el);
  });
}

// ─── GPS STAMP SYSTEM ────────────────────────────────────────
var _gpsWatchId = null;

function startGPSStampWatch() {
  if (!navigator.geolocation || _gpsWatchId !== null) return;
  _gpsWatchId = navigator.geolocation.watchPosition(
    function(pos) { checkNearbyStamps(pos.coords.latitude, pos.coords.longitude); },
    function(err) { console.log("[GPS]", err.message); },
    { enableHighAccuracy: true, maximumAge: 20000, timeout: 8000 }
  );
}

function haversineDist(lat1, lon1, lat2, lon2) {
  var R = 6371000;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function checkNearbyStamps(lat, lng) {
  if (typeof LOCATIONS === "undefined") return;
  LOCATIONS.forEach(function(loc) {
    if (!loc.lat || !loc.lng) return;
    var dist = haversineDist(lat, lng, loc.lat, loc.lng);
    if (dist <= 250 && STATE.stamps.indexOf(loc.id) === -1) {
      STATE.stamps.push(loc.id);
      if (!STATE.stampDates) STATE.stampDates = {};
      STATE.stampDates[loc.id] = new Date().toISOString();
      STATE.xp = (STATE.xp || 0) + 150;
      saveState();
      showGPSStampNotif(loc.icon || "📮", loc.name, 150);
    }
  });
}

function showGPSStampNotif(icon, name, xp) {
  var n = document.getElementById("gpsStampNotif");
  if (!n) {
    n = document.createElement("div");
    n.id = "gpsStampNotif";
    n.style.cssText = "position:fixed;top:70px;left:50%;transform:translateX(-50%) translateY(-30px);" +
      "z-index:9900;background:linear-gradient(135deg,#1A0A04,#2C1810);border:2px solid #C9A227;" +
      "border-radius:14px;padding:18px 28px;text-align:center;min-width:260px;opacity:0;" +
      "pointer-events:none;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);" +
      "box-shadow:0 10px 40px rgba(0,0,0,0.5);font-family:'Courier New',monospace;";
    document.body.appendChild(n);
  }
  n.innerHTML = '<div style="font-size:38px;margin-bottom:6px;">' + icon + '</div>' +
    '<div style="font-family:serif;font-size:18px;font-weight:700;color:#C9A227;">' + name + ' Stamp Earned!</div>' +
    '<div style="font-size:10px;letter-spacing:2px;color:#8B7355;margin-top:4px;">+' + xp + ' XP ADDED TO PASSPORT</div>';
  n.style.opacity = "1";
  n.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(function() {
    n.style.opacity = "0";
    n.style.transform = "translateX(-50%) translateY(-30px)";
  }, 3500);
}

// ─── REAL MAP ROUTING WITH OSRM ──────────────────────────────
function drawRealRoute(map, waypoints, color) {
  color = color || "#C9A227";
  if (!waypoints || waypoints.length < 2) return;
  var coords = waypoints.map(function(p) { return p[1] + "," + p[0]; }).join(";");
  var url = "https://router.project-osrm.org/route/v1/foot/" + coords + "?overview=full&geometries=geojson";
  fetch(url).then(function(r) { return r.json(); }).then(function(data) {
    if (data.routes && data.routes[0]) {
      if (window._currentRouteLayer) map.removeLayer(window._currentRouteLayer);
      window._currentRouteLayer = L.geoJSON(data.routes[0].geometry, {
        style: { color: color, weight: 4, opacity: 0.85, dashArray: "8,4" }
      }).addTo(map);
      var mins = Math.round(data.routes[0].duration / 60);
      var km = (data.routes[0].distance / 1000).toFixed(1);
      showToast("Route: " + km + " km — approx " + mins + " min walk");
    }
  }).catch(function() {
    if (window._currentRouteLayer) map.removeLayer(window._currentRouteLayer);
    window._currentRouteLayer = L.polyline(waypoints, {color: color, weight: 3, dashArray: "6,4"}).addTo(map);
    showToast("Offline route shown — real roads need connection");
  });
}

var ROUTE_WAYPOINTS = {
  "heritage-trail":  [[22.5448,88.3426],[22.5212,88.3437],[22.5734,88.3504],[22.5751,88.3484]],
  "north-kolkata":   [[22.5875,88.3571],[22.5881,88.3623],[22.5861,88.3568],[22.5939,88.3662]],
  "spiritual-circuit":[[22.6543,88.3576],[22.6266,88.3562],[22.5212,88.3437]],
  "colonial-walk":   [[22.5697,88.3472],[22.5751,88.3484],[22.5734,88.3504],[22.5448,88.3426]],
  "south-heritage":  [[22.5352,88.3521],[22.5482,88.3397],[22.5448,88.3426],[22.5133,88.3560]]
};

var TRAM_ROUTES_REAL = {
  "Route 36/1": [[22.6125,88.3682],[22.5851,88.3468],[22.5750,88.3484],[22.5647,88.3437],[22.5448,88.3426]],
  "Route 12":   [[22.5939,88.3662],[22.5881,88.3623],[22.5875,88.3571],[22.5761,88.3590],[22.5750,88.3484]],
  "Route 25":   [[22.5750,88.3484],[22.5697,88.3472],[22.5582,88.3517],[22.5448,88.3426],[22.5354,88.3397]]
};

function drawTramRoutesOnMap(map) {
  if (!map || typeof L === "undefined") return;
  Object.keys(TRAM_ROUTES_REAL).forEach(function(name) {
    L.polyline(TRAM_ROUTES_REAL[name], {color:"#2196F3", weight:3, opacity:0.7, dashArray:"4,3"})
     .addTo(map).bindPopup("Tram " + name);
  });
}

// ─── INIT PATCH ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(injectPrototypeBanner, 900);
  setTimeout(initDockMagnify, 600);
  setTimeout(initScrollReveal, 1200);

  var dock = document.getElementById("dockNav");
  if (dock && STATE.currentPage !== "splash") {
    dock.style.display = "flex";
    document.body.classList.add("app-loaded");
  }

  if (STATE.user) { startGPSStampWatch(); }
});
/* ═══════════════════════════════════════════════════════════════
   CALKOTHA v2.3 — PHYSICS LANYARD + REACTBITS PROFILE CARD
   ═══════════════════════════════════════════════════════════════ */

// ─── PHYSICS LANYARD ────────────────────────────────────────────
(function initPhysicsLanyard() {
  var scene, canvas, ctx, card, raf;
  var W = 0, H = 500;
  var ROPE_SEGS = 22;
  var GRAVITY = 0.55;
  var DAMPING = 0.985;
  var ITERS = 14;
  var CARD_W = 200, CARD_H = 300;
  var dragging = false;
  var dragOffsetX = 0, dragOffsetY = 0;
  var lastMouse = { x: 0, y: 0 };
  var velX = 0, velY = 0;

  var rope = []; // [{x,y,oldX,oldY,pinned}]

  function buildLanyardHTML(user) {
    var name = (user && user.name) ? user.name : 'Explorer';
    var xp = (user && user.xp) ? user.xp : 0;
    var stamps = (user && user.stamps) ? user.stamps.length : 0;
    var level = Math.max(1, Math.floor(xp / 500) + 1);
    var titles = ['Novice', 'Wanderer', 'Historian', 'Archivist', 'Guardian', 'Sage'];
    var title = titles[Math.min(level - 1, titles.length - 1)];
    return (
      '<div class="lanyard-clip-top"></div>' +
      '<div class="lanyard-card-hole"></div>' +
      '<div class="lanyard-card-logo-row">' +
        '<div class="lanyard-card-logo-text">CalKotha</div>' +
        '<div class="lanyard-card-year-badge">2026</div>' +
      '</div>' +
      '<div class="lanyard-card-photo">' +
        '<span style="font-size:28px;">👤</span>' +
      '</div>' +
      '<div class="lanyard-card-name-text">' + name + '</div>' +
      '<div class="lanyard-card-role-text">Heritage ' + title + '</div>' +
      '<div class="lanyard-card-divider"></div>' +
      '<div class="lanyard-card-stats-row">' +
        '<div class="lanyard-card-stat"><div class="lanyard-card-stat-num">' + xp + '</div><div class="lanyard-card-stat-lbl">XP</div></div>' +
        '<div class="lanyard-card-stat"><div class="lanyard-card-stat-num">LVL ' + level + '</div><div class="lanyard-card-stat-lbl">Level</div></div>' +
        '<div class="lanyard-card-stat"><div class="lanyard-card-stat-num">' + stamps + '</div><div class="lanyard-card-stat-lbl">Stamps</div></div>' +
      '</div>' +
      '<div class="lanyard-card-barcode"></div>'
    );
  }

  function initRope(anchorX, anchorY) {
    rope = [];
    var segLen = (CARD_H * 0.5) / ROPE_SEGS;
    for (var i = 0; i <= ROPE_SEGS; i++) {
      rope.push({
        x: anchorX,
        y: anchorY + i * segLen,
        oldX: anchorX,
        oldY: anchorY + i * segLen,
        pinned: i === 0
      });
    }
  }

  function verletStep() {
    // Integrate
    for (var i = 0; i < rope.length; i++) {
      if (rope[i].pinned) continue;
      var vx = (rope[i].x - rope[i].oldX) * DAMPING;
      var vy = (rope[i].y - rope[i].oldY) * DAMPING;
      rope[i].oldX = rope[i].x;
      rope[i].oldY = rope[i].y;
      rope[i].x += vx;
      rope[i].y += vy + GRAVITY;
    }

    // Constraints
    var restLen = (CARD_H * 0.5) / ROPE_SEGS;
    for (var iter = 0; iter < ITERS; iter++) {
      for (var j = 0; j < rope.length - 1; j++) {
        var dx = rope[j+1].x - rope[j].x;
        var dy = rope[j+1].y - rope[j].y;
        var dist = Math.sqrt(dx*dx + dy*dy) || 0.001;
        var diff = (dist - restLen) / dist;
        var corr = diff * 0.5;
        if (!rope[j].pinned) {
          rope[j].x += dx * corr;
          rope[j].y += dy * corr;
        }
        if (!rope[j+1].pinned) {
          rope[j+1].x -= dx * corr;
          rope[j+1].y -= dy * corr;
        }
      }
      // Keep card point at last segment
      if (card && !dragging) {
        var last = rope[rope.length - 1];
        card.style.left = (last.x - CARD_W / 2) + 'px';
        var cardTop = last.y;
        card.style.top = cardTop + 'px';
        // Rotate card by angle of last segment
        if (rope.length >= 2) {
          var prevSeg = rope[rope.length - 2];
          var angle = Math.atan2(last.x - prevSeg.x, last.y - prevSeg.y) * (180 / Math.PI);
          // Clamp rotation
          angle = Math.max(-30, Math.min(30, angle));
          card.style.transform = 'rotate(' + angle + 'deg)';
        }
      }
    }
  }

  function drawRope() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (rope.length < 2) return;

    // Draw rope shadow
    ctx.beginPath();
    ctx.moveTo(rope[0].x + 2, rope[0].y + 2);
    for (var i = 1; i < rope.length; i++) {
      ctx.lineTo(rope[i].x + 2, rope[i].y + 2);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw main rope with gradient
    var grad = ctx.createLinearGradient(rope[0].x, rope[0].y, rope[rope.length-1].x, rope[rope.length-1].y);
    grad.addColorStop(0, '#C9A227');
    grad.addColorStop(0.4, '#8B5E3C');
    grad.addColorStop(0.7, '#C9A227');
    grad.addColorStop(1, '#8B5E3C');
    ctx.beginPath();
    ctx.moveTo(rope[0].x, rope[0].y);
    for (var k = 1; k < rope.length; k++) {
      ctx.lineTo(rope[k].x, rope[k].y);
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Rope highlight
    ctx.beginPath();
    ctx.moveTo(rope[0].x - 1, rope[0].y);
    for (var m = 1; m < rope.length; m++) {
      ctx.lineTo(rope[m].x - 1, rope[m].y);
    }
    ctx.strokeStyle = 'rgba(255,220,100,0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Anchor hook at top
    ctx.beginPath();
    ctx.arc(rope[0].x, rope[0].y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#C9A227';
    ctx.fill();
    ctx.strokeStyle = '#8B5E3C';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function loop() {
    verletStep();
    drawRope();
    raf = requestAnimationFrame(loop);
  }

  function getPointerPos(e, el) {
    var rect = el.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function onPointerDown(e) {
    if (!card) return;
    var pos = getPointerPos(e, scene);
    var cardRect = card.getBoundingClientRect();
    var sceneRect = scene.getBoundingClientRect();
    var cardLeft = cardRect.left - sceneRect.left;
    var cardTop = cardRect.top - sceneRect.top;
    if (
      pos.x >= cardLeft && pos.x <= cardLeft + CARD_W &&
      pos.y >= cardTop && pos.y <= cardTop + CARD_H
    ) {
      dragging = true;
      dragOffsetX = pos.x - cardLeft;
      dragOffsetY = pos.y - cardTop;
      lastMouse = { x: pos.x, y: pos.y };
      velX = 0; velY = 0;
      e.preventDefault();
    }
  }

  function onPointerMove(e) {
    if (!dragging || !card) return;
    e.preventDefault();
    var pos = getPointerPos(e, scene);
    velX = pos.x - lastMouse.x;
    velY = pos.y - lastMouse.y;
    lastMouse = { x: pos.x, y: pos.y };

    var newLeft = pos.x - dragOffsetX;
    var newTop = pos.y - dragOffsetY;
    card.style.left = newLeft + 'px';
    card.style.top = newTop + 'px';
    card.style.transform = 'rotate(' + Math.max(-25, Math.min(25, velX * 1.2)) + 'deg)';

    // Pull rope bottom toward card top-center
    var last = rope[rope.length - 1];
    last.x = newLeft + CARD_W / 2;
    last.y = newTop;
    last.oldX = last.x - velX * 0.5;
    last.oldY = last.y - velY * 0.5;
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    // Give velocity to last point
    var last = rope[rope.length - 1];
    last.oldX = last.x - velX * 2;
    last.oldY = last.y - velY * 2;
  }

  function setup() {
    scene = document.getElementById('lanyardScene');
    canvas = document.getElementById('lanyardCanvas');
    if (!scene || !canvas) return;

    W = scene.clientWidth || 380;
    H = 500;
    scene.style.height = H + 'px';
    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext('2d');

    // Create card element
    card = document.createElement('div');
    card.className = 'lanyard-id-card';
    card.style.cssText = 'width:' + CARD_W + 'px;position:absolute;';
    card.innerHTML = buildLanyardHTML(typeof STATE !== 'undefined' ? STATE.user : null);
    scene.appendChild(card);

    // Initial rope position: anchor at top center
    var anchorX = W / 2;
    var anchorY = 8;
    initRope(anchorX, anchorY);

    // Position card below rope
    var last = rope[rope.length - 1];
    card.style.left = (last.x - CARD_W / 2) + 'px';
    card.style.top = last.y + 'px';

    // Events
    scene.addEventListener('mousedown', onPointerDown);
    scene.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // Resize
    window.addEventListener('resize', function() {
      if (!scene) return;
      W = scene.clientWidth || 380;
      canvas.width = W;
      canvas.height = H;
      rope[0].x = W / 2;
      rope[0].oldX = W / 2;
    });

    // Start gentle swing
    rope[rope.length - 1].oldX = rope[rope.length - 1].x - 18;

    if (raf) cancelAnimationFrame(raf);
    loop();

    // Hide drag hint after first interaction
    scene.addEventListener('mousedown', function() {
      var hint = document.getElementById('lanyardDragHint');
      if (hint) hint.style.opacity = '0';
    }, { once: true });
    scene.addEventListener('touchstart', function() {
      var hint = document.getElementById('lanyardDragHint');
      if (hint) hint.style.opacity = '0';
    }, { once: true });
  }

  // Expose refresh function for when passport page is opened
  window.refreshLanyardCard = function() {
    if (!card) { setup(); return; }
    card.innerHTML = buildLanyardHTML(typeof STATE !== 'undefined' ? STATE.user : null);
  };

  // Expose boot function
  window._lanyardInit = setup;

  // Init on passport page show — handled by master showPage now
  // Just boot on DOMContentLoaded if already on passport
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof STATE !== 'undefined' && STATE.currentPage === 'passport') setup();
    });
  }
})();


// ─── REACTBITS HOLOGRAPHIC PROFILE CARD ────────────────────────
(function initRBProfileCards() {
  function attachCardHover(sceneEl, cardEl, avatarImg) {
    if (!sceneEl || !cardEl) return;

    var TILT_MAX = 18; // degrees

    function onMove(e) {
      var rect = cardEl.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      var x = clientX - rect.left;
      var y = clientY - rect.top;
      var w = rect.width;
      var h = rect.height;
      var fromLeft = x / w;
      var fromTop = y / h;
      var fromCX = fromLeft - 0.5;
      var fromCY = fromTop - 0.5;
      var mx = (fromLeft * 100).toFixed(1) + '%';
      var my = (fromTop * 100).toFixed(1) + '%';
      var foilX = (fromLeft * 100).toFixed(1) + '%';
      var foilY = (fromTop * 100).toFixed(1) + '%';
      var rotY = (fromCX * TILT_MAX).toFixed(2);
      var rotX = (-fromCY * TILT_MAX * 0.7).toFixed(2);
      var shadowX = (-fromCX * 20).toFixed(1);
      var shadowY = (-fromCY * 20 + 12).toFixed(1);
      var cardAngle = (Math.atan2(fromCY, fromCX) * 180 / Math.PI + 90).toFixed(0) + 'deg';

      cardEl.style.setProperty('--mx', mx);
      cardEl.style.setProperty('--my', my);
      cardEl.style.setProperty('--foil-x', foilX);
      cardEl.style.setProperty('--foil-y', foilY);
      cardEl.style.setProperty('--from-left', fromLeft);
      cardEl.style.setProperty('--from-top', fromTop);
      cardEl.style.setProperty('--card-angle', cardAngle);
      cardEl.style.transform =
        'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.03)';
      cardEl.style.boxShadow =
        shadowX + 'px ' + shadowY + 'px 50px rgba(0,0,0,0.7), ' +
        '0 0 0 1px rgba(201,162,39,0.3), ' +
        '0 0 60px rgba(201,162,39,0.12)';

      // Move avatar image slightly (parallax)
      if (avatarImg) {
        avatarImg.style.transform =
          'translateX(' + (fromCX * 8).toFixed(1) + 'px) ' +
          'translateY(' + (fromCY * 4).toFixed(1) + 'px)';
      }

      sceneEl.classList.add('active');
      cardEl.classList.add('active');
    }

    function onLeave() {
      cardEl.style.transform = '';
      cardEl.style.boxShadow = '';
      cardEl.style.setProperty('--mx', '50%');
      cardEl.style.setProperty('--my', '50%');
      if (avatarImg) avatarImg.style.transform = '';
      sceneEl.classList.remove('active');
      cardEl.classList.remove('active');
    }

    // Smooth transition back
    cardEl.addEventListener('mouseleave', onLeave);
    cardEl.addEventListener('touchend', onLeave);
    cardEl.addEventListener('mousemove', onMove);
    cardEl.addEventListener('touchmove', function(e) {
      e.preventDefault();
      onMove(e);
    }, { passive: false });
  }

  function initAll() {
    var pairs = [
      ['rbScene1', 'rbCard1', 'rbAvatar1'],
      ['rbScene2', 'rbCard2', 'rbAvatar2']
    ];
    pairs.forEach(function(p) {
      var scene = document.getElementById(p[0]);
      var card = document.getElementById(p[1]);
      var avatar = document.getElementById(p[2]);
      if (scene && card) attachCardHover(scene, card, avatar);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();


/* ═══════════════════════════════════════════════════════════════
   CALKOTHA v2.4 — ALL FIXES PATCH
   ═══════════════════════════════════════════════════════════════ */

// ── MASTER showPage — consolidates ALL overrides into ONE ──────
// Replaces the broken chain of showPage wrappers
(function() {
  'use strict';

  // The definitive single showPage — no more chaining
  window.showPage = function(id) {
    if (!id) return;

    // Nav history
    if (STATE.currentPage && STATE.currentPage !== 'splash') {
      STATE.navHistory = STATE.navHistory || [];
      STATE.navHistory.push(STATE.currentPage);
      if (STATE.navHistory.length > 30) STATE.navHistory.shift();
    }
    STATE.previousPage = STATE.currentPage;
    STATE.currentPage = id;

    // Page visibility
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      p.style.display = '';
    });
    var target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      window.scrollTo(0, 0);
    }

    // Dock: always show after splash
    var dock = document.getElementById('dockNav');
    if (dock) dock.style.display = (id === 'splash') ? 'none' : 'flex';
    document.body.classList.toggle('app-loaded', id !== 'splash');

    // Floating back button
    var backBtn = document.getElementById('floatingBack');
    if (backBtn) {
      var showBack = (id !== 'splash' && id !== 'home' && (STATE.navHistory || []).length > 0);
      backBtn.classList.toggle('visible', showBack);
      backBtn.style.display = showBack ? '' : 'none';
    }

    // Dock active highlight
    document.querySelectorAll('.dock-item').forEach(function(di) { di.classList.remove('dock-active'); });
    var dockPageMap = { 'home':0, 'map-page':1, 'tram-page':2, 'stamp-binder':3, 'passport':4, 'ai-guide-page':5, 'settings-page':6, 'community-page':7 };
    var dockItems = document.querySelectorAll('.dock-item');
    if (dockPageMap[id] !== undefined && dockItems[dockPageMap[id]]) {
      dockItems[dockPageMap[id]].classList.add('dock-active');
    }

    // Nav links
    document.querySelectorAll('.nav-link').forEach(function(l) {
      l.classList.toggle('active', l.getAttribute('data-page') === id);
    });

    // Reveal elements
    setTimeout(function() {
      document.querySelectorAll('.reveal:not(.visible)').forEach(function(el) { el.classList.add('visible'); });
      if (typeof observeNewRevealElements === 'function') observeNewRevealElements();
    }, 80);

    // Page-specific init
    if (id === 'map-page') setTimeout(function() { if (typeof initMap === 'function') initMap(); }, 100);
    if (id === 'ar-page') setTimeout(function() { initARWithCamera(); }, 120);
    if (id === 'passport') {
      setTimeout(function() {
        if (typeof populatePassportPage === 'function') populatePassportPage();
        if (typeof animateProgress === 'function') animateProgress();
        // Update static passport card
        (function() {
          var user = typeof STATE !== 'undefined' ? STATE.user : null;
          var name = (user && user.name) ? user.name : 'Explorer';
          var xp = (typeof STATE !== 'undefined') ? (STATE.xp || 0) : 0;
          var level = Math.floor(xp / 500) + 1;
          var stamps = (typeof STATE !== 'undefined') ? (STATE.stamps ? STATE.stamps.length : 0) : 0;
          var avatar = (user && user.avatar) ? user.avatar : '👤';
          var nameEl = document.getElementById('passportCardName');
          var xpEl = document.getElementById('passportCardXp');
          var lvlEl = document.getElementById('passportCardLvl');
          var stEl = document.getElementById('passportCardStamps');
          var avEl = document.getElementById('passportCardAvatar');
          if (nameEl) nameEl.textContent = name;
          if (xpEl) xpEl.textContent = xp;
          if (lvlEl) lvlEl.textContent = 'LVL ' + level;
          if (stEl) stEl.textContent = stamps;
          if (avEl) avEl.textContent = avatar;
        })();
      }, 80);
    }
    if (id === 'tram-page') setTimeout(function() { if (typeof populateTramPage === 'function') populateTramPage(STATE.tramTab || 'routes'); }, 100);
    if (id === 'stamp-binder') setTimeout(function() { if (typeof renderStampBinder === 'function') renderStampBinder(); }, 100);
    if (id === 'missions') setTimeout(function() { if (typeof renderMissionsV2 === 'function') renderMissionsV2(STATE.missionTab || 'all'); }, 100);
    if (id === 'community-page') setTimeout(function() { if (typeof populateCommunityPage === 'function') populateCommunityPage(); }, 100);
    if (id === 'favorites') setTimeout(function() { if (typeof populateFavorites === 'function') populateFavorites(); }, 100);
    if (id === 'home') {
      setTimeout(function() { if (typeof animateCounters === 'function') animateCounters(); }, 200);
    }
  };
})();


// ── REAL CAMERA AR ─────────────────────────────────────────────
var _arStream = null;

function initARWithCamera() {
  if (typeof initARPage === 'function') initARPage();

  var frame = document.getElementById('arCameraFrame');
  if (!frame) return;

  // If video already running, skip
  if (frame.querySelector('video.ar-video-feed')) return;

  // Remove old no-cam placeholder if any
  var oldMsg = frame.querySelector('.ar-no-camera-msg');
  if (oldMsg) oldMsg.remove();

  // Try getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' }, // rear camera on mobile
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    }).then(function(stream) {
      _arStream = stream;
      var video = document.createElement('video');
      video.className = 'ar-video-feed';
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      video.srcObject = stream;
      frame.insertBefore(video, frame.firstChild);

      // Update label
      var lbl = document.getElementById('arCameraLabel');
      if (lbl && lbl.textContent === 'SELECT A SITE BELOW TO SCAN') {
        lbl.textContent = 'POINT CAMERA · SELECT SITE BELOW';
      }
    }).catch(function(err) {
      // Camera denied or unavailable — show nice placeholder
      showNoCameraState(frame, err.name === 'NotAllowedError' ? 'Camera permission denied' : 'Camera unavailable');
    });
  } else {
    showNoCameraState(frame, 'Camera not supported on this device');
  }

  // Stop camera when leaving AR page
  document.addEventListener('page-change', function stopCam(e) {
    if (e.detail !== 'ar-page' && _arStream) {
      _arStream.getTracks().forEach(function(t) { t.stop(); });
      _arStream = null;
      var v = frame && frame.querySelector('video.ar-video-feed');
      if (v) v.remove();
    }
  }, { once: true });
}

function showNoCameraState(frame, msg) {
  var existing = frame.querySelector('.ar-no-camera-msg');
  if (existing) return;
  var div = document.createElement('div');
  div.className = 'ar-no-camera-msg';
  div.innerHTML = '<i class="fa fa-camera-slash"></i>' +
    '<span>' + (msg || 'Camera unavailable') + '</span>' +
    '<span style="font-size:9px;opacity:0.5;margin-top:4px;">HERITAGE DATA MODE ACTIVE</span>';
  frame.insertBefore(div, frame.firstChild);
}

// Stop camera when navigating away from AR
(function() {
  var _origSP = window.showPage;
  window.showPage = function(id) {
    if (id !== 'ar-page' && _arStream) {
      _arStream.getTracks().forEach(function(t) { t.stop(); });
      _arStream = null;
      var frame = document.getElementById('arCameraFrame');
      var v = frame && frame.querySelector('video.ar-video-feed');
      if (v) v.remove();
    }
    _origSP(id);
  };
})();


// ── LANYARD BOOT — single clean init on passport open ──────────
function bootLanyard() {
  var scene = document.getElementById('lanyardScene');
  if (!scene) return;
  // Clear any stale content
  var oldCard = scene.querySelector('.lanyard-id-card');
  if (oldCard) oldCard.remove();
  var oldCanvas = scene.querySelector('.lanyard-canvas');
  if (oldCanvas) { oldCanvas.width = 0; }

  // Re-trigger the IIFE init
  if (typeof window._lanyardInit === 'function') {
    window._lanyardInit();
  }
}

// ── HOLOGRAPHIC CARD: hue-rotate sync with mouse ───────────────
(function upgradeHolographicCards() {
  function attach(sceneId, cardId) {
    var scene = document.getElementById(sceneId);
    var card  = document.getElementById(cardId);
    if (!scene || !card) return;

    function onMove(e) {
      var rect = card.getBoundingClientRect();
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var cy = e.touches ? e.touches[0].clientY : e.clientY;
      var fromLeft = Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
      var fromTop  = Math.max(0, Math.min(1, (cy - rect.top)  / rect.height));
      // hue-rotate based on X position 0→360
      var hue = Math.round(fromLeft * 360) + 'deg';
      card.style.setProperty('--hue-rot', hue);
    }
    card.addEventListener('mousemove', onMove);
    card.addEventListener('touchmove', function(e) { onMove(e); }, { passive: true });
  }
  attach('rbScene1', 'rbCard1');
  attach('rbScene2', 'rbCard2');
})();