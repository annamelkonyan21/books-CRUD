import {ICategory} from './category.interface';

export interface IBook {
  id: number;
  title: string;
  author: string;
  category: ICategory;
  date: any;
}
