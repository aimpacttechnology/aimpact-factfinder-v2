import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Download, CheckCircle, Menu, Save, Trash2, Eye, FileText, Copy } from 'lucide-react';

export default function AiMpactFactFinder() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const [showConsultantView, setShowConsultantView] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  // Form data structure - all 43 questions organized by section
  const formSections = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: '📋',
      questions: [
        { id: 'businessName', label: 'Business Name', type: 'text', required: true },
        { id: 'ownerName', label: 'Owner/Contact Name', type: 'text', required: true },
        { id: 'email', label: 'Email Address', type: 'email', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel' },
        {
          id: 'industry',
          label: 'Industry/Business Type',
          type: 'radio',
          required: true,
          options: [
            'Service Business (Consulting, Coaching, Professional Services)',
            'Product Business (Physical products)',
            'Marketing/Influencer w/ products',
            'Marketing/Influencer no products',
            'Construction/Trades (HVAC, Plumbing, Landscaping, etc.)',
            'Technology/Software',
            'Food & Beverage',
            'Healthcare/Wellness',
            'Education/Media',
            'Real Estate/Property Management',
            'Other'
          ]
        },
        {
          id: 'yearsInBusiness',
          label: 'How long have you been in business?',
          type: 'radio',
          required: true,
          options: ['Less than 1 year', '1-2 years', '3-5 years', '6-10 years', '10+ years']
        },
        {
          id: 'revenue',
          label: 'Annual Revenue Range',
          type: 'radio',
          required: true,
          options: ['$0-$100K', '$100K-$250K', '$250K-$500K', '$500K-$1M', '$1M-$5M', '$5M+']
        },
        {
          id: 'teamSize',
          label: 'Team Size (including yourself)',
          type: 'radio',
          required: true,
          options: ['Just me (solo)', '2-5 people', '6-10 people', '11-25 people', '25+']
        }
      ]
    },
    {
      id: 'systems',
      title: 'Current Systems',
      icon: '⚙️',
      questions: [
        {
          id: 'crm',
          label: 'How do you currently manage customer relationships?',
          type: 'radio',
          required: true,
          options: [
            'No CRM (Email, folders etc)',
            'Basic CRM',
            'Advanced CRM (Salesforce, Zoho, etc.)',
            'Custom CRM',
            'Excel spreadsheet',
            'Other'
          ]
        },
        {
          id: 'website',
          label: 'Do you have a website?',
          type: 'radio',
          required: true,
          options: [
            'No website',
            'Yes, basic informational site/landing page',
            'Strictly social media',
            'Yes, with contact forms',
            'Yes, with ecommerce and booking',
            'Yes, custom site, fully integrated'
          ]
        },
        {
          id: 'scheduling',
          label: 'How do you handle appointment scheduling?',
          type: 'radio',
          required: true,
          options: [
            'Manual - phone calls and emails',
            'Google/Outlook Calendar only',
            'Scheduling tool (Calendly, Acuity, etc.)',
            'CRM with built-in scheduling',
            "I don't schedule appointments",
            'N/A'
          ]
        },
        {
          id: 'emailMarketing',
          label: 'How do you manage email marketing?',
          type: 'radio',
          required: true,
          options: [
            "Don't do email marketing",
            'Manual one-off emails',
            'Using an email platform (Mailchimp, etc.)',
            'Automated sequences/campaigns'
          ]
        }
      ]
    },
    {
      id: 'painpoints',
      title: 'Pain Points',
      icon: '🎯',
      questions: [
        {
          id: 'missedFollowups',
          label: 'Do leads fall through the cracks due to missed follow-ups?',
          type: 'radio',
          required: true,
          options: [
            'Yes, happens frequently',
            'Sometimes - maybe once a week',
            'Rarely - maybe once a month',
            'Never - we have good systems',
            'N/A'
          ]
        },
        {
          id: 'dataOrganization',
          label: 'How would you rate your customer data organization?',
          type: 'radio',
          required: true,
          options: [
            'Poor - scattered across multiple places',
            'Fair - centralized but hard to find quickly',
            'Good - well-organized and accessible',
            'Excellent - automated and integrated'
          ]
        },
        {
          id: 'responseTime',
          label: 'How quickly do you respond to new lead inquiries?',
          type: 'radio',
          required: true,
          options: [
            'Within 5 minutes',
            'Within 1 hour',
            'Within same business day',
            'Within 1-2 days',
            'Longer than 2 days',
            'It varies widely'
          ]
        },
        {
          id: 'afterHoursLoss',
          label: 'Do you lose revenue because inquiries come in after hours?',
          type: 'radio',
          required: true,
          options: ['Yes, definitely', "Probably - I'm not sure", 'No']
        },
        {
          id: 'topPainPoints',
          label: 'Top 3 tasks you wish you could spend less time on',
          type: 'textarea',
          required: true,
          placeholder: 'E.g., Scheduling appointments, following up with leads, invoicing...'
        }
      ]
    },
    {
      id: 'operations',
      title: 'Operations',
      icon: '📊',
      questions: [
        {
          id: 'schedulingHassle',
          label: 'Is scheduling appointments a time-consuming hassle?',
          type: 'radio',
          required: true,
          options: [
            'Yes, major pain point (10+ emails back and forth)',
            'Somewhat frustrating (a few emails)',
            'Not really an issue',
            "Don't schedule appointments"
          ]
        },
        {
          id: 'noShows',
          label: 'How often do you experience no-shows or last-minute cancellations?',
          type: 'radio',
          required: true,
          options: [
            'Frequently (more than 20%)',
            'Sometimes (10-20%)',
            'Rarely (less than 10%)',
            'Almost never',
            'Not applicable'
          ]
        },
        {
          id: 'projectTracking',
          label: 'How do you track orders/projects from start to finish?',
          type: 'radio',
          required: true,
          options: [
            'In my head / memory',
            'Email threads',
            'Spreadsheets',
            'Project management tool (Trello, Asana, etc.)',
            'Automated system with notifications'
          ]
        },
        {
          id: 'missedDeadlines',
          label: 'Have you ever missed a deadline or lost track of a customer order?',
          type: 'radio',
          required: true,
          options: ['Yes, more than once', 'Yes, happened once or twice', 'No, never', 'Not sure']
        },
        {
          id: 'reporting',
          label: 'How do you generate business reports and analytics?',
          type: 'radio',
          required: true,
          options: [
            "Don't generate reports",
            'Manually in spreadsheets',
            'Pull reports from accounting software',
            'Automated dashboard',
            'Combination of manual and automated'
          ]
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing & Growth',
      icon: '📈',
      questions: [
        {
          id: 'marketingConsistency',
          label: 'How consistent is your marketing?',
          type: 'radio',
          required: true,
          options: [
            'Very inconsistent - only when I have time',
            'Somewhat consistent - try weekly',
            'Consistent - have a schedule',
            'Very consistent - fully automated'
          ]
        },
        {
          id: 'leadGeneration',
          label: 'How effective is your lead generation?',
          type: 'radio',
          required: true,
          options: [
            'Poor - struggling to get leads',
            'Fair - getting some but not enough',
            'Good - steady flow of leads',
            'Excellent - more leads than I can handle'
          ]
        },
        {
          id: 'emailAutomation',
          label: 'Do you send automated email sequences to nurture leads?',
          type: 'radio',
          required: true,
          options: ['No', 'Thinking about it', 'Yes, basic sequences', 'Yes, sophisticated automation']
        },
        {
          id: 'socialMedia',
          label: 'How do you manage social media?',
          type: 'radio',
          required: true,
          options: [
            "Don't use social media for business",
            'Post when I remember',
            'Try to post regularly (manual)',
            'Use scheduling tool but manual',
            'Fully automated system'
          ]
        }
      ]
    },
    {
      id: 'time',
      title: 'Time & Resources',
      icon: '⏰',
      questions: [
        {
          id: 'adminHours',
          label: 'Hours per week on admin tasks (emails, scheduling, data entry, etc.)?',
          type: 'radio',
          required: true,
          options: ['Less than 5 hours', '5-10 hours', '10-20 hours', 'More than 20 hours']
        },
        {
          id: 'biggestTimeWaster',
          label: "What's your SINGLE biggest time-waster?",
          type: 'textarea',
          required: true,
          placeholder: 'E.g., Scheduling via email, answering same questions, chasing payments...'
        },
        {
          id: 'repetitiveTasks',
          label: 'What repetitive tasks do you wish could be automated?',
          type: 'textarea',
          required: true,
          placeholder: 'E.g., Sending invoices, following up with leads, posting on social media...'
        }
      ]
    },
    {
      id: 'goals',
      title: 'Business Goals',
      icon: '🎯',
      questions: [
        {
          id: 'primaryGoal',
          label: 'What is your PRIMARY business goal for the next 12 months?',
          type: 'radio',
          required: true,
          options: [
            'Increase revenue/sales',
            'Improve operational efficiency',
            'Scale and hire team members',
            'Get my time back / work-life balance',
            'Build better systems and processes',
            'Expand to new markets/products',
            'Other'
          ]
        },
        {
          id: 'targetRevenue',
          label: "What's your target annual revenue in 12 months?",
          type: 'text',
          required: true,
          placeholder: 'E.g., $500,000'
        },
        {
          id: 'additionalPainPoints',
          label: 'Any "Pain Points" we haven\'t discussed?',
          type: 'textarea',
          placeholder: 'Optional - anything else causing frustration...'
        },
        {
          id: 'idealWorkHours',
          label: 'How many hours per week would you IDEALLY like to work?',
          type: 'radio',
          required: true,
          options: [
            '20-30 hours (part-time)',
            '30-40 hours (full-time)',
            '40-50 hours',
            '50+ hours (I love what I do)'
          ]
        },
        {
          id: 'magicWand',
          label: 'If you could wave a magic wand and fix ONE thing, what would it be?',
          type: 'textarea',
          required: true,
          placeholder: 'Be specific...'
        }
      ]
    },
    {
      id: 'urgency',
      title: 'Pain & Urgency',
      icon: '🔥',
      questions: [
        {
          id: 'urgencyScale',
          label: 'How urgent is it to solve these operational issues? (1 = Can wait, 10 = Losing sleep)',
          type: 'scale',
          required: true,
          min: 1,
          max: 10
        },
        {
          id: 'consequencesOfInaction',
          label: "What happens if you DON'T fix these issues in the next 6 months?",
          type: 'radio',
          required: true,
          options: [
            'Nothing major - just frustrating',
            'Will miss some revenue opportunities',
            'Will limit my ability to grow',
            'Could seriously hurt the business',
            'Business might fail'
          ]
        },
        {
          id: 'priorSolutions',
          label: 'Have you looked at automation solutions before?',
          type: 'radio',
          required: true,
          options: [
            'No, never',
            'Yes, but too expensive',
            'Yes, but too complicated',
            "Yes, but didn't know where to start",
            "Yes, tried something but it didn't work"
          ]
        },
        {
          id: 'monthlyBudget',
          label: "What's your monthly budget for business automation/tools?",
          type: 'radio',
          required: true,
          options: ['Under $100/month', '$100-$250/month', '$250-$500/month', '$500+']
        }
      ]
    },
    {
      id: 'final',
      title: 'Final Questions',
      icon: '✅',
      questions: [
        {
          id: 'howHeard',
          label: 'How did you hear about AiMpact Technology?',
          type: 'radio',
          required: true,
          options: [
            'Social media (Instagram, LinkedIn, Facebook)',
            'Referral from a friend/colleague',
            'Online search',
            'Veteran event/organization',
            'Podcast',
            'Other'
          ]
        },
        {
          id: 'additionalQuestions',
          label: "Any additional challenges or questions you'd like to discuss?",
          type: 'textarea',
          placeholder: 'Optional...'
        },
        {
          id: 'bestTime',
          label: 'Best time to reach you for a follow-up call?',
          type: 'radio',
          required: true,
          options: ['Mornings (8am-12pm)', 'Afternoons (12pm-5pm)', 'Evenings (5pm-8pm)', 'Weekends']
        }
      ]
    }
  ];

  // ============================================
  // LOCAL STORAGE FUNCTIONS
  // ============================================
  
  const STORAGE_KEY = 'aimpact_factfinder_data';
  
  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.responses) setResponses(parsed.responses);
        if (parsed.step !== undefined) setStep(parsed.step);
        if (parsed.lastSaved) setLastSaved(new Date(parsed.lastSaved));
        setSaveStatus('Progress restored');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (e) {
      console.error('Error loading saved data:', e);
    }
  }, []);

  // Auto-save when responses or step changes
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      saveProgress();
    }
  }, [responses, step]);

  const saveProgress = () => {
    try {
      const data = {
        responses,
        step,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(new Date());
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (e) {
      console.error('Error saving:', e);
      setSaveStatus('Save failed');
    }
  };

  const clearSavedData = () => {
    if (window.confirm('Clear all saved progress? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      setResponses({});
      setStep(0);
      setReport(null);
      setLastSaved(null);
      setSaveStatus('Cleared');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  // Calculate total questions
  const totalQuestions = formSections.reduce((sum, section) => sum + section.questions.length, 0);
  const progress = (Object.keys(responses).length / totalQuestions) * 100;

  // Get current section and question
  let questionCount = 0;
  let currentSectionIndex = 0;
  let currentQuestionIndex = 0;

  for (let i = 0; i < formSections.length; i++) {
    if (questionCount + formSections[i].questions.length > step) {
      currentSectionIndex = i;
      currentQuestionIndex = step - questionCount;
      break;
    }
    questionCount += formSections[i].questions.length;
  }

  const currentSection = formSections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];

  const handleResponse = (value) => {
    setResponses({ ...responses, [currentQuestion.id]: value });
  };

  const canProceed = () => {
    if (!currentQuestion) return true;
    if (!currentQuestion.required) return true;
    return responses[currentQuestion.id] && responses[currentQuestion.id].toString().trim() !== '';
  };

  const nextStep = () => {
    if (step < totalQuestions - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      analyzeWithClaude();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ============================================
  // ENHANCED CLAUDE PROMPT WITH COMPARE/CONTRAST + BUDGET
  // ============================================
  
  const analyzeWithClaude = async () => {
    setAnalyzing(true);
    
    try {
      const prompt = `You are an AI automation consultant for AiMpact Technology. Analyze this business assessment and create a comprehensive report with SPECIFIC tool comparisons and budget analysis.

## CLIENT DATA
\`\`\`json
${JSON.stringify(responses, null, 2)}
\`\`\`

## YOUR TASK
Generate a detailed report in clean Markdown format (for Gamma.app presentation import). Use headers, tables, and bullet points.

---

# AI Automation Opportunity Report
## Prepared for: ${responses.businessName || '[Business Name]'}
### Assessment Date: ${new Date().toLocaleDateString()}

---

## Executive Summary
Write 2-3 sentences summarizing their current state and biggest opportunity.

---

## Critical Pain Points Identified
List top 3-5 specific issues based on their responses. Be specific to THEIR answers.

---

## Automation Opportunities

### 🚀 Quick Wins (Week 1-2)
- List 2-3 things they can implement immediately
- Include expected time savings per week

### 📈 Medium-Term Projects (Month 1-3)
- List 2-3 projects with implementation timeline
- Include expected ROI

### 🎯 Strategic Initiatives (Month 3-12)
- List 1-2 major transformations
- Include projected annual impact

---

## Solution Comparison Tables

For EACH major need identified, create a comparison table like this:

### [Need Category] Solutions

| Feature | Option A | Option B | Option C |
|---------|----------|----------|----------|
| **Tool Name** | [Name] | [Name] | [Name] |
| **Best For** | [Use case] | [Use case] | [Use case] |
| **Monthly Cost** | $X/mo | $X/mo | $X/mo |
| **Setup Difficulty** | Easy/Medium/Hard | Easy/Medium/Hard | Easy/Medium/Hard |
| **Key Strength** | [Strength] | [Strength] | [Strength] |
| **Limitation** | [Weakness] | [Weakness] | [Weakness] |

**Recommendation:** [Which option and why based on their specific situation]

Create comparison tables for:
1. CRM/Customer Management (if needed based on their response)
2. Scheduling/Booking (if needed)
3. Email Marketing/Automation (if needed)
4. Project Management (if needed)
5. AI Assistants/Chatbots (if applicable)

Only include categories relevant to their pain points.

---

## Budget Analysis

### Current State Cost Estimate
| Item | Estimated Hours/Week | Hourly Value | Weekly Cost |
|------|---------------------|--------------|-------------|
| [Task from their pain points] | X hrs | $Y | $Z |
| [Task 2] | X hrs | $Y | $Z |
| [Task 3] | X hrs | $Y | $Z |
| **Total Hidden Cost** | | | **$X/week** |

### Recommended Solution Investment

| Solution Category | Recommended Tool | Monthly Cost | Annual Cost |
|-------------------|-----------------|--------------|-------------|
| [Category 1] | [Tool] | $X | $X |
| [Category 2] | [Tool] | $X | $X |
| [Category 3] | [Tool] | $X | $X |
| **Total Investment** | | **$X/mo** | **$X/year** |

### ROI Calculation

| Metric | Value |
|--------|-------|
| **Current Weekly Time Lost** | X hours |
| **Projected Time Saved** | X hours/week |
| **Annual Time Saved** | X hours |
| **Value of Time Saved** (at $X/hr) | $X/year |
| **Annual Tool Investment** | $X/year |
| **Net Annual Benefit** | **$X/year** |
| **ROI** | **X%** |

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

### Phase 2: Automation (Week 3-6)
- [ ] Step 1
- [ ] Step 2

### Phase 3: Optimization (Month 2-3)
- [ ] Step 1
- [ ] Step 2

---

## Immediate Next Steps

1. **This Week:** [Specific action]
2. **Next Week:** [Specific action]
3. **Schedule:** [Call to action]

---

## About This Report
This report was generated by AiMpact Technology's AI-powered assessment tool.
Contact: [Your contact info]

---

IMPORTANT INSTRUCTIONS:
- Use REAL tool names and ACCURATE pricing (as of your knowledge cutoff)
- Base all recommendations on THEIR specific responses
- Keep budget recommendations within their stated range: ${responses.monthlyBudget || 'Not specified'}
- Match complexity to their team size: ${responses.teamSize || 'Not specified'}
- Consider their industry: ${responses.industry || 'Not specified'}
- Be specific and actionable, not generic
- Format for easy Gamma.app import (clean markdown, clear headers)`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 6000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      const data = await response.json();
      const analysisText = data.content[0].text;
      setReport(analysisText);
      
      // Save report to localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.report = analysisText;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setReport('Error generating analysis. Please check your connection and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // ============================================
  // DOWNLOAD FUNCTIONS
  // ============================================

  // Download as Markdown (for Gamma)
  const downloadMarkdown = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AiMpact-Report-${responses.businessName?.replace(/\s/g, '-') || 'Report'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download raw data as JSON (for consultant use)
  const downloadJSON = () => {
    const data = {
      clientInfo: {
        businessName: responses.businessName,
        ownerName: responses.ownerName,
        email: responses.email,
        phone: responses.phone
      },
      assessmentDate: new Date().toISOString(),
      responses: responses,
      report: report
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AiMpact-Data-${responses.businessName?.replace(/\s/g, '-') || 'Client'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy report to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(report).then(() => {
      setSaveStatus('Copied to clipboard!');
      setTimeout(() => setSaveStatus(''), 2000);
    });
  };

  // ============================================
  // CONSULTANT VIEW COMPONENT
  // ============================================
  
  const ConsultantView = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-auto">
      <div className="max-w-6xl mx-auto p-4 py-8">
        <div className="bg-slate-900 rounded-2xl border border-cyan-500/30 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Consultant View - Raw Data
            </h2>
            <button
              onClick={() => setShowConsultantView(false)}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="p-6 grid md:grid-cols-2 gap-6">
            {/* Raw Responses */}
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Client Responses</h3>
              <div className="bg-slate-800 rounded-lg p-4 max-h-[60vh] overflow-auto">
                {formSections.map(section => (
                  <div key={section.id} className="mb-6">
                    <h4 className="text-sm font-bold text-purple-400 mb-2">
                      {section.icon} {section.title}
                    </h4>
                    {section.questions.map(q => (
                      <div key={q.id} className="mb-2 text-sm">
                        <span className="text-gray-400">{q.label}:</span>
                        <span className="text-white ml-2">
                          {responses[q.id] || <span className="text-gray-600">Not answered</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Quick Analysis</h3>
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">Client Profile</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p><strong>Industry:</strong> {responses.industry}</p>
                    <p><strong>Revenue:</strong> {responses.revenue}</p>
                    <p><strong>Team:</strong> {responses.teamSize}</p>
                    <p><strong>Budget:</strong> {responses.monthlyBudget}</p>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">Pain Indicators</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p><strong>Urgency:</strong> {responses.urgencyScale}/10</p>
                    <p><strong>Missed Follow-ups:</strong> {responses.missedFollowups}</p>
                    <p><strong>Response Time:</strong> {responses.responseTime}</p>
                    <p><strong>Admin Hours:</strong> {responses.adminHours}</p>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">Key Opportunities</h4>
                  <div className="text-sm text-gray-300">
                    <p><strong>Magic Wand:</strong></p>
                    <p className="text-cyan-300 italic">{responses.magicWand || 'Not specified'}</p>
                    <p className="mt-2"><strong>Biggest Time Waster:</strong></p>
                    <p className="text-cyan-300 italic">{responses.biggestTimeWaster || 'Not specified'}</p>
                  </div>
                </div>

                <button
                  onClick={downloadJSON}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Raw Data (JSON)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER: LOADING STATE
  // ============================================
  
  if (analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Business...</h2>
          <p className="text-cyan-300 text-lg">Generating comparisons and budget analysis</p>
          <p className="text-gray-400 text-sm mt-2">This may take 15-30 seconds</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: REPORT VIEW
  // ============================================
  
  if (report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        {showConsultantView && <ConsultantView />}
        
        <div className="max-w-5xl mx-auto py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-cyan-500/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-white" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">Automation Report Ready</h1>
                    <p className="text-cyan-50">
                      {responses.businessName} • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowConsultantView(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Consultant View
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={downloadMarkdown}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download for Gamma (.md)
                  </button>
                </div>
              </div>
              
              {saveStatus && (
                <p className="text-cyan-100 text-sm mt-2">{saveStatus}</p>
              )}
            </div>
            
            {/* Report Content - Rendered Markdown */}
            <div className="p-8">
              <div className="prose prose-invert prose-cyan max-w-none">
                <div 
                  className="text-gray-100 leading-relaxed"
                  style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}
                >
                  {report}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-800/50 border-t border-cyan-500/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-300 text-sm">
                  Ready for Gamma? Download the .md file and import it directly.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setReport(null);
                      setStep(0);
                    }}
                    className="text-gray-400 hover:text-white text-sm underline"
                  >
                    Start New Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: QUESTION FORM
  // ============================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                AiMpact Technology
              </h1>
              <p className="text-cyan-300 text-sm">AI Automation Assessment</p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Save Status */}
              {saveStatus && (
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <Save className="w-4 h-4" />
                  {saveStatus}
                </span>
              )}
              {lastSaved && !saveStatus && (
                <span className="text-gray-400 text-xs hidden sm:block">
                  Auto-saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              
              {/* Clear Button */}
              <button
                onClick={clearSavedData}
                className="text-gray-400 hover:text-red-400 p-2"
                title="Clear saved progress"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              {/* Mobile Menu */}
              <button
                onClick={() => setShowNav(!showNav)}
                className="lg:hidden text-white p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-300 text-sm font-medium">
              Question {step + 1} of {totalQuestions}
            </span>
            <span className="text-cyan-300 text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-cyan-500/20 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-6 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentSection.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{currentSection.title}</h2>
                <p className="text-cyan-300 text-sm">
                  Section {currentSectionIndex + 1} of {formSections.length}
                </p>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="p-8">
            <label className="block text-xl font-semibold text-white mb-6">
              {currentQuestion.label}
              {currentQuestion.required && <span className="text-red-400 ml-1">*</span>}
            </label>

            {/* Text Input */}
            {currentQuestion.type === 'text' && (
              <input
                type="text"
                value={responses[currentQuestion.id] || ''}
                onChange={(e) => handleResponse(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder={currentQuestion.placeholder}
              />
            )}

            {/* Email Input */}
            {currentQuestion.type === 'email' && (
              <input
                type="email"
                value={responses[currentQuestion.id] || ''}
                onChange={(e) => handleResponse(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder={currentQuestion.placeholder}
              />
            )}

            {/* Tel Input */}
            {currentQuestion.type === 'tel' && (
              <input
                type="tel"
                value={responses[currentQuestion.id] || ''}
                onChange={(e) => handleResponse(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder={currentQuestion.placeholder}
              />
            )}

            {/* Textarea */}
            {currentQuestion.type === 'textarea' && (
              <textarea
                value={responses[currentQuestion.id] || ''}
                onChange={(e) => handleResponse(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                placeholder={currentQuestion.placeholder}
              />
            )}

            {/* Radio Options */}
            {currentQuestion.type === 'radio' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      responses[currentQuestion.id] === option
                        ? 'bg-cyan-500/20 border-cyan-400'
                        : 'bg-slate-800/30 border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={responses[currentQuestion.id] === option}
                      onChange={(e) => handleResponse(e.target.value)}
                      className="w-5 h-5 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-slate-900"
                    />
                    <span className="text-white flex-1">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Scale Input */}
            {currentQuestion.type === 'scale' && (
              <div className="space-y-4">
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  value={responses[currentQuestion.id] || currentQuestion.min}
                  onChange={(e) => handleResponse(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{currentQuestion.min} - Can wait</span>
                  <span className="text-3xl font-bold text-cyan-400">
                    {responses[currentQuestion.id] || currentQuestion.min}
                  </span>
                  <span>{currentQuestion.max} - Losing sleep</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-6 bg-slate-800/50 border-t border-cyan-500/20 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {step === totalQuestions - 1 ? (
                <>
                  Generate Report
                  <Sparkles className="w-5 h-5" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Nav - Desktop */}
        <div className="mt-6 hidden lg:flex justify-center gap-2 flex-wrap">
          {formSections.map((section, idx) => {
            const sectionStart = formSections.slice(0, idx).reduce((sum, s) => sum + s.questions.length, 0);
            const sectionEnd = sectionStart + section.questions.length;
            const isActive = step >= sectionStart && step < sectionEnd;
            const isComplete = step >= sectionEnd;

            return (
              <button
                key={section.id}
                onClick={() => setStep(sectionStart)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-white'
                    : isComplete
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-slate-800/50 text-gray-400 border border-slate-700 hover:border-cyan-500/50'
                }`}
              >
                {section.icon} {section.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
        <p>© 2026 AiMpact Technology • Progress auto-saves locally</p>
      </div>
    </div>
  );
}
