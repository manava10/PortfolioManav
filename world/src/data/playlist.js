const MUSIC_ORIGIN = 'https://manavportfoliobject.s3.ap-south-2.amazonaws.com';

const songs = [
  {
    title: 'Saajna',
    artist: 'Falak Shabir',
    filename: 'I Me Aur Main Saajna (Lyrical) Falak Shabir John Abraham, Chitrangda Singh, Prachi Desai.mp3',
  },
  {
    title: 'Kooch Na Karin',
    artist: 'Azhar Abbas',
    filename: 'Kooch Na Karin 8K Video Song Load Wedding Fahad Mustafa & Mehwish Hayat Azhar Abbas.mp3',
  },
  {
    title: 'Nazm Nazm',
    artist: 'Arko',
    filename: 'Nazm Nazm - Lyrical Bareilly Ki Barfi Kriti Sanon, Ayushmann Khurrana & Rajkummar Rao Arko.mp3',
    url: 'https://manavportfoliobject.s3.ap-south-2.amazonaws.com/MusicPortfoio/Nazm+Nazm+-+Lyrical+Bareilly+Ki+Barfi+Kriti+Sanon%2C+Ayushmann+Khurrana+%26+Rajkummar+Rao+Arko.mp3',
  },
  {
    title: 'Sahiba',
    artist: 'Jasleen Royal · Stebin',
    filename: 'Sahiba (Music Video) Jasleen Royal Vijay Deverakonda Radhika Madan Stebin Priya Aditya Sudhanshu.mp3',
  },
  {
    title: 'Stay a Little Longer',
    artist: 'Anushka Shahaney',
    filename: 'Stay A Little Longer - Full Video Half Girlfriend Arjun Kapoor, Shraddha Kapoor Anushka Shahaney.mp3',
    url: 'https://manavportfoliobject.s3.ap-south-2.amazonaws.com/MusicPortfoio/Stay+A+Little+Longer+-+Full+Video+Half+Girlfriend+Arjun+Kapoor%2C+Shraddha+Kapoor+Anushka+Shahaney.mp3',
  },
  {
    title: 'Sun Saawariya',
    artist: 'Accha Insaan · AtharvaMusic · Yaani Karnawat',
    filename: 'sun saawariya Official Visualiser Accha Insaan, AtharvaMusic, Yaani Karnawat.mp3',
    url: 'https://manavportfoliobject.s3.ap-south-2.amazonaws.com/MusicPortfoio/sun+saawariya+Official+Visualiser+Accha+Insaan%2C+AtharvaMusic%2C+Yaani+Karnawat.mp3',
  },
  {
    title: 'Vaaroon Forever',
    artist: 'Shreya Ghoshal · Romy',
    filename: 'Vaaroon Forever (Official Video) Mirzapur The Movie Shreya Ghoshal Romy Anand B Ginny D.mp3',
  },
];

export const HOSTED_PLAYLIST = songs.map(({ filename, ...song }) => ({
  ...song,
  source: 'hosted',
  key: `MusicPortfoio/${filename}`,
  url: song.url || `${MUSIC_ORIGIN}/MusicPortfoio/${encodeURIComponent(filename)}`,
}));
