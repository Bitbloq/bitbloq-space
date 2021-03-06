import gql from "graphql-tag";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      admin
    }
  }
`;

export const DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document(id: $id) {
      id
      type
      title
      description
      content
      image
      public
    }
  }
`;

export const OPEN_PUBLIC_DOCUMENT_QUERY = gql`
  query OpenPublicDocument($id: ObjectID!) {
    openPublicDocument(id: $id) {
      id
      type
      title
      description
      content
      image
      public
    }
  }
`;

export const DOCUMENTS_QUERY = gql`
  query {
    documents {
      id
      type
      title
      createdAt
      image
    }
  }
`;

export const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument(
    $type: String!
    $title: String!
    $description: String
    $content: String
    $image: String
  ) {
    createDocument(
      input: {
        type: $type
        title: $title
        description: $description
        content: $content
        imageUrl: $image
      }
    ) {
      id
      type
    }
  }
`;

export const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocument(
    $id: ObjectID!
    $title: String!
    $content: String
    $description: String
    $image: Upload
  ) {
    updateDocument(
      id: $id
      input: {
        title: $title
        content: $content
        description: $description
        image: $image
      }
    ) {
      id
      type
      content
      image
    }
  }
`;

export const DELETE_DOCUMENT_MUTATION = gql`
  mutation DeleteDocument($id: ObjectID!) {
    deleteDocument(id: $id) {
      id
    }
  }
`;

export const DOCUMENT_UPDATED_SUBSCRIPTION = gql`
  subscription OnDocumentUpdated {
    documentUpdated {
      id
    }
  }
`;

export const EXERCISE_QUERY = gql`
  query Exercise($id: ObjectID!) {
    exercise(id: $id) {
      id
      type
      title
      content
      description
      image
    }
  }
`;

export const STUDENT_SUBMISSION_QUERY = gql`
  query Submission($exerciseId: ObjectID!) {
    exercise(id: $exerciseId) {
      type
      title
      description
      image
    }
    submission {
      content
    }
  }
`;

export const UPDATE_SUBMISSION_MUTATION = gql`
  mutation UpdateSubmission($content: String!) {
    updateSubmission(input: { content: $content }) {
      id
    }
  }
`;

export const FINISH_SUBMISSION_MUTATION = gql`
  mutation FinishSubmission($content: String!) {
    finishSubmission(content: $content) {
      id
    }
  }
`;

export const UPLOAD_STL_MUTATION = gql`
  mutation uploadSTLFile($file: Upload!, $documentId: ObjectID) {
    uploadSTLFile(file: $file, documentID: $documentId) {
      id
      filename
      mimetype
      publicUrl
      document
    }
  }
`;

export const PUBLISH_DOCUMENT_MUTATION = gql`
  mutation publishDocument($id: ObjectID!, $public: Boolean) {
    publishDocument(id: $id, public: $public) {
      id
    }
  }
`;
