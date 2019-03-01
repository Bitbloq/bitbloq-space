import { ApolloError, PubSub } from 'apollo-server-koa';
import { DocumentModel } from '../models/document';
import { FolderModel } from '../models/folder';
import documentResolver from './document';
import { UserModel } from '../models/user';

const folderResolver = {
  Mutation: {
    /**
     * Create folder: create a new empty folder.
     * args: folder information
     */
    createFolder: async (root: any, args: any, context: any) => {
      const user = await UserModel.findOne({_id: context.user.userID});
      const folderNew = new FolderModel({
        name: args.input.name,
        user: context.user.userID,
        parent: args.input.parent || user.rootFolder,
      });
      const newFolder = await FolderModel.create(folderNew);
      await FolderModel.findOneAndUpdate(
        { _id: folderNew.parent },
        { $push: {foldersID: newFolder._id} },
        { new: true },
      )
      return newFolder;
    },

    /**
     * Delete folder: delete one folder of the user logged.
     * It deletes the folder passed in the arguments if it belongs to the user logged.
     * The method deletes all the documents inside de document
     * args: folder ID
     */
    deleteFolder: async (root: any, args: any, context: any) => {
      const existFolder = await FolderModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if(!existFolder){
        throw new ApolloError('Folder does not exist', 'FOLDER_NOT_FOUND')
      }
      if(existFolder.name =='root'){
        throw new ApolloError('You can not delete your Root folder', 'CANT_DELETE_ROOT')
      }
      if (existFolder) {
        if(existFolder.documentsID.length >0){
            for(let document of existFolder.documentsID){
                await documentResolver.Mutation.deleteDocument('',{id: document}, context);
                await FolderModel.updateOne(
                  { _id: existFolder.parent },
                  { $pull: {documentsID: document} },
                  { new: true },
                )
            }
        }
        if(existFolder.foldersID.length >0){
          for(let folder of existFolder.foldersID){
              await folderResolver.Mutation.deleteFolder('', {id: folder}, context);
          }
        }
        await FolderModel.updateOne(
          { _id: existFolder.parent },
          { $pull: {foldersID: existFolder._id} },
          { new: true },
        )
        return await FolderModel.deleteOne({ _id: args.id });
      } else {
        return new ApolloError('Folder does not exist', 'FOLDER_NOT_FOUND');
      }
    },

    /**
     * Update folder: update existing folder.
     * It updates the folder with the new information provided.
     * args: folder ID, new folder information.
     */
    updateFolder: async (root: any, args: any, context: any) => {
      const existFolder = await FolderModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if(!existFolder){
        throw new ApolloError('Folder does not exist', 'FOLDER_NOT_FOUND')
      }
      // if(existFolder.name =='root'){
      //   throw new ApolloError('You can not update your Root folder', 'CANT_UPDATE_ROOT')
      // }
      if (existFolder) {
        if(args.input.foldersID){ //si se pasa lista de carpetas hay que modificarlas para añadirlas el parent
          for(let folder of args.input.foldersID){
            await FolderModel.updateOne(
              {_id: folder},
              { parent: existFolder._id}
            );
            await FolderModel.updateOne(
              { _id: existFolder.parent },
              { $pull: {foldersID: folder} }, //borro el hijo de la carpeta padre
              { new: true },
            )
            await FolderModel.updateOne(
              { _id: existFolder._id },
              { $push: {foldersID: folder} }, //añado el nuevo folder a los hijos de la carpeta
              { new: true },
            )
          }
        }
        if(args.input.documentsID){ //si se pasa lista de documentos hay que modificarlos para añadir la carpeta
          for(let document of args.input.documentsID){
            await DocumentModel.updateOne(
              {_id: document},
              { folder: existFolder._id}
            );
            await FolderModel.updateOne(
              { _id: existFolder.parent },
              { $pull: {documentsID: document} },
              { new: true },
            )
            await FolderModel.updateOne(
              { _id: existFolder._id },
              { $push: {documentsID: document} }, //añado el nuevo document a los hijos de la carpeta
              { new: true },
            )
          }
        }
        if(args.input.parent){ //si se pasa un nuevo parent hay que modificarlo para que tenga al hijo en la lista
          await FolderModel.updateOne(
            {_id: args.input.parent},
            { $push: {foldersID: existFolder._id}}
          );
          await FolderModel.updateOne(
            {_id: existFolder.parent},
            { $pull: {foldersID: existFolder._id}}
          );
        }
        
        if(existFolder.name=='root' && args.input.name){
          throw new ApolloError('You can not update your Root folder names', 'CANT_UPDATE_ROOT')
        }
        return FolderModel.findOneAndUpdate(
          { _id: existFolder._id },
          { $set: {
            name: args.input.name || existFolder.name,
            parent: args.input.parent || existFolder.parent,
          } },
          { new: true },
        );
      } else {
        return new ApolloError('Folder does not exist', 'FOLDER_NOT_FOUND');
      }
    },
  },

  Query: {
    /**
     * Folders: returns all the folders of the user logged.
     * args: nothing.
     */
    folders: async (root: any, args: any, context: any) => {
      return FolderModel.find({ user: context.user.userID });
    },

    /**
     * Folder: returns the information of the folder ID provided in the arguments.
     * args: folder ID.
     */
    folder: async (root: any, args: any, context: any) => {
        const existFolder = await FolderModel.findOne({
          _id: args.id,
          user: context.user.userID,
        });
        if (!existFolder) {
          throw new ApolloError(
            'Folder does not exist',
            'FOLDER_NOT_FOUND',
          );
        }
        return existFolder;
    },

    /**
     * Root: returns the root folder of the user logged.
     * args: nothing.
     */
    rootFolder: async (root: any, args: any, context: any) => {
      return await FolderModel.findOne({
        name: 'root',
        user: context.user.userID,
      });
    },
  },

  Folder: {
    documents: async folder =>
      DocumentModel.find({ folder: folder }),
    folders: async folder =>
      FolderModel.find({parent: folder}),
  },
};

export default folderResolver;
