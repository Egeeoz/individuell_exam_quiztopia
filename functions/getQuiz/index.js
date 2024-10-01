const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { sendResponse, sendError } = require('../../responses');
const { db } = require('../../services/db');

exports.handler = async (event) => {
  const quizId = event.pathParameters?.id;

  if (!quizId) {
    return sendError(400, 'Missing quiz ID');
  }

  try {
    const scanParams = {
      TableName: 'quiz',
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': quizId,
      },
    };

    const scanCommand = new ScanCommand(scanParams);
    const result = await db.send(scanCommand);

    return sendResponse(result.Items);
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};
