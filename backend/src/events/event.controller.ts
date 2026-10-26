import type { Request, Response } from 'express';
import { createEventSchema, managedEventListQuerySchema, publicEventListQuerySchema, updateEventSchema, updateEventStatusSchema } from '../schemas/event.schema.js';
import { createEvent, getManagedEventById, getManagedEvents, getPublicEventById, getPublicEvents, updateEvent, updateEventStatus } from './event.service.js';

const getId = (req: Request) => {
	const id = req.params.id;
	if (!id || Array.isArray(id)) throw new Error('Event not found');
	return id;
};

export const listPublic = async (req: Request, res: Response) => {
	const query = publicEventListQuerySchema.parse(req.query);
	res.json({ success: true, data: await getPublicEvents(query.page, query.limit, query.period) });
};
export const getPublic = async (req: Request, res: Response) => res.json({ success: true, data: { event: await getPublicEventById(getId(req)) } });
export const listManaged = async (req: Request, res: Response) => res.json({ success: true, data: await getManagedEvents(managedEventListQuerySchema.parse(req.query)) });
export const getManaged = async (req: Request, res: Response) => res.json({ success: true, data: { event: await getManagedEventById(getId(req)) } });
export const create = async (req: Request, res: Response) => res.status(201).json({ success: true, data: { event: await createEvent(createEventSchema.parse(req.body)) } });
export const update = async (req: Request, res: Response) => res.json({ success: true, data: { event: await updateEvent(getId(req), updateEventSchema.parse(req.body)) } });
export const changeStatus = async (req: Request, res: Response) => {
	const { status } = updateEventStatusSchema.parse(req.body);
	res.json({ success: true, data: { event: await updateEventStatus(getId(req), status) } });
};
