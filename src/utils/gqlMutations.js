import { gql } from '@apollo/client';

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