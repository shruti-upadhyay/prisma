const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

// Create a new user
app.post('/user', async (req, res) => {
  try {
    const { name, email, role, password, gender, age } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email ID already exists.' });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
        userPass: {
          create: { password },
        },
        userDetail: {
          create: { gender, age },
        },
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by email
app.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userPass: true,
        userDetail: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get('/user', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        userPass: true,
        userDetail: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by email
app.put('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { name, role, password, gender, age } = req.body;

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        role,
        userPass: {
          update: { password },
        },
        userDetail: {
          update: { gender, age },
        },
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by email
app.delete('/user/:email', async (req, res) => {
    try {
      const { email } = req.params;
  
      await prisma.userPass.deleteMany({
        where: { email },
      });
      await prisma.userDetail.deleteMany({
        where: { email },
      });
  
      await prisma.user.delete({
        where: { email },
      });
  
      res.status(200).json({message: `User with email ${email} deleted successfully.`});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Get users by partial name match
// Search users by partial match in any field (name, email, gender, etc.)
// Search users by partial match in any field (name, email, gender, etc.) via URL parameter
app.get('/search/:query', async (req, res) => {
    try {
      const { query } = req.params; // Extract search query from the URL parameter
  
      const users = await prisma.user.findMany({
        where: {
          OR: [  // Use OR to match any of these fields
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          userPass: true,
          userDetail: true,
        },
      });
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found matching your search' });
      }
  
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
      

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
