import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditsAPI } from '../../../api/credits';
import type { UpdateCreditPayload } from '../../../types';

export const useBatchUpdateCredits = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ ids, payload }: { ids: number[]; payload: UpdateCreditPayload }) => {
            const promises = ids.map(id => CreditsAPI.update(id, payload));
            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['credits'] });
        },
    });
};
