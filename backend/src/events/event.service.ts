import type { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import type { CreateEventInput, ManagedEventListQuery, UpdateEventInput } from '../schemas/event.schema.js';

const publicStatuses = ['UPCOMING', 'LIVE', 'COMPLETED'] as const;

function nullable(value: string | undefined) {
	return value === undefined ? undefined : value || null;
}

export const getPublicEvents = async (page: number, limit: number, period: 'upcoming' | 'past' | 'all') => {
	const now = new Date();
	const where: Prisma.EventWhereInput = {
		status: period === 'past' ? 'COMPLETED' : period === 'upcoming' ? { in: ['UPCOMING', 'LIVE'] } : { in: [...publicStatuses] },
		...(period === 'upcoming' ? { startsAt: { gte: now } } : period === 'past' ? { startsAt: { lt: now } } : {}),
	};
	const [events, total] = await Promise.all([
		prisma.event.findMany({ where, orderBy: { startsAt: period === 'past' ? 'desc' : 'asc' }, skip: (page - 1) * limit, take: limit }),
		prisma.event.count({ where }),
	]);
	return { events, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total } };
};

export const getPublicEventById = async (id: string) => {
	const event = await prisma.event.findFirst({ where: { id, status: { in: [...publicStatuses] } } });
	if (!event) throw new Error('Event not found');
	return event;
};

export const getManagedEvents = async (query: ManagedEventListQuery) => {
	const where: Prisma.EventWhereInput = {
		...(query.status ? { status: query.status } : {}),
		...(query.search ? { OR: [
			{ title: { contains: query.search, mode: 'insensitive' } },
			{ location: { contains: query.search, mode: 'insensitive' } },
		] } : {}),
		...(query.period === 'upcoming' ? { startsAt: { gte: new Date() } } : query.period === 'past' ? { startsAt: { lt: new Date() } } : {}),
	};
	const [events, total] = await Promise.all([
		prisma.event.findMany({ where, orderBy: { startsAt: 'desc' }, skip: (query.page - 1) * query.limit, take: query.limit }),
		prisma.event.count({ where }),
	]);
	return { events, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit), hasNextPage: query.page * query.limit < total } };
};

export const getManagedEventById = async (id: string) => {
	const event = await prisma.event.findUnique({ where: { id } });
	if (!event) throw new Error('Event not found');
	return event;
};

export const createEvent = (input: CreateEventInput) => prisma.event.create({ data: {
	title: input.title, description: nullable(input.description), imageUrl: nullable(input.imageUrl), location: nullable(input.location),
	startsAt: input.startsAt, endsAt: input.endsAt ?? null, registrationUrl: nullable(input.registrationUrl), status: input.status,
} });

export const updateEvent = async (id: string, input: UpdateEventInput) => {
	const existing = await prisma.event.findUnique({ where: { id } });
	if (!existing) throw new Error('Event not found');
	const startsAt = input.startsAt ?? existing.startsAt;
	const endsAt = input.endsAt === undefined ? existing.endsAt : input.endsAt;
	if (endsAt && endsAt < startsAt) throw new Error('End time must be on or after the start time.');
	return prisma.event.update({ where: { id }, data: {
		...(input.title !== undefined ? { title: input.title } : {}),
		...(input.description !== undefined ? { description: nullable(input.description) } : {}),
		...(input.imageUrl !== undefined ? { imageUrl: nullable(input.imageUrl) } : {}),
		...(input.location !== undefined ? { location: nullable(input.location) } : {}),
		...(input.startsAt !== undefined ? { startsAt: input.startsAt } : {}),
		...(input.endsAt !== undefined ? { endsAt: input.endsAt } : {}),
		...(input.registrationUrl !== undefined ? { registrationUrl: nullable(input.registrationUrl) } : {}),
		...(input.status !== undefined ? { status: input.status } : {}),
	} });
};

export const updateEventStatus = async (id: string, status: CreateEventInput['status']) => {
	const exists = await prisma.event.findUnique({ where: { id }, select: { id: true } });
	if (!exists) throw new Error('Event not found');
	return prisma.event.update({ where: { id }, data: { status } });
};
