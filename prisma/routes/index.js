import { Router } from 'express';  // Import Router once

const router = Router();  // Initialize router instance

// Define routes here
router.get('/', (req, res) => {
  res.send('Hello World');
});

export default router;  // Export the router
