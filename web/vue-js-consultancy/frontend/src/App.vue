<template>
  <div id="app" class="bg-white">
    <!-- Floating Navigation -->
    <div class="floating-nav">
      <div class="floating-nav-content">
        <button class="nav-item">Benefits</button>
        <button class="nav-item">Specifications</button>
        <button class="nav-item">How-to</button>
        <button class="nav-item">Contact Us</button>
      </div>
    </div>

    <!-- Main Navigation -->
    <nav class="nav">
      <div class="container">
        <div class="nav-content">
          <div class="nav-brand">Area</div>
          <a href="#contact" class="btn-primary">Learn More</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
      <div class="container">
        <h1 class="hero-title">Browse everything.</h1>
        <div class="hero-image">
          <div class="ipad-mockup">
            <div class="ipad-screen"></div>
          </div>
        </div>
      </div>
    </header>

    <!-- Logo Cloud -->
    <section class="logo-cloud">
      <div class="container">
        <p class="logo-label">Trusted by:</p>
        <div class="logo-row">
          <div class="logo-item" v-for="i in 6" :key="i">
            <div class="logo-placeholder"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
      <div class="container">
        <div class="benefits-header">
          <div class="benefits-text">
            <h2 class="section-label">Benefits</h2>
            <h3 class="section-title">We've cracked the code.</h3>
            <p class="section-description">Area provides real insights, without the data overload.</p>
          </div>
          <div class="benefits-grid">
            <div class="benefit-item" v-for="benefit in benefits" :key="benefit.id">
              <div class="benefit-icon">
                <img :src="benefit.icon" :alt="benefit.title" />
              </div>
              <h4 class="benefit-title">{{ benefit.title }}</h4>
              <p class="benefit-description">{{ benefit.description }}</p>
            </div>
          </div>
        </div>
        <div class="benefits-image"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="features-content">
          <div class="features-text">
            <h3 class="section-title">See the Big Picture</h3>
            <p class="section-description">Area turns your data into clear, vibrant visuals that show you exactly what's happening in each region.</p>
            <div class="features-list">
              <div class="feature-item" v-for="feature in features" :key="feature.id">
                <span class="feature-number">{{ feature.number }}</span>
                <p class="feature-text">{{ feature.text }}</p>
              </div>
            </div>
            <a href="#contact" class="btn-secondary">Discover More</a>
          </div>
          <div class="features-visual"></div>
        </div>
      </div>
    </section>

    <!-- Specifications Section -->
    <section class="specs-section">
      <div class="container">
        <div class="specs-content">
          <h2 class="section-label">Specs</h2>
          <h3 class="section-title">Why Choose Area?</h3>
          <p class="section-description">You need a solution that keeps up. That's why we developed Area. A developer-friendly approach to streamline your business.</p>
          <a href="#contact" class="btn-secondary">Discover More</a>
        </div>
        <div class="specs-table">
          <div class="table-column area-column">
            <div class="table-header">
              <h4>Area</h4>
            </div>
            <div class="table-row" v-for="feature in areaFeatures" :key="feature.id">
              <div class="check-icon">✓</div>
              <span>{{ feature.name }}</span>
            </div>
          </div>
          <div class="table-column websurge-column">
            <div class="table-header">
              <h4>WebSurge</h4>
            </div>
            <div class="table-row" v-for="feature in websurgeFeatures" :key="feature.id">
              <div class="check-icon" :class="{ 'cross': !feature.included }">
                {{ feature.included ? '✓' : '✗' }}
              </div>
              <span>{{ feature.name }}</span>
            </div>
          </div>
          <div class="table-column hyperview-column">
            <div class="table-header">
              <h4>HyperView</h4>
            </div>
            <div class="table-row" v-for="feature in hyperviewFeatures" :key="feature.id">
              <div class="check-icon cross">✗</div>
              <span>{{ feature.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="testimonial-section">
      <div class="container">
        <div class="testimonial-image"></div>
        <div class="testimonial-content">
          <blockquote class="testimonial-quote">
            "I was skeptical, but Area has completely transformed the way I manage my business. The data visualizations are so clear and intuitive, and the platform is so easy to use. I can't imagine running my company without it."
          </blockquote>
          <div class="testimonial-author">
            <p class="author-name">John Smith</p>
            <p class="author-title">Head of Data</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <div class="how-it-works-header">
          <h3 class="section-title">Map Your Success</h3>
          <a href="#contact" class="btn-secondary">Discover More</a>
        </div>
        <div class="steps-grid">
          <div class="step-item" v-for="step in steps" :key="step.id">
            <div class="step-number">{{ step.number }}</div>
            <h4 class="step-title">{{ step.title }}</h4>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final Image -->
    <div class="final-image">
      <div class="container">
        <div class="image-container"></div>
      </div>
    </div>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h3 class="section-title">Connect with us</h3>
        <p class="section-description">Schedule a quick call to learn how Area can turn your regional data into a powerful advantage.</p>
        <a href="#contact" class="btn-primary">Learn More</a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-links">
          <button class="nav-item">Benefits</button>
          <button class="nav-item">Specifications</button>
          <button class="nav-item">How-to</button>
        </div>
        <div class="footer-credits">
          <div class="footer-logo"></div>
          <div class="footer-text">
            <span>© Area.</span>
            <span>2025</span>
          </div>
          <span>All Rights Reserved</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const benefits = ref([
      {
        id: 1,
        title: "Amplify Insights",
        description: "Unlock data-driven decisions with comprehensive analytics, revealing key opportunities for strategic regional growth.",
        icon: "🔌"
      },
      {
        id: 2,
        title: "Control Your Global Presence",
        description: "Manage and track satellite offices, ensuring consistent performance and streamlined operations everywhere.",
        icon: "🌍"
      },
      {
        id: 3,
        title: "Remove Language Barriers",
        description: "Adapt to diverse markets with built-in localization for clear communication and enhanced user experience.",
        icon: "👤"
      },
      {
        id: 4,
        title: "Visualize Growth",
        description: "Generate precise, visually compelling reports that illustrate your growth trajectories across all regions.",
        icon: "📊"
      }
    ])

    const features = ref([
      { id: 1, number: "01", text: "Spot Trends in Seconds: No more digging through numbers." },
      { id: 2, number: "02", text: "Get Everyone on the Same Page: Share easy-to-understand reports with your team." },
      { id: 3, number: "03", text: "Make Presentations Pop: Interactive maps and dashboards keep your audience engaged." },
      { id: 4, number: "04", text: "Your Global Snapshot: Get a quick, clear overview of your entire operation." }
    ])

    const areaFeatures = ref([
      { id: 1, name: "Ultra-fast browsing" },
      { id: 2, name: "Advanced AI insights" },
      { id: 3, name: "Seamless integration" },
      { id: 4, name: "Advanced AI insights" },
      { id: 5, name: "Ultra-fast browsing" },
      { id: 6, name: "Full UTF-8 support" }
    ])

    const websurgeFeatures = ref([
      { id: 1, name: "Fast browsing", included: true },
      { id: 2, name: "Basic AI recommendations", included: true },
      { id: 3, name: "Restricts customization", included: true },
      { id: 4, name: "Basic AI insights", included: false },
      { id: 5, name: "Fast browsing", included: true },
      { id: 6, name: "Potential display errors", included: false }
    ])

    const hyperviewFeatures = ref([
      { id: 1, name: "Moderate speeds" },
      { id: 2, name: "No AI assistance" },
      { id: 3, name: "Steep learning curve" },
      { id: 4, name: "No AI assistance" },
      { id: 5, name: "Moderate speeds" },
      { id: 6, name: "Partial UTF-8 support" }
    ])

    const steps = ref([
      {
        id: 1,
        number: "01",
        title: "Get Started",
        description: "With our intuitive setup, you're up and running in minutes."
      },
      {
        id: 2,
        number: "02",
        title: "Customize and Configure",
        description: "Adapt Area to your specific requirements and preferences."
      },
      {
        id: 3,
        number: "03",
        title: "Grow Your Business",
        description: "Make informed decisions to exceed your goals."
      }
    ])

    return {
      benefits,
      features,
      areaFeatures,
      websurgeFeatures,
      hyperviewFeatures,
      steps
    }
  }
}
</script>
