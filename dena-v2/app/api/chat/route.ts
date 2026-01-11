import { auth, currentUser } from '@clerk/nextjs/server'
import { openai } from '@/lib/openai'
import { SYSTEM_PROMPT } from '@/lib/prompts'
import { NextRequest } from 'next/server'

// Mock response generator for demo mode
function generateMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('icp') || lowerMessage.includes('ideal customer') || lowerMessage.includes('customer profile')) {
    return `Great question! Defining your Ideal Customer Profile (ICP) is crucial for GTM success. Here's a framework to get started:

**1. Firmographics** (for B2B):
- Company size (employees, revenue)
- Industry/vertical
- Geography
- Tech stack

**2. Demographics** (for B2C):
- Age, income, location
- Job title/role
- Company stage

**3. Behavioral Traits**:
- What problem are they actively trying to solve?
- What triggers them to look for a solution?
- How do they currently solve this problem?

**4. Qualification Criteria**:
- Budget authority
- Decision-making timeline
- Technical requirements

**Action Step**: Interview 5-10 of your best customers. Look for patterns in who gets the most value from your product.

What industry or customer segment are you targeting?`
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('pricing')) {
    return `Pricing is both an art and a science. Here's my framework for SaaS pricing:

**1. Value-Based Pricing**:
- What's the ROI you deliver? (time saved, revenue generated, costs reduced)
- Price at 10-20% of the value you create

**2. Common SaaS Models**:
- **Per-seat**: $X/user/month (Slack, Notion)
- **Usage-based**: Pay for what you use (Stripe, Twilio)
- **Tiered**: Good/Better/Best packages (Mailchimp)
- **Flat-rate**: One price, unlimited usage

**3. Starting Point**:
- Early stage: Test 2-3 price points with prospects
- Aim for $100-500/mo minimum for B2B
- Lower pricing = more support tickets

**4. Red Flags**:
- Don't compete on price alone
- Avoid discounting >20% regularly
- If everyone says "yes" immediately, you're too cheap

What's your current pricing model, and what results are you seeing?`
  }
  
  if (lowerMessage.includes('gtm') || lowerMessage.includes('go-to-market')) {
    return `There are three main GTM motions for SaaS. The right one depends on your product and ACV (Annual Contract Value):

**1. Product-Led Growth (PLG)**:
- Best for: ACV <$10k, simple products
- Users can sign up and get value without sales
- Examples: Slack, Notion, Canva
- Key metric: Activation rate, time-to-value

**2. Sales-Led**:
- Best for: ACV >$25k, complex products
- Requires demo and implementation
- Examples: Salesforce, Workday
- Key metric: Sales cycle length, close rate

**3. Hybrid**:
- Best for: Mid-market plays ($10k-$50k ACV)
- Self-serve + sales assist for expansion
- Examples: Dropbox, HubSpot
- Key metric: PQL to customer conversion

**Your decision framework**:
- Can users get value in <15 min? → PLG
- Need custom implementation? → Sales-led
- Simple start, complex scale? → Hybrid

What's your product's complexity and target deal size?`
  }
  
  if (lowerMessage.includes('conversion') || lowerMessage.includes('sales')) {
    return `Let's diagnose your conversion funnel. Here's my framework:

**1. Map Your Funnel**:
- Awareness → Interest → Consideration → Decision → Close
- Where are you losing people?

**2. Common Conversion Killers**:
- **Long sales cycle**: Shorten time-to-value
- **Too many steps**: Simplify onboarding
- **Weak value prop**: Make it crystal clear
- **Price objections**: Better ROI communication
- **No urgency**: Create FOMO or deadlines

**3. Quick Wins**:
- Add social proof (testimonials, logos)
- Simplify your demo/trial signup
- Follow up within 5 minutes of inbound leads
- Use qualification frameworks (BANT, MEDDIC)

**4. Metrics to Track**:
- Lead-to-opp conversion: >15% is good
- Opp-to-close: >25% is solid
- Average deal cycle: Track & reduce monthly

What's your current conversion rate, and where do prospects drop off most?`
  }
  
  if (lowerMessage.includes('lead gen') || lowerMessage.includes('generation')) {
    return `Smart lead generation is about quality over quantity. Here's what works in 2026:

**1. Outbound That Works**:
- Hyper-personalized emails (not templates)
- Multi-channel: Email + LinkedIn + calls
- Target decision-makers directly
- Lead with insight, not your product

**2. Inbound Strategies**:
- SEO content targeting buyer intent keywords
- LinkedIn thought leadership
- Community building (Slack, Discord)
- Webinars with actionable takeaways

**3. Demand Gen vs Lead Gen**:
- Lead gen: Fill the funnel
- Demand gen: Build awareness first
- Most startups do too much lead gen, not enough demand gen

**4. Channel Selection**:
- B2B SaaS: LinkedIn, SEO, outbound
- B2C: Instagram, TikTok, paid social
- PLG: Product virality, referrals

**Quick Test**:
- Pick ONE channel
- Go deep for 90 days
- Measure cost per qualified lead
- Then add a second channel

What channels have you tried, and what's your CAC target?`
  }
  
  if (lowerMessage.includes('metrics') || lowerMessage.includes('track')) {
    return `Here are the core GTM metrics every founder should track:

**Revenue Metrics**:
- **MRR/ARR**: Monthly/Annual Recurring Revenue
- **Growth Rate**: Month-over-month % increase
- **Net Revenue Retention**: >100% is healthy

**Unit Economics**:
- **CAC**: Customer Acquisition Cost
- **LTV**: Lifetime Value
- **LTV:CAC Ratio**: Should be >3:1
- **Payback Period**: <12 months is good

**Sales Metrics**:
- **Pipeline Coverage**: 3-4x your quota
- **Win Rate**: % of opps that close
- **Sales Cycle Length**: Track & optimize
- **Average Deal Size**: Grow over time

**Leading Indicators**:
- **SQLs**: Sales Qualified Leads
- **Pipeline Created**: New $ in funnel
- **Demo-to-Close %**: Conversion rate

**Rule of 40**: (Growth Rate % + Profit Margin %) should be >40

What's your current MRR and growth rate?`
  }
  
  // Default response
  return `That's a great question! As your GTM advisor, I'm here to help with:

- **ICP Definition**: Who should you target?
- **Pricing Strategy**: How to price your product
- **Sales Process**: How to close more deals
- **Lead Generation**: Where to find customers
- **Growth Metrics**: What to track and optimize

Can you give me more context about your startup? What stage are you at, and what's your biggest GTM challenge right now?

Feel free to ask about:
- Ideal customer profiles
- Pricing and packaging
- Sales strategies
- Lead generation tactics
- Growth metrics and KPIs

What would be most helpful for you today?`
}

export async function POST(req: NextRequest) {
  try {
    console.log('Chat API called')
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    const authResult = await auth()
    console.log('Auth result:', JSON.stringify(authResult, null, 2))
    
    const user = await currentUser()
    console.log('Current user:', user ? `ID: ${user.id}` : 'No user')
    
    const userId = authResult?.userId || user?.id
    console.log('Final User ID:', userId)
    
    if (!userId) {
      console.log('No user ID found - user not authenticated')
      return new Response(JSON.stringify({ error: 'Unauthorized - Please sign in' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { messages } = await req.json()
    console.log('Messages received:', messages?.length)

    if (!messages || !Array.isArray(messages)) {
      console.log('Invalid messages format')
      return new Response('Invalid request body', { status: 400 })
    }

    // Demo mode - return mock responses
    if (process.env.DEMO_MODE === 'true') {
      console.log('Running in DEMO MODE')
      const userMessage = messages[messages.length - 1]?.content || ''
      const mockResponse = generateMockResponse(userMessage)
      
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          // Simulate streaming by sending chunks
          const words = mockResponse.split(' ')
          for (const word of words) {
            controller.enqueue(encoder.encode(word + ' '))
            await new Promise(resolve => setTimeout(resolve, 50))
          }
          controller.close()
        }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    console.log('Calling OpenAI...')
    // Create streaming response
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    })

    console.log('OpenAI response received, creating stream...')

    // Create a readable stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
