<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="nav">
      <div class="container">
        <div class="nav-content">
          <div class="nav-brand">NeuraLink AI</div>
          <div class="nav-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#team">Team</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
      <div class="container">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Business with 
            <span class="text-primary">AI Solutions</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 mx-auto">
            We help enterprises unlock the power of artificial intelligence through strategic consulting, 
            custom AI development, and intelligent automation solutions.
          </p>
          <div class="hero-buttons">
            <button class="btn btn-primary" @click="openContactModal">Get Started</button>
            <button class="btn btn-secondary">Learn More</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 bg-white">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Our AI Services</h2>
          <p class="text-xl text-gray-600">Comprehensive AI solutions tailored to your business needs</p>
        </div>
        
        <div class="grid grid-3">
          <div 
            v-for="service in services" 
            :key="service.id"
            class="card hover-shadow"
          >
            <div class="text-4xl mb-4">{{ service.icon }}</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ service.title }}</h3>
            <p class="text-gray-600">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section id="team" class="py-20 bg-gray-50">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p class="text-xl text-gray-600">AI experts with deep industry experience</p>
        </div>
        
        <div class="grid grid-3">
          <div 
            v-for="member in team" 
            :key="member.id"
            class="card-white hover-shadow"
          >
            <div class="team-avatar">
              <span>{{ member.initials }}</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 text-center mb-2">{{ member.name }}</h3>
            <p class="text-primary text-center mb-3">{{ member.role }}</p>
            <p class="text-gray-600 text-center text-sm">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="py-20 bg-white">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p class="text-xl text-gray-600">Answers to common questions about our services and approach</p>
        </div>

        <div class="faq-list">
          <div
            v-for="item in faqs"
            :key="item.id"
            class="faq-item card"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.question }}</h3>
            <p class="text-gray-600">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-white">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p class="text-xl text-gray-600">Ready to transform your business with AI?</p>
        </div>
        
        <div class="grid grid-3">
          <div class="contact-item">
            <div class="contact-icon">📧</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <p class="text-gray-600">{{ contactInfo.email }}</p>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
            <p class="text-gray-600">{{ contactInfo.phone }}</p>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Location</h3>
            <p class="text-gray-600">{{ contactInfo.location }}</p>
          </div>
        </div>
        
        <div class="text-center mt-12">
          <button class="btn btn-primary" @click="openContactModal">Contact Us</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container text-center">
        <div class="text-2xl font-bold mb-4">NeuraLink AI</div>
        <p class="text-gray-400">© 2024 NeuraLink AI. All rights reserved.</p>
      </div>
    </footer>

    <!-- Contact Modal -->
    <div v-if="showContactModal" class="modal-overlay" @click="closeContactModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-2xl font-bold text-gray-900">Contact Us</h3>
          <button class="modal-close" @click="closeContactModal">&times;</button>
        </div>
        
        <form @submit.prevent="submitContactForm" class="contact-form">
          <div class="form-group">
            <label for="name">Full Name *</label>
            <input 
              type="text" 
              id="name" 
              v-model="contactForm.name" 
              required 
              placeholder="Enter your full name"
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email Address *</label>
            <input 
              type="email" 
              id="email" 
              v-model="contactForm.email" 
              required 
              placeholder="Enter your email address"
            />
          </div>
          
          <div class="form-group">
            <label for="company">Company</label>
            <input 
              type="text" 
              id="company" 
              v-model="contactForm.company" 
              placeholder="Enter your company name"
            />
          </div>
          
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="contactForm.phone" 
              placeholder="Enter your phone number"
            />
          </div>
          
          <div class="form-group">
            <label for="service">Service Interest</label>
            <select id="service" v-model="contactForm.service">
              <option value="">Select a service</option>
              <option value="ai-strategy">AI Strategy Consulting</option>
              <option value="ml-development">Machine Learning Development</option>
              <option value="automation">Process Automation</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="message">Message *</label>
            <textarea 
              id="message" 
              v-model="contactForm.message" 
              required 
              rows="4"
              placeholder="Tell us about your project or how we can help"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeContactModal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'App',
  setup() {
    const services = ref([])
    const team = ref([])
    const faqs = ref([])
    const contactInfo = ref({})
    const showContactModal = ref(false)
    const isSubmitting = ref(false)
    const contactForm = ref({
      name: '',
      email: '',
      company: '',
      phone: '',
      service: '',
      message: ''
    })

    const openContactModal = () => {
      showContactModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const closeContactModal = () => {
      showContactModal.value = false
      document.body.style.overflow = 'auto'
      // Reset form
      contactForm.value = {
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        message: ''
      }
    }

    const submitContactForm = async () => {
      isSubmitting.value = true
      try {
        // Send the form data to the backend
        const response = await axios.post('/api/contact/consultation', {
          name: contactForm.value.name,
          email: contactForm.value.email,
          company: contactForm.value.company,
          message: contactForm.value.message,
          serviceInterest: contactForm.value.service || 'General inquiry'
        })
        
        // Show success message
        alert('Thank you for your message! We\'ll get back to you within 24 hours.')
        
        closeContactModal()
      } catch (error) {
        console.error('Error submitting form:', error)
        if (error.response?.data?.message) {
          alert(`Error: ${error.response.data.message}`)
        } else {
          alert('There was an error sending your message. Please try again.')
        }
      } finally {
        isSubmitting.value = false
      }
    }

    const fetchData = async () => {
      try {
        const [servicesRes, teamRes, contactRes, faqRes] = await Promise.all([
          axios.get('/api/services'),
          axios.get('/api/team'),
          axios.get('/api/contact'),
          axios.get('/api/faq')
        ])
        
        services.value = servicesRes.data
        team.value = teamRes.data
        contactInfo.value = contactRes.data
        faqs.value = faqRes.data
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback data in case API is not available
        services.value = [
          {
            id: 1,
            title: "AI Strategy Consulting",
            description: "Strategic roadmaps for AI adoption and digital transformation",
            icon: "🎯"
          },
          {
            id: 2,
            title: "Machine Learning Development",
            description: "Custom ML models and algorithms for your specific use cases",
            icon: "🤖"
          },
          {
            id: 3,
            title: "Process Automation",
            description: "Intelligent automation solutions to optimize your workflows",
            icon: "⚡"
          }
        ]
        
        team.value = [
          {
            id: 1,
            name: "Dr. Sarah Chen",
            role: "Chief AI Officer",
            bio: "PhD in Machine Learning, 10+ years in enterprise AI solutions",
            initials: "SC"
          },
          {
            id: 2,
            name: "Michael Rodriguez",
            role: "Lead Data Scientist",
            bio: "Expert in deep learning and computer vision applications",
            initials: "MR"
          },
          {
            id: 3,
            name: "Emily Johnson",
            role: "AI Solutions Architect",
            bio: "Specializes in scalable AI infrastructure and deployment",
            initials: "EJ"
          }
        ]
        
        contactInfo.value = {
          email: "contact@neuralink-ai.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA"
        }

        faqs.value = [
          { id: 1, question: 'What services does NeuraLink AI provide?', answer: 'AI strategy, ML development, automation, computer vision, NLP, and analytics.' },
          { id: 2, question: 'How do we get started with an AI project?', answer: 'Begin with a discovery call and a roadmap; we often start with a short pilot.' }
        ]
      }
    }

    onMounted(fetchData)

    return {
      services,
      team,
      faqs,
      contactInfo,
      showContactModal,
      isSubmitting,
      contactForm,
      openContactModal,
      closeContactModal,
      submitContactForm
    }
  }
}
</script>
