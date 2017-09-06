import { Todo } from './todo.schema';

import { GraphQLString } from 'graphql';

export default {
    teamTodoAdded: {
        type: Todo,
        args: {
            teamName: {
                type: GraphQLString,
                description: 'Team name filter for todoAdded subscription'
            }
        },
        description: 'New todo added',
        subscribe: () => {} // no logic should be here. See Publisher in ws transport for setting up filter functions and mapping subscription names to channels.
    }
};