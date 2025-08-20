import express from 'express';

const router = express.Router();

// Contact information
const contactInfo = {
  company: "NeuraLink AI",
  email: "contact@neuralink-ai.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  address: {
    street: "123 Innovation Drive, Suite 400",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "United States"
  },
  socialMedia: {
    linkedin: "https://linkedin.com/company/neuralink-ai",
    twitter: "https://twitter.com/neuralinklai",
    github: "https://github.com/neuralink-ai"
  },
  businessHours: {
    monday: "9:00 AM - 6:00 PM PST",
    tuesday: "9:00 AM - 6:00 PM PST",
    wednesday: "9:00 AM - 6:00 PM PST",
    thursday: "9:00 AM - 6:00 PM PST",
    friday: "9:00 AM - 6:00 PM PST",
    saturday: "Closed",
    sunday: "Closed"
  },
  responseTime: "We typically respond within 24 hours"
};

// Demo consultation requests storage (in production, this would be a database)
let consultationRequests = [];

// GET /api/contact - Get contact information
router.get('/', (req, res) => {
  res.json(contactInfo);
});

// POST /api/contact/consultation - Submit consultation request
router.post('/consultation', (req, res) => {
  const { name, email, company, message, serviceInterest } = req.body;
  
  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Name, email, and message are required'
    });
  }
  
  // Email validation (basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email',
      message: 'Please provide a valid email address'
    });
  }
  
  const request = {
    id: consultationRequests.length + 1,
    name,
    email,
    company: company || 'Not specified',
    message,
    serviceInterest: serviceInterest || 'General inquiry',
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  
  consultationRequests.push(request);
  
  res.status(201).json({
    message: 'Consultation request submitted successfully',
    requestId: request.id,
    estimatedResponseTime: '24 hours'
  });
});

// GET /api/contact/consultation-requests - Get all consultation requests (demo purposes)
router.get('/consultation-requests', (req, res) => {
  res.json({
    total: consultationRequests.length,
    requests: consultationRequests
  });
});

// GET /api/contact/consultation-requests/:id - Get specific consultation request
router.get('/consultation-requests/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const request = consultationRequests.find(r => r.id === id);
  
  if (!request) {
    return res.status(404).json({
      error: 'Request not found',
      message: `Consultation request with ID ${id} does not exist`
    });
  }
  
  res.json(request);
});

export default router;
