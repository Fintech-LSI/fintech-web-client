export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    membershipDate: string; // adjust this to the actual format you receive
    currentBalance: number;
    preferredCurrency: string;
    favoriteCoin: string;
    accountType: string;
    portfolioValue: number;
    portfolio: any[];  // adjust this based on your portfolio structure
    image: {
      url: string;
    };
  }
  