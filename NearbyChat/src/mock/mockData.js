// ─── MOCK DATA ────────────────────────────────────────────────────
// Used for frontend testing WITHOUT backend

export const MOCK_USER = {
  id: 'user-001',
  username: 'Karim',
  avatarUrl: null,
  createdAt: '2025-01-01T00:00:00Z',
};

export const MOCK_ZONES = [
  {
    id: 'zone-001',
    name: 'Quartier Hassan',
    color: '#0A84FF',
    userCount: 12,
    coordinates: [
      { latitude: 34.020, longitude: -6.841 },
      { latitude: 34.022, longitude: -6.838 },
      { latitude: 34.019, longitude: -6.835 },
      { latitude: 34.017, longitude: -6.839 },
    ],
  },
  {
    id: 'zone-002',
    name: 'Agdal',
    color: '#4ECDC4',
    userCount: 8,
    coordinates: [
      { latitude: 33.993, longitude: -6.854 },
      { latitude: 33.996, longitude: -6.849 },
      { latitude: 33.991, longitude: -6.845 },
      { latitude: 33.988, longitude: -6.851 },
    ],
  },
  {
    id: 'zone-003',
    name: 'Université Mohammed V',
    color: '#FFE66D',
    userCount: 34,
    coordinates: [
      { latitude: 33.999, longitude: -6.852 },
      { latitude: 34.001, longitude: -6.848 },
      { latitude: 33.997, longitude: -6.844 },
      { latitude: 33.995, longitude: -6.849 },
    ],
  },
  {
    id: 'zone-004',
    name: 'Salé Médina',
    color: '#A8E6CF',
    userCount: 5,
    coordinates: [
      { latitude: 34.037, longitude: -6.800 },
      { latitude: 34.040, longitude: -6.795 },
      { latitude: 34.035, longitude: -6.792 },
      { latitude: 34.032, longitude: -6.797 },
    ],
  },
];

export const MOCK_CURRENT_ZONE = MOCK_ZONES[0];

export const MOCK_MESSAGES = [
  {
    id: 'msg-001',
    username: 'Sara',
    text: 'Salam tout le monde 👋',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    isOwn: false,
  },
  {
    id: 'msg-002',
    username: 'Karim',
    text: 'Salam ! Il y a un marché ce soir ?',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    isOwn: true,
  },
  {
    id: 'msg-003',
    username: 'Youssef',
    text: 'Oui, souk Ahad, jusqu\'à 22h apparemment',
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    isOwn: false,
  },
  {
    id: 'msg-004',
    username: 'Nadia',
    text: 'Est-ce que quelqu\'un sait si le café Ibn Battouta est ouvert ?',
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    isOwn: false,
  },
  {
    id: 'msg-005',
    username: 'Karim',
    text: 'Je passe devant, je check 👀',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    isOwn: true,
  },
  {
    id: 'msg-006',
    username: 'Sara',
    text: 'Merci Karim !',
    createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    isOwn: false,
  },
];

export const MOCK_TYPING_USER = 'Nadia';
