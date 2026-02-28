export const successResponse = <T>(message: string = 'Success', data?: T, meta?: any) => {
    return {
        success: true,
        message,
        ...(data !== undefined && { data }),
        ...(meta !== undefined && { meta }),
    };
};
