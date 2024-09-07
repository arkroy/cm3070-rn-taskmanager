/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
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
      actualDuration
      plannedDuration
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
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
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
      actualDuration
      plannedDuration
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
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
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
      actualDuration
      plannedDuration
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
export const createVoiceNote = /* GraphQL */ `
  mutation CreateVoiceNote(
    $input: CreateVoiceNoteInput!
    $condition: ModelVoiceNoteConditionInput
  ) {
    createVoiceNote(input: $input, condition: $condition) {
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
        actualDuration
        plannedDuration
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
export const updateVoiceNote = /* GraphQL */ `
  mutation UpdateVoiceNote(
    $input: UpdateVoiceNoteInput!
    $condition: ModelVoiceNoteConditionInput
  ) {
    updateVoiceNote(input: $input, condition: $condition) {
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
        actualDuration
        plannedDuration
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
export const deleteVoiceNote = /* GraphQL */ `
  mutation DeleteVoiceNote(
    $input: DeleteVoiceNoteInput!
    $condition: ModelVoiceNoteConditionInput
  ) {
    deleteVoiceNote(input: $input, condition: $condition) {
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
        actualDuration
        plannedDuration
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
export const createChecklistItem = /* GraphQL */ `
  mutation CreateChecklistItem(
    $input: CreateChecklistItemInput!
    $condition: ModelChecklistItemConditionInput
  ) {
    createChecklistItem(input: $input, condition: $condition) {
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
        actualDuration
        plannedDuration
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
export const updateChecklistItem = /* GraphQL */ `
  mutation UpdateChecklistItem(
    $input: UpdateChecklistItemInput!
    $condition: ModelChecklistItemConditionInput
  ) {
    updateChecklistItem(input: $input, condition: $condition) {
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
        actualDuration
        plannedDuration
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
export const deleteChecklistItem = /* GraphQL */ `
  mutation DeleteChecklistItem(
    $input: DeleteChecklistItemInput!
    $condition: ModelChecklistItemConditionInput
  ) {
    deleteChecklistItem(input: $input, condition: $condition) {
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
        actualDuration
        plannedDuration
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
export const createAttachment = /* GraphQL */ `
  mutation CreateAttachment(
    $input: CreateAttachmentInput!
    $condition: ModelAttachmentConditionInput
  ) {
    createAttachment(input: $input, condition: $condition) {
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
        actualDuration
        plannedDuration
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
export const updateAttachment = /* GraphQL */ `
  mutation UpdateAttachment(
    $input: UpdateAttachmentInput!
    $condition: ModelAttachmentConditionInput
  ) {
    updateAttachment(input: $input, condition: $condition) {
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
        actualDuration
        plannedDuration
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
export const deleteAttachment = /* GraphQL */ `
  mutation DeleteAttachment(
    $input: DeleteAttachmentInput!
    $condition: ModelAttachmentConditionInput
  ) {
    deleteAttachment(input: $input, condition: $condition) {
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
        actualDuration
        plannedDuration
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
