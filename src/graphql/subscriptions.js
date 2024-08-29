/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask(
    $filter: ModelSubscriptionTaskFilterInput
    $owner: String
  ) {
    onCreateTask(filter: $filter, owner: $owner) {
      id
      title
      date
      startTime
      endTime
      location
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
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask(
    $filter: ModelSubscriptionTaskFilterInput
    $owner: String
  ) {
    onUpdateTask(filter: $filter, owner: $owner) {
      id
      title
      date
      startTime
      endTime
      location
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
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask(
    $filter: ModelSubscriptionTaskFilterInput
    $owner: String
  ) {
    onDeleteTask(filter: $filter, owner: $owner) {
      id
      title
      date
      startTime
      endTime
      location
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
export const onCreateVoiceNote = /* GraphQL */ `
  subscription OnCreateVoiceNote(
    $filter: ModelSubscriptionVoiceNoteFilterInput
    $owner: String
  ) {
    onCreateVoiceNote(filter: $filter, owner: $owner) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        type
        cost
        notes
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
export const onUpdateVoiceNote = /* GraphQL */ `
  subscription OnUpdateVoiceNote(
    $filter: ModelSubscriptionVoiceNoteFilterInput
    $owner: String
  ) {
    onUpdateVoiceNote(filter: $filter, owner: $owner) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        type
        cost
        notes
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
export const onDeleteVoiceNote = /* GraphQL */ `
  subscription OnDeleteVoiceNote(
    $filter: ModelSubscriptionVoiceNoteFilterInput
    $owner: String
  ) {
    onDeleteVoiceNote(filter: $filter, owner: $owner) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        type
        cost
        notes
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
export const onCreateChecklistItem = /* GraphQL */ `
  subscription OnCreateChecklistItem(
    $filter: ModelSubscriptionChecklistItemFilterInput
    $owner: String
  ) {
    onCreateChecklistItem(filter: $filter, owner: $owner) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        type
        cost
        notes
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
export const onUpdateChecklistItem = /* GraphQL */ `
  subscription OnUpdateChecklistItem(
    $filter: ModelSubscriptionChecklistItemFilterInput
    $owner: String
  ) {
    onUpdateChecklistItem(filter: $filter, owner: $owner) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        type
        cost
        notes
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
export const onDeleteChecklistItem = /* GraphQL */ `
  subscription OnDeleteChecklistItem(
    $filter: ModelSubscriptionChecklistItemFilterInput
    $owner: String
  ) {
    onDeleteChecklistItem(filter: $filter, owner: $owner) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        type
        cost
        notes
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
export const onCreateAttachment = /* GraphQL */ `
  subscription OnCreateAttachment(
    $filter: ModelSubscriptionAttachmentFilterInput
    $owner: String
  ) {
    onCreateAttachment(filter: $filter, owner: $owner) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        type
        cost
        notes
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      taskId
      fileUrl
      fileType
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateAttachment = /* GraphQL */ `
  subscription OnUpdateAttachment(
    $filter: ModelSubscriptionAttachmentFilterInput
    $owner: String
  ) {
    onUpdateAttachment(filter: $filter, owner: $owner) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        type
        cost
        notes
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      taskId
      fileUrl
      fileType
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteAttachment = /* GraphQL */ `
  subscription OnDeleteAttachment(
    $filter: ModelSubscriptionAttachmentFilterInput
    $owner: String
  ) {
    onDeleteAttachment(filter: $filter, owner: $owner) {
      id
      task {
        id
        title
        date
        startTime
        endTime
        location
        type
        cost
        notes
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      taskId
      fileUrl
      fileType
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
