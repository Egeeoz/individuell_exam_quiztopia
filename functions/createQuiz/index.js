const { sendResponse, sendError } = require('../../responses/index');
const { v4: uuidv4 } = require('uuid');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { db } = require('../../services/db');
const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');

const createQuizHandler = async (event) => {
  const { title, questions } = JSON.parse(event.body);

  if (!title || !questions?.length) {
    return sendError(400, 'Missing context, title, questions array');
  }

  try {
    const quizId = uuidv4();

    if (!event.id || !event.username) {
      return sendError(404, 'Missing user token');
    }

    const quiz = {
      id: quizId,
      userId: event.id,
      creator: event.username,
      title: title,
      questions: questions,
    };

    const putParams = {
      TableName: 'quiz',
      Item: quiz,
    };

    const putCommand = new PutCommand(putParams);
    await db.send(putCommand);

    return sendResponse(quiz);
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};

exports.handler = middy(createQuizHandler).use(validateToken);
