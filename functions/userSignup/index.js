const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  if (!username || !password) {
    return sendError(400, 'Username and Password are required');
  }

  try {
    const scanParams = {
      TableName: 'quiz',
      FilterExpression: '#username = :username',
      ExpressionAttributeNames: {
        '#username': 'username',
      },
      ExpressionAttributeValues: {
        ':username': username,
      },
    };

    const scanCommand = new ScanCommand(scanParams);
    const result = await db.send(scanCommand);

    if (result.Items && result.Items.length > 0) {
      return sendError(400, 'Username already exists, pick another Username');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const putParams = {
      TableName: 'quiz',
      Item: {
        id: userId,
        username: username,
        password: hashedPassword,
      },
    };

    const putCommand = new PutCommand(putParams);
    await db.send(putCommand);

    return sendResponse('User successfully created');
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};
