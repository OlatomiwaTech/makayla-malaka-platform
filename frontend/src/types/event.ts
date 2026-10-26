export type EventStatus = 'DRAFT' | 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export type Event = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  registrationUrl: string | null;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
};

export type EventsResponse = {
  success: boolean;
  data: {
    events: Event[];
    pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean };
  };
};

export type EventResponse = { success: boolean; data: { event: Event } };
