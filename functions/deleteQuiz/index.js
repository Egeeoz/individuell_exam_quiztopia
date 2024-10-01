const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');
const { db } = require('../../services/db');
const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { sendResponse, sendError } = require('../../responses/index');

const deleteQuizHandler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return sendError(400, 'Missing quiz ID');
  }

  try {
    const deleteParams = {
      TableName: 'quiz',
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
    };

    const deleteCommand = new DeleteCommand(deleteParams);
    await db.send(deleteCommand);

    return sendResponse('Note Deleted');
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};

exports.handler = middy(deleteQuizHandler).use(validateToken);
