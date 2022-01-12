export const isNotProduction = () => {
    return process.env.NODE_ENV !== 'production';
};
