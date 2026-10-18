import type { Request, Response } from 'express';
import { updateContentRoleSchema } from '../schemas/admin.schema.js';
import { listManagedAccounts, updateManagedAccountRole } from '../services/admin.service.js';

export const listAccounts = async (_req: Request, res: Response) => {
  const accounts = await listManagedAccounts();
  res.status(200).json({
    success: true,
    data: { accounts },
  });
};

export const updateAccountRole = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: 'Account id is required.',
    });
  }

  const input = updateContentRoleSchema.parse(req.body);
  const account = await updateManagedAccountRole(id, input);

  return res.status(200).json({
    success: true,
    data: { account },
  });
};
