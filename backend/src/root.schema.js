import { GraphQLSchema } from 'graphql';

import query from './root.query';
import mutation from './root.mutation';
// import subscription from './root.subscription';

export default new GraphQLSchema({ query, mutation });
