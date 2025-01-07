const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Set up Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the router for API routes
app.use(router);

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.headers['admin-id']; // Retrieve user ID from Authorization Header
    
    if (!userId) {
      return res.status(400).json({ error: 'Admin ID is required in the Authorization header' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }, // Find user by ID
    });

    if (user && user.role === 'ADMIN') {
      next(); // Allow access to the route if the user is an admin
    } else {
      res.status(403).json({ error: 'Access forbidden: Admins only' });
    }
  } catch (error) {
    console.error('Error checking admin role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST: Create a new user (Only accessible by Admins)
router.post('/users', isAdmin, async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role || 'USER', // Default to 'USER' if role not provided
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    next(error); // Pass error to the global error handler
  } finally {
    await prisma.$disconnect();
  }
});

// GET: Get all users (Only accessible by Admins)
router.get('/users', isAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error); // Pass error to the global error handler
  } finally {
    await prisma.$disconnect();
  }
});

// GET: Get a user by ID (Only accessible by Admins)
router.get('/users/:id', isAdmin, async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    next(error); // Pass error to the global error handler
  } finally {
    await prisma.$disconnect();
  }
});

// PUT: Update a user by ID (Only accessible by Admins)
router.put('/users/:id', isAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
        role,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    next(error); // Pass error to the global error handler
  } finally {
    await prisma.$disconnect();
  }
});

// DELETE: Delete a user by ID (Only accessible by Admins)
router.delete('/users/:id', isAdmin, async (req, res, next) => {
  const { id } = req.params;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    // Respond with a success message along with the deleted user info
    res.status(200).json({
      message: 'User deleted successfully',
      deletedUser: deletedUser,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error); // Pass error to the global error handler
  } finally {
    await prisma.$disconnect();
  }
});


// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Define a port (preferably from environment variables for production)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
