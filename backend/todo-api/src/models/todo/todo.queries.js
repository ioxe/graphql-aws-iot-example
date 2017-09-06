import {
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

import { Todo } from './todo.schema';

export default {
    teamTodos: {
        type: new GraphQLList(Todo),
        description: 'List of todos for user',
        args: {
            first: {
                type: GraphQLInt,
                description: 'Returns the first n todo items of the user',
                defaultValue: 25
            },
            teamName: {
                type: GraphQLString,
                description: 'Name of team'
            }
        },
        resolve(source, { first, teamName }, { documentClient, TableName }) {
            let params = {
                TableName,
                IndexName: process.env.TeamNameToTodosIndex,
                KeyConditionExpression: 'teamName = :hkey',
                ExpressionAttributeValues: {
                    ':hkey': teamName
                },
                Limit: first
            };
            return documentClient.query(params).promise().then(res => {
                return res.Items;
            });
        }
    }
};