const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');
const { db } = require('../../services/db');
const { UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { sendResponse, sendError } = require('../../responses/index');

const updateQuizHandler = async (event) => {
  const { quizId, title, questions } = JSON.parse(event.body);

  if (!quizId || !title || !questions?.length) {
    return sendError(400, 'Missing quizId, title, or questions array');
  }

  try {
    const getParams = {
      TableName: 'quiz',
      Key: { id: quizId },
    };
    const { Item: existingQuiz } = await db.send(new GetCommand(getParams));

    if (!existingQuiz) {
      return sendError(404, 'Quiz not found');
    }

    if (existingQuiz.userId !== event.id) {
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
    const { Attributes: updatedQuiz } = await db.send(updateCommand);

    return sendResponse(updatedQuiz);
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};

exports.handler = middy(updateQuizHandler).use(validateToken);
