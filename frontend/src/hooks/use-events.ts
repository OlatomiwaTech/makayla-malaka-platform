import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { EventsResponse } from '@/types/event';

export type EventPeriod = 'upcoming' | 'past' | 'all';

export const useEvents = (
  period: EventPeriod = 'upcoming',
  page = 1,
  limit = 12,
) => {
  return useQuery({
    queryKey: ['events', period, page, limit],
    queryFn: () => {
      const search = new URLSearchParams({
        period,
        page: String(page),
        limit: String(limit),
      });

      return api<EventsResponse>(`/events?${search.toString()}`);
    },
  });
};
