export const aiSubscriptions = {
    aiEvents: {
        subscribe: (_: any, __: any, { pubsub }: any) => pubsub.asyncIterator('AI_EVENT'),
    },
};
