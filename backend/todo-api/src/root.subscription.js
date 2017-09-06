import { GraphQLObjectType } from 'graphql';

import todo from './models/todo/todo.subscriptions';

const rootFields = Object.assign({},
    todo
);

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: () => rootFields
});