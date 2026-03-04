import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditsAPI } from '../../../api/credits';
import type { UpdateCreditPayload } from '../../../types';

export const useUpdateCredit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateCreditPayload }) =>
            CreditsAPI.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['credits'] });
        },
    });
};
