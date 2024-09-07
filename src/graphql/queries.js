/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
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
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        fullName
        email
        profilePicture
        preferredTimezone
        unitOfMeasurement
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      title
      date
      startTime
      endTime
      location
      latitude
      longitude
      placeId
      type
      cost
      notes
      voiceNotes {
        nextToken
        __typename
      }
      checklist {
        nextToken
        __typename
      }
      attachments {
        nextToken
        __typename
      }
      status
      user {
        id
        fullName
        email
        profilePicture
        preferredTimezone
        unitOfMeasurement
        createdAt
        updatedAt
        owner
        __typename
      }
      userId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listTasks = /* GraphQL */ `
  query ListTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        date
        startTime
        endTime
        location
        latitude
        longitude
        placeId
        type
        cost
        notes
        status
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const tasksByUserIdAndId = /* GraphQL */ `
  query TasksByUserIdAndId(
    $userId: ID!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByUserIdAndId(
      userId: $userId
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        date
        startTime
        endTime
        location
        latitude
        longitude
        placeId
        type
        cost
        notes
        status
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getVoiceNote = /* GraphQL */ `
  query GetVoiceNote($id: ID!) {
    getVoiceNote(id: $id) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        latitude
        longitude
        placeId
        type
        cost
        notes
        status
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      taskId
      fileUrl
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listVoiceNotes = /* GraphQL */ `
  query ListVoiceNotes(
    $filter: ModelVoiceNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVoiceNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        taskId
        fileUrl
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const voiceNotesByTaskIdAndId = /* GraphQL */ `
  query VoiceNotesByTaskIdAndId(
    $taskId: ID!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelVoiceNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    voiceNotesByTaskIdAndId(
      taskId: $taskId
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        taskId
        fileUrl
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getChecklistItem = /* GraphQL */ `
  query GetChecklistItem($id: ID!) {
    getChecklistItem(id: $id) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        latitude
        longitude
        placeId
        type
        cost
        notes
        status
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      taskId
      description
      isCompleted
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listChecklistItems = /* GraphQL */ `
  query ListChecklistItems(
    $filter: ModelChecklistItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChecklistItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        taskId
        description
        isCompleted
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const checklistItemsByTaskIdAndId = /* GraphQL */ `
  query ChecklistItemsByTaskIdAndId(
    $taskId: ID!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelChecklistItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    checklistItemsByTaskIdAndId(
      taskId: $taskId
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        taskId
        description
        isCompleted
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAttachment = /* GraphQL */ `
  query GetAttachment($id: ID!) {
    getAttachment(id: $id) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        latitude
        longitude
        placeId
        type
        cost
        notes
        status
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      taskId
      filePath
      fileType
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listAttachments = /* GraphQL */ `
  query ListAttachments(
    $filter: ModelAttachmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttachments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        taskId
        filePath
        fileType
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const attachmentsByTaskIdAndId = /* GraphQL */ `
  query AttachmentsByTaskIdAndId(
    $taskId: ID!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAttachmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    attachmentsByTaskIdAndId(
      taskId: $taskId
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        taskId
        filePath
        fileType
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
