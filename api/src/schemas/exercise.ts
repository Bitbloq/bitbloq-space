import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const exerciseSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    scalar Date
    scalar ObjectID

    type Query {
      exercises: [Exercise]
      exercisesByDocument(document: ObjectID!): [Exercise]
      exerciseByID(id: ObjectID!): Exercise
    }
    type Mutation {
      createExercise(input: ExerciseIn!): Exercise
      changeSubmissionsState(id: ObjectID!, subState: Boolean!): Exercise
      updateExercise(id: ObjectID!, input: ExerciseIn): Exercise
      deleteExercise(id: ObjectID!, code: String!): Exercise
    }

    type Exercise {
      id: ObjectID
      document: ObjectID
      user: ObjectID
      title: String
      content: String
      code: String
      type: String
      acceptSubmissions: Boolean
      versions: [String]
      expireDate: Date
      createdAt: Date
      updatedAt: Date
    }

    input ExerciseIn {
      document: ObjectID
      title: String
      code: String
      acceptSubmissions: Boolean
      versions: Version
      expireDate: Date
    }

    input Version {
      id: String
      content: String
      date: String
    }
  `,
});

addMockFunctionsToSchema({ schema: exerciseSchema });
export default exerciseSchema;

// output Version {
//     id: String
//     content: String
//     date: String
//   }

//   output Submission {
//     id: String
//     studentNick: String
//     content: String
//     date: String
//     finished: Boolean
//     comment: String
//   }
