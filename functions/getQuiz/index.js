const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { sendResponse, sendError } = require('../../responses');
const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');
const { db } = require('../../services/db');

const getQuizHandler = async (event) => {
  const quizId = event.pathParameters?.id;

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

exports.handler = middy(getQuizHandler).use(validateToken);
