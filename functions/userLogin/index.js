const { sendResponse, sendError } = require('../../responses/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../../services/db');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  if (!username || !password) {
    return sendError(400, 'Username and Password are required');
  }

  try {
    const scanParams = {
      TableName: 'quiz',
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username,
      },
    };

    const scanCommand = new ScanCommand(scanParams);
    const result = await db.send(scanCommand);

    if (!result.Items.length) {
      return sendError(401, 'No such user');
    }

    const user = result.Items[0];
    const hashedPassword = user.password;

    const checkPassword = bcrypt.compare(password, hashedPassword);

    if (!checkPassword) {
      return sendError('Invalid password');
    }

    const userId = user.id;

    const token = jwt.sign({ id: userId, username: username }, 'a1b1c1', {
      expiresIn: '1h',
    });

    return sendResponse({ token });
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};
