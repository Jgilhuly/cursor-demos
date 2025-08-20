import express from 'express';

const router = express.Router();

// Mock data for AI services
const services = [
  {
    id: 1,
    title: "AI Strategy Consulting",
    description: "Strategic roadmaps for AI adoption and digital transformation tailored to your industry and business goals.",
    icon: "🎯",
    features: [
      "AI Readiness Assessment",
      "Technology Roadmapping", 
      "ROI Analysis",
      "Risk Assessment"
    ],
    price: "Starting at $15,000"
  },
  {
    id: 2,
    title: "Machine Learning Development",
    description: "Custom ML models and algorithms designed specifically for your unique use cases and data requirements.",
    icon: "🤖",
    features: [
      "Custom Model Development",
      "Data Pipeline Design",
      "Model Training & Optimization",
      "Performance Monitoring"
    ],
    price: "Starting at $25,000"
  },
  {
    id: 3,
    title: "Process Automation",
    description: "Intelligent automation solutions that streamline operations and reduce manual workload across your organization.",
    icon: "⚡",
    features: [
      "Process Analysis",
      "RPA Implementation",
      "Workflow Optimization",
      "Integration Support"
    ],
    price: "Starting at $12,000"
  },
  {
    id: 4,
    title: "Computer Vision Solutions",
    description: "Advanced image and video analysis capabilities for quality control, security, and business intelligence.",
    icon: "👁️",
    features: [
      "Object Detection",
      "Image Classification",
      "Video Analytics",
      "Real-time Processing"
    ],
    price: "Starting at $30,000"
  },
  {
    id: 5,
    title: "Natural Language Processing",
    description: "Unlock insights from text data with sentiment analysis, document processing, and conversational AI solutions.",
    icon: "💬",
    features: [
      "Sentiment Analysis",
      "Document Processing",
      "Chatbot Development",
      "Language Translation"
    ],
    price: "Starting at $20,000"
  },
  {
    id: 6,
    title: "Predictive Analytics",
    description: "Forecast trends, customer behavior, and business outcomes using advanced statistical modeling and ML techniques.",
    icon: "📈",
    features: [
      "Time Series Forecasting",
      "Customer Segmentation",
      "Demand Prediction",
      "Churn Analysis"
    ],
    price: "Starting at $18,000"
  }
];

// GET /api/services - Get all services
router.get('/', (req, res) => {
  res.json(services);
});

// GET /api/services/:id - Get specific service
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const service = services.find(s => s.id === id);
  
  if (!service) {
    return res.status(404).json({ 
      error: 'Service not found',
      message: `Service with ID ${id} does not exist`
    });
  }
  
  res.json(service);
});

export default router;
