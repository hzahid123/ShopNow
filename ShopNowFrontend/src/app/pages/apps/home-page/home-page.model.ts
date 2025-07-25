interface products {
    id: number;
    time: string;
    imgSrc: string;
    user: string;
    title: string;
    wishList: boolean;
    category: string;
    rating: number;
    featuredPost: boolean;
    price: number;
    // condition: string;
    // weight: number;
    // subcategory: string;
    // subSubCategory: string;
    // cashOnDelievery: boolean;
  }
  
  export const products: products[] = [
    {
      id: 1,
      time: '2 mins Read',
      imgSrc: '/assets/images/blog/blog-img1.jpg',
      user: '/assets/images/profile/user-1.jpg',
      title: 'Early Black Friday Amazon deals: cheap TVs, headphones, laptops',
      wishList: true,
      category: 'Gadget',
      rating: 5,
      featuredPost: true,
      price: 300,
    },
    {
      id: 2,
      time: '2 mins Read',
      imgSrc: '/assets/images/blog/blog-img2.jpg',
      user: '/assets/images/profile/user-2.jpg',
      title: 'Presented by Max Rushden with Barry Glendenning, Philippe Auclair',
      wishList: false,
      category: 'Health',
      rating: 5,
      featuredPost: true,
      price: 400
    },
    {
      id: 3,
      time: '2 mins Read',
      imgSrc: '/assets/images/blog/blog-img3.jpg',
      user: '/assets/images/profile/user-3.jpg',
      title: 'As yen tumbles, gadget-loving Japan goes for secondhand iPhones',
      wishList: true,
      category: 'Gadget',
      rating: 5,
      featuredPost: false,
      price: 200,
    },
    {
      id: 4,
      time: '2 mins Read',
      imgSrc: '/assets/images/blog/blog-img4.jpg',
      user: '/assets/images/profile/user-4.jpg',
      title:'Intel loses bid to revive antitrust case against patent foe Fortress',
      wishList: true,
      category: 'Social',
      rating: 5,
      featuredPost: false,
      price: 500,
    },
    {
      id: 5,
      time: '2 mins Read',
      imgSrc: '/assets/images/blog/blog-img5.jpg',
      user: '/assets/images/profile/user-1.jpg',
      title: 'COVID outbreak deepens as more lockdowns loom in China',
      wishList: true,
      category: 'Lifestyle',
      rating: 5,
      featuredPost: false,
      price: 100,
    },
    {
      id: 6,
      time: '2 mins Read',
      imgSrc: '/assets/images/blog/blog-img6.jpg',
      user: '/assets/images/profile/user-2.jpg',
      title: 'Streaming video way before it was cool, go dark tomorrow',
      wishList: true,
      category: 'Health',
      rating: 5,
      featuredPost: false,
      price: 550,
    },
    
  ];
  