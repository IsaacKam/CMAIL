export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  category: 'primary' | 'promotions' | 'social' | 'updates';
  starred: boolean;
  important: boolean;
  read: boolean;
  attachments?: { name: string; type: 'pdf' | 'image' | 'doc' }[];
  labels?: string[];
}

export const portfolioEmails: Email[] = [
  {
    id: '1',
    sender: 'Giver Solutions',
    senderEmail: 'careers@giversolutions.com',
    subject: 'Creative Strategist Position - Welcome to the Team! 🚀',
    snippet: "Argentina's top performance marketing agency supporting 100+ high-growth global e-commerce brands...",
    body: `<div class="email-body">
      <p><strong>Role:</strong> Creative Strategist</p>
      <p><strong>Duration:</strong> May 2025 – Present</p>
      <p><strong>About:</strong> Argentina's top performance marketing agency supporting 100+ high-growth global e-commerce brands in wellness, living, beauty & more</p>
      
      <h3>Key Achievements:</h3>
      <ul>
        <li>Owned performance & creative strategy for <strong>12+ global brands</strong> across Meta, Google, TikTok, Amazon & Email</li>
        <li>Led a 2-person creative team delivering data-driven campaigns that <strong>increased ROAS by 35%</strong> and <strong>conversions by 40%</strong></li>
        <li>Integrated advanced AI workflows into creative pipelines achieving <strong>12x increase in content production speed</strong></li>
      </ul>
    </div>`,
    date: 'May 2025',
    category: 'primary',
    starred: true,
    important: true,
    read: false,
    labels: ['Work']
  },
  {
    id: '2',
    sender: 'Skin Choice',
    senderEmail: 'team@skinchoice.co.uk',
    subject: 'Marketing Lead - Leading Brand & Creative Strategy 💄',
    snippet: 'Fast-growing London skincare startup doing $5M+ annual revenue, leading brand, creative and performance...',
    body: `<div class="email-body">
      <p><strong>Role:</strong> Marketing Lead</p>
      <p><strong>Duration:</strong> January 2025 – Present</p>
      <p><strong>About:</strong> Fast-growing, London skincare startup doing $5M+ annual revenue</p>
      
      <h3>Key Achievements:</h3>
      <ul>
        <li>Increased <strong>TikTok GMV by 50%</strong> & email marketing performance by <strong>55%</strong> through education-first, results-driven content</li>
        <li>Delivered <strong>12,000+ high-impact creatives</strong> by running a lean in-house production setup and integrating AI to scale output</li>
        <li>Generated <strong>30M+ organic TikTok views</strong> through digital + in-person strategies</li>
        <li>Built Gen-Z-focused brand storytelling & led insight teams to launch <strong>6 products</strong> with full go-to-market execution</li>
      </ul>
    </div>`,
    date: 'Jan 2025',
    category: 'primary',
    starred: true,
    important: true,
    read: false,
    labels: ['Work']
  },
  {
    id: '3',
    sender: 'EQUALS',
    senderEmail: 'team@equals.app',
    subject: 'Marketing Executive - Scaling User Acquisition 🎵',
    snippet: '$7M-backed social music app with 800K+ users focused on helping people make friends through music...',
    body: `<div class="email-body">
      <p><strong>Role:</strong> Marketing Executive</p>
      <p><strong>Duration:</strong> December 2023 – February 2025</p>
      <p><strong>About:</strong> $7M-backed social music app with 800K+ users focused on helping people make friends through music</p>
      
      <h3>Key Achievements:</h3>
      <ul>
        <li>Helped deploy a <strong>£1M+ annual marketing budget</strong> across TikTok, Meta & Snapchat to scale user acquisition efficiently</li>
        <li>Managed <strong>20+ ambassadors</strong> posting <strong>800+ pieces of content weekly</strong>, creating briefs & driving consistent creator output</li>
        <li>Built value-optimised campaigns that <strong>increased ROAS by 30%</strong> and boosted <strong>paying-user conversion by 62%</strong></li>
      </ul>
    </div>`,
    date: 'Dec 2023',
    category: 'primary',
    starred: false,
    important: true,
    read: true,
    labels: ['Work']
  },
  {
    id: '4',
    sender: 'Freelance Clients',
    senderEmail: 'projects@camilaspokojny.com',
    subject: 'Marketing & Creative Strategy Portfolio 🎨',
    snippet: 'Worked with a range of DTC companies across health, fashion and beauty during university...',
    body: `<div class="email-body">
      <p><strong>Duration:</strong> October 2022 – September 2025</p>
      <p><strong>About:</strong> Worked with a range of DTC companies across health, fashion and beauty during university as a freelancer</p>
      
      <h3>Client Projects:</h3>
      
      <h4>🛍️ Madness Clothing</h4>
      <p>Built a new content strategy and introduced catalogue-based ad formats, <strong>boosting ROAS by 25%</strong></p>
      
      <h4>✨ The Glow Factor</h4>
      <p>Created ad campaigns and UGC briefs, redefining their communication approach</p>
      
      <h4>🇦🇷 La Pampa Shop</h4>
      <p>Digital-first concept store bringing Argentine craft to Europe, managed cross-cultural brand strategy</p>
    </div>`,
    date: 'Oct 2022',
    category: 'promotions',
    starred: false,
    important: false,
    read: true,
    labels: ['Projects']
  },
  {
    id: '5',
    sender: 'Kushi Brand',
    senderEmail: 'founder@kushi.com',
    subject: 'Founder Story - Building a DTC Brand at 18 📱',
    snippet: 'Founded an Argentinian design-led DTC brand for handcrafted phone accessories...',
    body: `<div class="email-body">
      <p><strong>Role:</strong> Founder</p>
      <p><strong>Duration:</strong> February 2018 – January 2019</p>
      <p><strong>About:</strong> Argentinian design-led DTC brand for handcrafted phone accessories</p>
      
      <h3>Entrepreneurial Journey:</h3>
      <ul>
        <li>At 18, independently built an artisan handmade phone accessory brand that generated <strong>$50K+ in sales</strong> in its first year</li>
        <li>Grew a completely organic community of <strong>25K+ followers</strong> through content-led brand building and BTS content</li>
        <li>Self-taught <strong>Adobe Creative Suite</strong> and built the entire brand identity, product positioning and content strategy</li>
      </ul>
    </div>`,
    date: 'Feb 2018',
    category: 'promotions',
    starred: true,
    important: false,
    read: true,
    labels: ['Projects', 'Founder']
  },
  {
    id: '6',
    sender: "Regent's University London",
    senderEmail: 'admissions@regents.ac.uk',
    subject: 'Congratulations on Your Graduation! 🎓',
    snippet: 'BSc (Hons) Business, Technology & Entrepreneurship - Graduated January 2025...',
    body: `<div class="email-body">
      <p><strong>Degree:</strong> BSc (Hons) Business, Technology & Entrepreneurship</p>
      <p><strong>Result:</strong> 2:1</p>
      <p><strong>Graduated:</strong> January 2025</p>
      
      <h3>Academic Focus:</h3>
      <p>Specialised in innovation, emerging technologies, and digital business development.</p>
      
      <h3>Key Modules:</h3>
      <ul>
        <li>The Art of Data Storytelling</li>
        <li>Cyber-Psychology</li>
        <li>Influencer Marketing Masterclass</li>
      </ul>
      
      <h3>Dissertation:</h3>
      <p><em>"AI-Driven Personalisation in Marketing: Challenges, Solutions, and Ethical Considerations"</em></p>
    </div>`,
    date: 'Jan 2025',
    category: 'social',
    starred: false,
    important: false,
    read: true,
    labels: ['Education']
  },
  {
    id: '7',
    sender: 'Skills & Tools',
    senderEmail: 'skills@camilaspokojny.com',
    subject: 'Technical Skills & Software Proficiency 💻',
    snippet: 'AI & GenAI, Creative Software, Marketing & Ads, Analytics & Insights...',
    body: `<div class="email-body">
      <h3>🤖 AI & GenAI:</h3>
      <p>Nano Banana, Higgsfield, Veo+, Sora, Midjourney, Kling, Runway</p>
      
      <h3>🎨 Creative Software:</h3>
      <p>Adobe Creative Suite (Premiere Pro, Illustrator, Photoshop, InDesign), Canva, Figma</p>
      
      <h3>📊 Marketing & Ads:</h3>
      <p>Meta Ads Manager, Meta Ads Library</p>
      
      <h3>📈 Analytics & Insights:</h3>
      <p>Google Analytics (GA4), TikTok Analytics + Creative Centre, Meta Business Insights, Looker Studio</p>
      
      <h3>🛒 E-commerce & CRM:</h3>
      <p>Shopify Admin & Analytics, Klaviyo, Amazon Seller Central</p>
      
      <h3>🔍 Research:</h3>
      <p>Brandwatch, advanced trend research tools</p>
      
      <h3>📋 Project & Workflow:</h3>
      <p>Notion, Asana, Slack</p>
    </div>`,
    date: 'Now',
    category: 'updates',
    starred: false,
    important: false,
    read: true,
    labels: ['Skills']
  },
  {
    id: '8',
    sender: 'Languages & Activities',
    senderEmail: 'about@camilaspokojny.com',
    subject: 'Languages & Extra-Curricular Activities 🌍',
    snippet: 'English (Fluent), Spanish (Native), French (Basic)...',
    body: `<div class="email-body">
      <h3>🗣️ Languages:</h3>
      <ul>
        <li><strong>English</strong> - Fluent</li>
        <li><strong>Spanish</strong> - Native</li>
        <li><strong>French</strong> - Basic</li>
      </ul>
      
      <h3>🏆 Achievements & Activities:</h3>
      <ul>
        <li>Participated in <strong>L'Oréal Brandstorm 2025</strong> (Men's Category)</li>
        <li>Volunteered for <strong>2 years in Dar es Dar</strong> - a youth-driven program aimed at combating child malnutrition and poverty in Argentina</li>
        <li>Competed in <strong>ADE field hockey league</strong> for 3 years</li>
      </ul>
    </div>`,
    date: '2025',
    category: 'updates',
    starred: false,
    important: false,
    read: true,
    labels: ['About']
  },
  {
    id: '9',
    sender: 'Contact Me',
    senderEmail: 'camilaspokojny1@gmail.com',
    subject: "Let's Connect! 📬",
    snippet: 'Ready to collaborate? Get in touch via email...',
    body: `<div class="email-body">
      <h3>📧 Email:</h3>
      <p><a href="mailto:camilaspokojny1@gmail.com">camilaspokojny1@gmail.com</a></p>
      
      <h3>💼 Open to:</h3>
      <ul>
        <li>Creative Strategy roles</li>
        <li>Performance Marketing positions</li>
        <li>Brand & Growth opportunities</li>
        <li>Freelance collaborations</li>
      </ul>
    </div>`,
    date: 'Now',
    category: 'primary',
    starred: true,
    important: true,
    read: false,
    labels: ['Contact']
  }
];

export const sidebarLabels = [
  { name: 'Work', color: '#1a73e8', count: 3 },
  { name: 'Projects', color: '#ea4335', count: 2 },
  { name: 'Education', color: '#34a853', count: 1 },
  { name: 'Skills', color: '#fbbc04', count: 1 },
  { name: 'About', color: '#9334ea', count: 1 },
  { name: 'Contact', color: '#f472b6', count: 1 }
];

export const categoryTabs = [
  { id: 'primary', name: 'Primary', icon: 'inbox' },
  { id: 'promotions', name: 'Promotions', icon: 'tag' },
  { id: 'social', name: 'Social', icon: 'people' },
  { id: 'updates', name: 'Updates', icon: 'info' }
];

