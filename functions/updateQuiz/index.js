const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');
const { db } = require('../../services/db');
const { UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { sendResponse, sendError } = require('../../responses/index');

const updateQuizHandler = async (event) => {
  const { quizId, title, questions } = JSON.parse(event.body);
  const username = event.username;

  if (!quizId || !title || !questions?.length) {
    return sendError(400, 'Missing quizId, title, or questions array');
  }

  try {
    const getParams = {
      TableName: 'quiz',
      Key: { id: quizId },
    };

    const getCommand = new GetCommand(getParams);
    const result = await db.send(getCommand);

    if (!result.Item) {
      return sendError(404, 'Quiz not found');
    }

    if (result.Item.creator !== username) {
      return sendError(403, 'You do not have permission to update this quiz');
    }

    const updateParams = {
      TableName: 'quiz',
      Key: { id: quizId },
      UpdateExpression: 'set title = :title, questions = :questions',
      ExpressionAttributeValues: {
        ':title': title,
        ':questions': questions,
      },
      ReturnValues: 'ALL_NEW',
    };

    const updateCommand = new UpdateCommand(updateParams);
    const updateResult = await db.send(updateCommand);

    const updatedQuiz = updateResult.Attributes;

    return sendResponse(updatedQuiz);
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};

exports.handler = middy(updateQuizHandler).use(validateToken);
