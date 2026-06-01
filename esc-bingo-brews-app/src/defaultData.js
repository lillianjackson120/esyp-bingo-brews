export const defaultSponsors = [
  { name: 'Crow Shields Bailey', level: 'Title Sponsor', logo: '/assets/crow-shields-bailey.png' },
  { name: 'BankPlus', level: 'Gold Sponsor', logo: '/assets/bankplus.jpg' },
  { name: 'Castle Technology', level: 'Gold Sponsor', logo: '/assets/castle.png' },
  { name: "Cockrell's Eastern Shore", level: 'Gold Sponsor', logo: '/assets/cockrells.png' },
  { name: 'Riviera Utilities', level: 'Team', logo: '/assets/riviera.jpg' },
  { name: 'Fairhope Brewing Company', level: 'Venue Partner', logo: '/assets/fairhope-brewing.webp' }
];

export const defaultTableSponsors = [
  'Wilkins Miller',
  'Social Magazine',
  'Tracey Goens',
  'Avizo',
  'Bryant Bank',
  'Daphne Utilities',
  'Uniti Fiber',
  'River Bank & Trust',
  'Alabama Credit Union',
  'Alabama Power'
];

export const defaultBreakMessages = [
  'Grab another drink.',
  'Purchase raffle tickets.',
  'Visit our sponsors.',
  'Thank you for supporting United Way.'
];

export const defaultSettings = {
  eventTitle: 'ESC Young Professionals Bingo & Brews',
  presentedBy: 'Crow Shields Bailey',
  beneficiary: 'United Way of Baldwin County',
  pattern: 'Traditional Bingo',
  announcement: '',
  mode: 'live',
  sponsors: defaultSponsors,
  tableSponsors: defaultTableSponsors,
  breakMessages: defaultBreakMessages,
  beerBreakImage: '/assets/beer-break.jpg'
};

export const initialGame = {
  called: [],
  mode: 'live',
  announcement: '',
  hostLock: null,
  updatedAt: null
};
