import { GraphQLObjectType } from 'graphql';

import todo from './models/todo/todo.queries';

const rootFields = Object.assign({},
  todo
);

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => rootFields
});
