// ============================================
// ANIME VERSE — Main Data File
// Edit this file to add/update anime content
// ============================================

const animeData = [
  {
    id: 1,
    title: "Demon Slayer",
    type: "anime",
    genre: ["Action", "Fantasy", "Drama"],
    rating: 9.2,
    year: 2019,
    status: "Ongoing",
    studio: "ufotable",
    thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d176d184?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80",
    description: "Tanjiro Kamado ek samanya laadka hai jiska pura parivar ek demon ke haath mar jaata hai. Sirf uski behen Nezuko bachti hai, lekin woh bhi demon ban jaati hai. Tanjiro ek demon slayer banta hai apni behen ko wapas insaan banane ke liye.",
    trending: true,
    latest: false,
    top10: true,
    top10rank: 1,
    seasons: [
      {
        id: 1,
        title: "Season 1",
        year: 2019,
        episodes: [
          {
            id: 1,
            title: "Cruelty",
            description: "Tanjiro apne ghar se shaher jaata hai aur wapas aakar apne parivar ko mara hua paata hai.",
            duration: "23 min",
            thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d176d184?w=300&q=80",
            videoUrl: ""
          },
          {
            id: 2,
            title: "Trainer Sakonji Urokodaki",
            description: "Tanjiro Urokodaki ke paas jaata hai training ke liye.",
            duration: "23 min",
            thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d176d184?w=300&q=80",
            videoUrl: ""
          },
          {
            id: 3,
            title: "Sabito and Makomo",
            description: "Tanjiro forest me train karta hai aur do interesting logon se milta hai.",
            duration: "23 min",
            thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d176d184?w=300&q=80",
            videoUrl: ""
          }
        ]
      },
      {
        id: 2,
        title: "Mugen Train Arc",
        year: 2021,
        episodes: [
          {
            id: 1,
            title: "Flame Hashira Kyojuro Rengoku",
            description: "Tanjiro aur saathi Mugen Train me sawaar hote hain.",
            duration: "24 min",
            thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d176d184?w=300&q=80",
            videoUrl: ""
          },
          {
            id: 2,
            title: "Enmu",
            description: "Ek naya aur khatarnak demon saamne aata hai.",
            duration: "24 min",
            thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d176d184?w=300&q=80",
            videoUrl: ""
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Attack on Titan",
    type: "anime",
    genre: ["Action", "Drama", "Mystery"],
    rating: 9.8,
    year: 2013,
    status: "Completed",
    studio: "MAPPA",
    thumbnail: "https://images.unsplash.com/photo-1614850523459-c2f4c6332c54?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1614850523459-c2f4c6332c54?w=1200&q=80",
    description: "Ek aisi duniya jahan insaan vikaral titans se bachne ke liye dev divar ke andar rehte hain. Eren Yeager apne saathiyon ke saath titans se ladne ki kasam khaata hai.",
    trending: true,
    latest: false,
    top10: true,
    top10rank: 2,
    seasons: [
      {
        id: 1,
        title: "Season 1",
        year: 2013,
        episodes: [
          {
            id: 1,
            title: "To You, in 2000 Years",
            description: "Ek shant subah Wall Maria toot jaati hai aur titans andar aa jaate hain.",
            duration: "24 min",
            thumbnail: "https://images.unsplash.com/photo-1614850523459-c2f4c6332c54?w=300&q=80",
            videoUrl: ""
          },
          {
            id: 2,
            title: "That Day",
            description: "Pichle kuch saalon ki kahani flashback me dikhti hai.",
            duration: "24 min",
            thumbnail: "https://images.unsplash.com/photo-1614850523459-c2f4c6332c54?w=300&q=80",
            videoUrl: ""
          }
        ]
      },
      {
        id: 2,
        title: "Season 2",
        year: 2017,
        episodes: [
          {
            id: 1,
            title: "Beast Titan",
            description: "Ek naaya aur anokha titan nazar aata hai.",
            duration: "24 min",
            thumbnail: "https://images.unsplash.com/photo-1614850523459-c2f4c6332c54?w=300&q=80",
            videoUrl: ""
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "One Punch Man",
    type: "anime",
    genre: ["Action", "Comedy", "Superhero"],
    rating: 8.8,
    year: 2015,
    status: "Ongoing",
    studio: "Madhouse",
    thumbnail: "https://images.unsplash.com/photo-1559570278-a22d9e8a8b35?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1559570278-a22d9e8a8b35?w=1200&q=80",
    description: "Saitama ek aisa superhero hai jo kisi bhi dushman ko sirf ek ghoonse mein hara deta hai. Lekin yahi uski takleef hai — usse koi challenge hi nahi milta.",
    trending: false,
    latest: true,
    top10: true,
    top10rank: 3,
    seasons: [
      {
        id: 1,
        title: "Season 1",
        year: 2015,
        episodes: [
          {
            id: 1,
            title: "The Strongest Man",
            description: "Saitama apni pehli baadi ladaai mein bhag leta hai.",
            duration: "24 min",
            thumbnail: "https://images.unsplash.com/photo-1559570278-a22d9e8a8b35?w=300&q=80",
            videoUrl: ""
          },
          {
            id: 2,
            title: "The Lone Cyborg",
            description: "Saitama ek cyborg se milta hai jo uska shishya banna chahta hai.",
            duration: "24 min",
            thumbnail: "https://images.unsplash.com/photo-1559570278-a22d9e8a8b35?w=300&q=80",
            videoUrl: ""
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Your Name",
    type: "movie",
    genre: ["Romance", "Fantasy", "Drama"],
    rating: 9.0,
    year: 2016,
    status: "Completed",
    studio: "CoMix Wave Films",
    thumbnail: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&q=80",
    description: "Do anjaan log — ek city mein rehne wala ladka aur ek pahaad ke gaon mein rehne wali ladki — ajeeb tarike se ek doosre ke jism mein badal jaate hain.",
    trending: false,
    latest: true,
    top10: true,
    top10rank: 4,
    seasons: [
      {
        id: 1,
        title: "Movie",
        year: 2016,
        episodes: [
          {
            id: 1,
            title: "Your Name (Full Movie)",
            description: "Ek romantic fantasy movie Makoto Shinkai ke dwara.",
            duration: "1h 52min",
            thumbnail: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=300&q=80",
            videoUrl: ""
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Naruto Shippuden",
    type: "series",
    genre: ["Action", "Adventure", "Ninja"],
    rating: 9.1,
    year: 2007,
    status: "Completed",
    studio: "Pierrot",
    thumbnail: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=1200&q=80",
    description: "Naruto Uzumaki Hokage banne ke sapne ke saath bada hota hai. Shippuden mein woh ek mature ninja ban chuka hai aur apne dost Sasuke ko dhundhne nikal padhta hai.",
    trending: true,
    latest: false,
    top10: true,
    top10rank: 5,
    seasons: [
      {
        id: 1,
        title: "Season 1 - Kazekage Rescue",
        year: 2007,
        episodes: [
          {
            id: 1,
            title: "Homecoming",
            description: "Naruto 2.5 saal baad wapas Konoha aata hai.",
            duration: "23 min",
            thumbnail: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=300&q=80",
            videoUrl: ""
          },
          {
            id: 2,
            title: "The Akatsuki Makes Its Move",
            description: "Akatsuki ek naye mission pe nikal padhte hain.",
            duration: "23 min",
            thumbnail: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=300&q=80",
            videoUrl: ""
          }
        ]
      }
    ]
  }
];
