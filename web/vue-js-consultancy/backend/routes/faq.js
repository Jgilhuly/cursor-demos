import express from 'express';

const router = express.Router();

// Mock data for FAQs
const faqs = [
  {
    id: 1,
    question: 'What services does NeuraLink AI provide?',
    answer:
      'We offer AI strategy consulting, custom machine learning development, process automation, computer vision, NLP, and predictive analytics.'
  },
  {
    id: 2,
    question: 'How do we get started with an AI project?',
    answer:
      'Start with a discovery call where we understand your goals and constraints. We then propose a roadmap and a pilot to validate value quickly.'
  },
  {
    id: 3,
    question: 'How long do typical engagements take?',
    answer:
      'Strategy engagements usually take 2–4 weeks. Pilot builds are typically 4–8 weeks. Production rollouts vary based on scope.'
  },
  {
    id: 4,
    question: 'Do you work with on‑premise and cloud environments?',
    answer:
      'Yes. We deploy across major clouds (AWS, GCP, Azure) and hybrid/on‑prem setups while following your security requirements.'
  },
  {
    id: 5,
    question: 'How do you ensure data privacy and security?',
    answer:
      'We follow least‑privilege access, encryption in transit and at rest, and comply with your organization’s security and governance standards.'
  }
];

// GET /api/faq - Get all FAQs
router.get('/', (req, res) => {
  res.json(faqs);
});

// GET /api/faq/:id - Get specific FAQ
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const faq = faqs.find(f => f.id === id);

  if (!faq) {
    return res.status(404).json({
      error: 'FAQ not found',
      message: `FAQ with ID ${id} does not exist`
    });
  }

  res.json(faq);
});

export default router;


