// TODO: cat interface
export interface Cat {
  _id: any;
  cat_name: string;
  weight: number;
  filename: string;
  birthdate: string;
  location: {
    type: string;
    lat: number;
    long: number;
  };
  owner: {
    _id: number;
    user_name: string;
    email: string;
  };
}
