import {
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

import { Todo } from './todo.schema';

export default {
    todos: {
        type: new GraphQLList(Todo),
        description: 'List of todos for user',
        args: {
            first: {
                type: GraphQLInt,
                description: 'Returns the first n todo items of the user',
                defaultValue: 16
            },
            after: {
                type: GraphQLString,
                description: 'Returns todo items that come after a specified cursor'
            }
        },
        resolve(source, { first, after, before }, { documentClient, TableName }) {
            let params = {
                TableName,
                Limit: first
            };
            return documentClient.scan(params).promise().then(res => {
                console.log(JSON.stringify(res));
                return res.Items;
            });
        }
    }
};