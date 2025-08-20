import express from 'express';

const router = express.Router();

// Mock data for team members
const team = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Chief AI Officer & Founder",
    bio: "PhD in Machine Learning from Stanford. 10+ years leading enterprise AI transformations at Fortune 500 companies.",
    initials: "SC",
    expertise: ["Machine Learning", "AI Strategy", "Deep Learning"],
    education: "PhD Computer Science, Stanford University",
    experience: "Former AI Director at Google, Meta",
    linkedin: "https://linkedin.com/in/sarahchen-ai"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Lead Data Scientist",
    bio: "Expert in deep learning and computer vision with a track record of deploying ML models at scale.",
    initials: "MR",
    expertise: ["Computer Vision", "Deep Learning", "MLOps"],
    education: "MS Data Science, MIT",
    experience: "8 years at Tesla, Amazon",
    linkedin: "https://linkedin.com/in/mrodriguez-ml"
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "AI Solutions Architect",
    bio: "Specializes in designing scalable AI infrastructure and cloud-native ML deployment strategies.",
    initials: "EJ",
    expertise: ["Cloud Architecture", "MLOps", "System Design"],
    education: "MS Computer Engineering, Berkeley",
    experience: "6 years at AWS, Microsoft",
    linkedin: "https://linkedin.com/in/emilyjohnson-ai"
  },
  {
    id: 4,
    name: "Dr. James Kim",
    role: "Research Director",
    bio: "Leading researcher in reinforcement learning and autonomous systems with 50+ published papers.",
    initials: "JK",
    expertise: ["Reinforcement Learning", "Robotics", "Research"],
    education: "PhD Robotics, Carnegie Mellon",
    experience: "Former Principal Scientist at OpenAI",
    linkedin: "https://linkedin.com/in/jameskim-research"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "NLP Engineering Lead",
    bio: "Expert in natural language processing and conversational AI with focus on enterprise applications.",
    initials: "LW",
    expertise: ["NLP", "Conversational AI", "Language Models"],
    education: "MS Linguistics, Harvard",
    experience: "5 years at Facebook AI Research",
    linkedin: "https://linkedin.com/in/lisawang-nlp"
  },
  {
    id: 6,
    name: "Alex Thompson",
    role: "AI Product Manager",
    bio: "Bridges the gap between AI research and business value, ensuring successful AI product adoption.",
    initials: "AT",
    expertise: ["Product Strategy", "AI Ethics", "Business Development"],
    education: "MBA Stanford, BS Computer Science",
    experience: "Product Manager at Uber, Airbnb",
    linkedin: "https://linkedin.com/in/alexthompson-ai"
  }
];

// GET /api/team - Get all team members
router.get('/', (req, res) => {
  res.json(team);
});

// GET /api/team/:id - Get specific team member
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const member = team.find(m => m.id === id);
  
  if (!member) {
    return res.status(404).json({ 
      error: 'Team member not found',
      message: `Team member with ID ${id} does not exist`
    });
  }
  
  res.json(member);
});

// GET /api/team/expertise/:skill - Get team members by expertise
router.get('/expertise/:skill', (req, res) => {
  const skill = req.params.skill.toLowerCase();
  const members = team.filter(m => 
    m.expertise.some(exp => exp.toLowerCase().includes(skill))
  );
  
  if (members.length === 0) {
    return res.status(404).json({ 
      error: 'No team members found',
      message: `No team members found with expertise in "${skill}"`
    });
  }
  
  res.json(members);
});

export default router;
