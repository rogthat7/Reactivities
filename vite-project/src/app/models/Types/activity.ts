import { Profile } from "./profile";

export interface Activity {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  latitude: number | 0;
  longitude: number;
  attendees: Profile[];
  isGoing: boolean;
  isCancelled: boolean;
  isHost: boolean;
  hostUsername: string;
  hostId: string;
  hostDisplayName: string;
  hostImageUrl: string;
}
