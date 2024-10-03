const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');
const { db } = require('../../services/db');
const { DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { sendResponse, sendError } = require('../../responses/index');

const deleteQuizHandler = async (event) => {
  const id = event.pathParameters?.id;
  const userId = event.id;

  if (!id) {
    return sendError(400, 'Missing quiz ID');
  }

  try {
    const getParams = {
      TableName: 'quiz',
      Key: { id: id },
    };

    const getCommand = new GetCommand(getParams);
    const result = await db.send(getCommand);

    if (!result.Item) {
      return sendError(400, 'Quiz not found');
    }

    if (result.Item.creator !== userId) {
      return sendError(400, 'You do not have permission to delete this quiz');
    }

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
