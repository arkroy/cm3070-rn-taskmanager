import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      fullName
      email
      profilePicture
      preferredTimezone
      unitOfMeasurement
      tasks {
        nextToken
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      fullName
      email
      profilePicture
      preferredTimezone
      unitOfMeasurement
    }
  }
`;

export const LIST_TASKS = gql`
  query ListTasks($filter: ModelTaskFilterInput, $limit: Int, $nextToken: String) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        startTime
        endTime
        location
        latitude
        longitude
        cost
        notes 
        attachments {
          items {
            id
            filePath
            fileType
          }
        }
        voiceNotes {
          items {
            id
            fileUrl
          }
        }
        status
        type
        userId
      }
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      title
      date
      startTime
      endTime
      location
      latitude
      longitude
      type
      notes
      status
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      date
      startTime
      endTime
      location
      latitude
      longitude
      type
      notes
      status
    }
  }
`;

export const CREATE_VOICE_NOTE = gql`
  mutation CreateTask($input: CreateVoiceNoteInput!) {
    createVoiceNote(input: $input) {
    id
    fileUrl
    task {
       id
       title
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      title
      date
      startTime
      endTime
      location
      latitude
      longitude
      type
      notes
      status
    }
  }
`;

export const CREATE_ATTACHMENT = gql`
  mutation CreateAttachment($input: CreateAttachmentInput!) {
    createAttachment(input: $input) {
      id
      filePath
      fileType
    }
  }
`;