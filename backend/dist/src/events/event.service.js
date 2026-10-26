import { prisma } from '../lib/prisma.js';
const publicStatuses = ['UPCOMING', 'LIVE', 'COMPLETED'];
export const getPublicEvents = async (page, limit, period) => {
    const now = new Date();
    const where = {
        ...(period === 'upcoming' ? {
            OR: [
                { status: 'LIVE' },
                { status: 'UPCOMING', startsAt: { gte: now } },
            ],
        } : period === 'past' ? {
            status: 'COMPLETED',
            startsAt: { lt: now },
        } : { status: { in: [...publicStatuses] } }),
    };
    const [events, total] = await Promise.all([
        prisma.event.findMany({ where, orderBy: { startsAt: period === 'past' ? 'desc' : 'asc' }, skip: (page - 1) * limit, take: limit }),
        prisma.event.count({ where }),
    ]);
    return { events, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total } };
};
export const getPublicEventById = async (id) => {
    const event = await prisma.event.findFirst({ where: { id, status: { in: [...publicStatuses] } } });
    if (!event)
        throw new Error('Event not found');
    return event;
};
export const getManagedEvents = async (query) => {
    const where = {
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
export const getManagedEventById = async (id) => {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event)
        throw new Error('Event not found');
    return event;
};
export const createEvent = (input) => prisma.event.create({ data: {
        title: input.title,
        ...(input.description !== undefined ? { description: input.description || null } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl || null } : {}),
        ...(input.location !== undefined ? { location: input.location || null } : {}),
        startsAt: input.startsAt, endsAt: input.endsAt ?? null,
        ...(input.registrationUrl !== undefined ? { registrationUrl: input.registrationUrl || null } : {}),
        status: input.status,
    } });
export const updateEvent = async (id, input) => {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing)
        throw new Error('Event not found');
    const startsAt = input.startsAt ?? existing.startsAt;
    const endsAt = input.endsAt === undefined ? existing.endsAt : input.endsAt;
    if (endsAt && endsAt < startsAt)
        throw new Error('End time must be on or after the start time.');
    return prisma.event.update({ where: { id }, data: {
            ...(input.title !== undefined ? { title: input.title } : {}),
            ...(input.description !== undefined ? { description: input.description || null } : {}),
            ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl || null } : {}),
            ...(input.location !== undefined ? { location: input.location || null } : {}),
            ...(input.startsAt !== undefined ? { startsAt: input.startsAt } : {}),
            ...(input.endsAt !== undefined ? { endsAt: input.endsAt } : {}),
            ...(input.registrationUrl !== undefined ? { registrationUrl: input.registrationUrl || null } : {}),
            ...(input.status !== undefined ? { status: input.status } : {}),
        } });
};
export const updateEventStatus = async (id, status) => {
    const exists = await prisma.event.findUnique({ where: { id }, select: { id: true } });
    if (!exists)
        throw new Error('Event not found');
    return prisma.event.update({ where: { id }, data: { status } });
};
//# sourceMappingURL=event.service.js.map