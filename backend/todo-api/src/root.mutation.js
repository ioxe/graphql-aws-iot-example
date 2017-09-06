import { GraphQLObjectType } from 'graphql';

import todo from './models/todo/todo.mutations';

const rootFields = Object.assign({},
  todo
);

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => rootFields
});
