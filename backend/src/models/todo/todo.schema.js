import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
    GraphQLInputObjectType
} from 'graphql';

export const Todo = new GraphQLObjectType({
    name: 'Todo',
    description: 'A todo item',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
            description: 'Db uuid'
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Unique friendly name for todo item'
        },
        content: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'content of todo item'
        },
        timestamp: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'iso date string'
        }
    })
});

export const CreateTodoInput = new GraphQLInputObjectType({
    name: 'CreateTodoInput',
    fields: () => ({
        timestamp: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) }
    })
});

export const UpdateTodoInput = CreateTodoInput;

export const DeleteTodoInput = new GraphQLInputObjectType({
    name: 'DeleteTodoInput',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) }
    })
});