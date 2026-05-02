# Artisan Collective ( NSoC'26 ) ( Project Kernels )

## hellp needed :)
all rules are down there ( feel free to get to know ) ##
## while do anything needed video drive link beofre and after and or ss okay to give marks and tag properly ##
------------------------------------------------------------------------------------

Artisan Collective is a full-stack web platform designed to connect artisans, creators, and customers in one digital ecosystem. It combines marketplace capabilities, creator storytelling, and AI-assisted experiences to support local craftsmanship at scale.

## Table of Contents
1. Project Overview
2. Objective of the Proposed Work
3. Why This Topic Is Unique
4. Detailed Technology Stack
5. Core Modules and Features
6. Proposed Workflow
7. Future Scope and Benefits
8. Expected Impact
9. Setup and Run

## Project Overview
The platform solves a real challenge in the creative economy: talented artisans often have strong products but limited digital reach, branding support, and direct customer access. Traditional e-commerce platforms are product-centric, while artisan businesses are story-centric. Artisan Collective bridges this gap by combining:

- Product discovery and shopping flow
- Artisan profile and identity building
- Community storytelling
- AI-generated narrative support for creators

This approach increases visibility, trust, and long-term customer engagement for handmade and culturally rich products.

## Objective of the Proposed Work
The proposed work has the following key objectives:

1. Build a digital-first marketplace for artisans to showcase and sell authentic handmade products.
2. Create a direct artisan-to-customer channel that reduces dependency on intermediaries.
3. Improve artisan discoverability through curated listings, featured sections, and recommendation-ready architecture.
4. Enable community connection through stories, artisan journeys, and shared creative experiences.
5. Integrate AI support for storytelling so creators can present their products with stronger narratives and emotional context.
6. Provide a scalable technical foundation that can support future growth such as analytics, regional expansion, and multilingual adoption.

## Why This Topic Is Unique
This topic is unique because it is not only about selling products. It is about preserving craft, culture, and creator identity in a modern digital system.

### Unique Value Proposition
- **Culture + Commerce Model**: Focuses on cultural storytelling and product value together.
- **Artisan-Centric UX**: Prioritizes creator identity, profile pages, and trust building.
- **Community-Led Growth**: Encourages social proof through stories and collaborative discovery.
- **AI-Assisted Creativity**: Uses AI to support content generation, helping artisans communicate product value better.

### Why It Matters in the Market
- Most marketplaces optimize for volume and price competition.
- Artisan Collective optimizes for authenticity, craftsmanship, and long-term brand loyalty.
- It supports micro-entrepreneurs and local economies, making it socially and economically meaningful.

## Detailed Technology Stack

### Frontend
- **React + TypeScript**: Component-based architecture with type safety.
- **Vite**: Fast bundling and hot module replacement for better developer productivity.
- **Tailwind CSS**: Utility-first styling for responsive and consistent UI development.
- **shadcn/ui (Radix-based components)**: Accessible, reusable UI primitives and design consistency.
- **React Context and custom hooks**: State and session handling (for example auth/cart-related behavior).

### Backend
- **Node.js + TypeScript**: Typed server-side logic and API management.
- **Express-style routing structure**: Centralized endpoint definition and request handling.
- **Modular service layer**: AI integrations and business logic are separated for maintainability.

### Data and ORM Layer
- **Drizzle ORM**: Type-safe database schema and query management.
- **Shared schema contracts**: Unified types between frontend and backend for safer data flow.

### AI Integration
- **Gemini service integration**
- **OpenAI service integration**

These services can be used to power storytelling workflows, product description assistance, and personalized content experiences.

### Tooling and Developer Experience
- **TypeScript across stack** for consistency and fewer runtime errors.
- **PostCSS + Tailwind config** for design pipeline.
- **Project-level configuration** (`tsconfig`, Vite config, Drizzle config) for maintainable builds.

## Core Modules and Features
- **Authentication flow**: Separate paths for customer and artisan access.
- **Artisan onboarding**: Signup/profile pages for creator presence.
- **Marketplace pages**: Product listing and product detail journeys.
- **Shopping cart support**: Purchase preparation and user convenience.
- **Community stories**: Narrative-driven engagement and trust.
- **AI storytelling page**: Creative assistant experience for content enrichment.
- **Featured and recommendation-ready sections**: Better product discovery design.

## Proposed Workflow
1. Artisan registers and creates a profile.
2. Artisan adds product details and story context.
3. Customer explores artisans, products, and community stories.
4. Customer adds products to cart and proceeds toward purchase.
5. AI-assisted content helps improve product narratives and engagement.
6. Platform grows through repeat trust, visibility, and creator branding.

## Future Scope and Benefits

### Future Scope
1. **Secure payment gateway integration** for complete order lifecycle.
2. **Order management dashboard** for artisans and customers.
3. **Inventory and logistics integration** with delivery tracking.
4. **Multilingual support** to onboard regional artisans and global users.
5. **AI-powered recommendations** based on user behavior and interests.
6. **Analytics dashboard** for sales, engagement, and product performance insights.
7. **Workshop and event modules** for paid learning sessions from artisans.
8. **Mobile app extension** for broader accessibility and retention.
9. **Trust mechanisms** such as verified artisan badges and review moderation.
10. **Social sharing and affiliate ecosystem** for growth marketing.

### Benefits of Future Implementation
- **For Artisans**:
  - Better digital visibility and personal brand identity.
  - Higher conversion through storytelling and trust.
  - Data-backed decisions using analytics.
- **For Customers**:
  - Access to authentic, high-quality handcrafted products.
  - Rich shopping context through artisan stories.
  - Personalized product discovery.
- **For the Ecosystem**:
  - Strengthened local creative economy.
  - Preservation of traditional crafts in digital form.
  - Scalable community-driven commerce model.

## Expected Impact
- Increase artisan reach beyond local geography.
- Improve creator income opportunities.
- Build stronger emotional connection between buyer and maker.
- Encourage sustainable and meaningful consumption patterns.

## Setup and Run

### Prerequisites
- Node.js (recommended LTS version)
- npm or pnpm
- Database setup compatible with Drizzle configuration
- API keys for AI providers (if AI features are enabled)

### Environment Variables
Copy the `.env.example` file to create a new `.env` file:
```bash
cp .env.example .env
```
Then, fill in the required environment variables in your `.env` file:
- `GEMINI_API_KEY`: Your Google Gemini API key.
- `OPENAI_API_KEY`: Your OpenAI API key.

### Installation
```bash
npm install
```

### Run in development mode
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

---
This project demonstrates a practical blend of technology, social impact, and creative entrepreneurship. Artisan Collective is not just an online store; it is a digital foundation for artisan-led growth.
## 🤝 Contributing (NSoC 2026)

* Check issues and request assignment
* Do NOT create PR without assignment
* Mention `NSoC'26` in every PR
* Follow `CONTRIBUTING.md`

---

## 🏷️ Issue Labels

* **level1 — 3 pts** → Beginner
* **level2 — 5 pts** → Intermediate
* **level3 — 10 pts** → Advanced

---

## ⚠️ Contribution Rules

* PR without assignment → ❌ Rejected
* Missing `NSoC'26` → ⚠️ Update required
* Low-quality PR → ❌ Not merged

---

## ⭐ Support

If you like this project, give it a ⭐ and contribute!

---
