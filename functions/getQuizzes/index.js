const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { db } = require('../../services/db');
const { sendResponse, sendError } = require('../../responses/index');
const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');

const getQuizzesHandler = async () => {
  try {
    const scanParams = {
      TableName: 'quiz',
    };

    const scanCommand = new ScanCommand(scanParams);
    const result = await db.send(scanCommand);

    console.log('Raw items from DynamoDB:', result.Items);

    const quizzes = result.Items.filter(
      (item) => item.title && item.creator
    ).map((item) => ({
      id: item.id,
      title: item.title,
      creator: item.creator,
    }));

    return sendResponse(quizzes);
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};

exports.handler = middy(getQuizzesHandler).use(validateToken);
