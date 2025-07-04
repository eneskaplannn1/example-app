import { Plant } from './plant';

export interface UserPlant {
  id: string;
  user_id: string;
  plant_id: string;
  nickname: string;
  acquired_date: string;
  last_watered: string;
  notes: string;
  image_url?: string;
  plants?: Plant;
}
