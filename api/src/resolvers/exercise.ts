import { ApolloError } from "apollo-server-koa";
import { DocumentModel, IDocument } from "../models/document";
import { ExerciseModel, IExercise } from "../models/exercise";
import { SubmissionModel } from "../models/submission";
import { IUser, UserModel } from "../models/user";

import { logger, loggerController } from "../controllers/logs";

const exerciseResolver = {
  Mutation: {
    /**
     * Create exercise: create a new exercise with the content of the document father.
     * It stores the new exercise in the database with the document father information or new one provided by the user
     * args: exercise information
     */
    createExercise: async (root: any, args: any, context: any) => {
      const docFather: IDocument = await DocumentModel.findOne({
        _id: args.input.document,
        user: context.user.userID
      });
      if (!docFather) {
        throw new ApolloError(
          "Error creating exercise, it should part of one of your documents",
          "DOCUMENT_NOT_FOUND"
        );
      }
      const user: IUser = await UserModel.findById(context.user.userID);
      let newCode: string = Math.random()
        .toString(36)
        .substr(2, 6);
      while ((await ExerciseModel.findOne({ code: newCode })) != null) {
        console.log("The exercise code already exists");
        newCode = Math.random()
          .toString(36)
          .substr(2, 6);
      }
      const exerciseNew: IExercise = new ExerciseModel({
        user: context.user.userID,
        document: docFather._id,
        title: args.input.title,
        code: newCode,
        type: docFather.type,
        acceptSubmissions: args.input.acceptSubmissions,
        content: docFather.content,
        cache: docFather.cache,
        description: args.input.description || docFather.description,
        teacherName: user.name,
        expireDate: args.input.expireDate,
        image: docFather.image
      });
      loggerController.storeInfoLog(
        "API",
        "exercise",
        "create",
        exerciseNew.type,
        exerciseNew.user,
        ""
      );
      const newEx: IExercise = await ExerciseModel.create(exerciseNew);
      return newEx;
    },

    /**
     * Change Submission State: changes the value of the boolean acceptSubmissions.
     * args: exerciseID, new state of acceptSubmissions
     */
    changeSubmissionsState: async (root: any, args: any, context: any) => {
      const existExercise: IExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (!existExercise) {
        return new ApolloError("Exercise does not exist", "EXERCISE_NOT_FOUND");
      }
      loggerController.storeInfoLog(
        "API",
        "exercise",
        "changeSubState",
        existExercise.type,
        existExercise.user,
        ""
      );

      return ExerciseModel.findOneAndUpdate(
        { _id: existExercise._id },
        { $set: { acceptSubmissions: args.subState } },
        { new: true }
      );
    },

    /**
     * Delete exercise: delete one exercise of the user logged.
     * It deletes the exercise passed in the arguments if it belongs to the user logged.
     * This method deletes all the submissions related with the exercise ID.
     * args: exercise ID
     */
    deleteExercise: async (root: any, args: any, context: any) => {
      const existExercise: IExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (existExercise) {
        loggerController.storeInfoLog(
          "API",
          "exercise",
          "delete",
          existExercise.type,
          existExercise.user,
          ""
        );
        await SubmissionModel.deleteMany({ exercise: existExercise._id });
        return ExerciseModel.deleteOne({ _id: args.id }); // delete all the exercise dependencies
      } else {
        return new ApolloError("Exercise does not exist", "EXERCISE_NOT_FOUND");
      }
    },

    /**
     * Update exercise: update existing exercise.
     * It updates the exercise with the new information provided.
     * args: exercise ID, new exercise information.
     */
    updateExercise: async (root: any, args: any, context: any) => {
      const existExercise: IExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (existExercise) {
        loggerController.storeInfoLog(
          "API",
          "exercise",
          "update",
          existExercise.type,
          existExercise.user,
          ""
        );
        return ExerciseModel.findOneAndUpdate(
          { _id: existExercise._id },
          { $set: args.input },
          { new: true }
        );
      } else {
        return new ApolloError("Exercise does not exist", "EXERCISE_NOT_FOUND");
      }
    }
  },

  Query: {
    /**
     * Exercises: returns all the exercises of the user logged.
     * args: nothing.
     */
    exercises: async (root: any, args: any, context: any) => {
      return ExerciseModel.find({ user: context.user.userID });
    },

    /**
     * Exercise: returns the information of the exercise ID provided in the arguments.
     * It can be asked with the user logged token or the student token.
     * args: exercise ID.
     */
    exercise: async (root: any, args: any, context: any) => {
      if (context.user.exerciseID) {
        //  Token de alumno
        if (context.user.exerciseID !== args.id) {
          throw new ApolloError(
            "You only can ask for your token exercise",
            "NOT_YOUR_EXERCISE"
          );
        }
        const existExercise: IExercise = await ExerciseModel.findOne({
          _id: context.user.exerciseID
        });
        if (!existExercise) {
          throw new ApolloError(
            "Exercise does not exist",
            "EXERCISE_NOT_FOUND"
          );
        }
        return existExercise;
      } else if (context.user.userID) {
        //  token de profesor
        const existExercise: IExercise = await ExerciseModel.findOne({
          _id: args.id,
          user: context.user.userID
        });
        if (!existExercise) {
          throw new ApolloError(
            "Exercise does not exist",
            "EXERCISE_NOT_FOUND"
          );
        }
        return existExercise;
      }
    },

    /**
     * Exercises by document: returns all the exercises that depends on the document father ID passed in the arguments.
     * args: document ID.
     */
    exercisesByDocument: async (root: any, args: any, context: any) => {
      const docFather: IDocument = await DocumentModel.findOne({
        _id: args.document,
        user: context.user.userID
      });
      if (!docFather) {
        throw new ApolloError("document does not exist", "DOCUMENT_NOT_FOUND");
      }
      return await ExerciseModel.find({
        document: docFather._id,
        user: context.user.userID
      });
    }
  },

  Exercise: {
    submissions: async (exercise: IExercise) =>
      SubmissionModel.find({ exercise: exercise._id })
  }
};

export default exerciseResolver;
