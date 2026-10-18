import { updateContentRoleSchema } from '../schemas/admin.schema.js';
import { listManagedAccounts, updateManagedAccountRole } from '../services/admin.service.js';
export const listAccounts = async (_req, res) => {
    const accounts = await listManagedAccounts();
    res.status(200).json({
        success: true,
        data: { accounts },
    });
};
export const updateAccountRole = async (req, res) => {
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
//# sourceMappingURL=admin.controller.js.map