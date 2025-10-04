import { Email, Team } from "./types";

export const mockEmails: Email[] = [
  {
    id: "1",
    from: "john.doe@example.com",
    subject: "Issue with payment processing",
    preview: "I'm experiencing difficulties with the checkout process...",
    content: "Hello, I'm experiencing difficulties with the checkout process. When I try to complete my purchase, the payment gateway times out. I've tried multiple credit cards and the same issue persists. Can you please help?",
    date: "2024-03-15T10:30:00Z",
    company_id: 1,
    assignedTeam: "Payments Team",
    assignmentReason: "Payment-related issue detected. Keywords: 'payment processing', 'checkout', 'payment gateway'. The Payments Team specializes in billing system issues, payment failures, and transaction problems.",
    notes: "Customer is using Safari browser"
  },
  {
    id: "2",
    from: "sarah.smith@company.com",
    subject: "Product feature request",
    preview: "Would love to see integration with Slack...",
    content: "Hi team, would love to see integration with Slack for our workflow. This would really help our team stay connected and get notifications in real-time. Is this something you're planning to add?",
    date: "2024-03-15T09:15:00Z",
    company_id: 1,
    assignedTeam: "Engineering",
    assignmentReason: "Feature request and integration inquiry. Keywords: 'integration', 'Slack', 'workflow'. The Engineering Team handles API integrations, new feature implementations, and technical product enhancements.",
  },
  {
    id: "3",
    from: "mike.johnson@startup.io",
    subject: "Account access problem",
    preview: "Unable to log in to my account since yesterday...",
    content: "I've been unable to log in to my account since yesterday. I keep getting an 'Invalid credentials' error even though I'm certain my password is correct. I've tried resetting it but haven't received the reset email.",
    date: "2024-03-15T08:45:00Z",
    company_id: 1,
    assignedTeam: "Customer Support",
    assignmentReason: "Account access and authentication issue. Keywords: 'unable to log in', 'invalid credentials', 'account'. The Customer Support Team handles account access problems, password resets, and general customer inquiries.",
  },
  {
    id: "4",
    from: "emily.brown@enterprise.com",
    subject: "Enterprise plan inquiry",
    preview: "Looking for information about enterprise pricing...",
    content: "Hello, I'm the CTO at Enterprise Corp and we're interested in your enterprise plan. Could you provide details about custom pricing, SLA guarantees, and dedicated support options for teams of 500+ users?",
    date: "2024-03-14T16:20:00Z",
    company_id: 1,
    assignedTeam: "Sales Team",
    assignmentReason: "Enterprise-level inquiry requiring sales expertise. Keywords: 'enterprise plan', 'pricing', 'CTO', '500+ users'. The Sales Team manages enterprise inquiries, custom solutions, pricing discussions, and high-value client relationships.",
  },
  {
    id: "5",
    from: "alex.wilson@tech.com",
    subject: "Bug report: Dashboard not loading",
    preview: "The dashboard shows a blank screen after login...",
    content: "After logging in, the dashboard shows a blank screen. I can see the sidebar but the main content area is completely empty. I've tried clearing my cache and using different browsers. Screenshots attached.",
    date: "2024-03-14T14:10:00Z",
    company_id: 1,
    assignedTeam: "Engineering",
    assignmentReason: "Technical bug report. Keywords: 'bug', 'dashboard not loading', 'blank screen'. The Engineering Team handles bugs, performance issues, and technical platform problems requiring code-level investigation.",
    notes: "Reproduced on Chrome 122"
  },
];

export const mockTeams: Team[] = [
  {
    team_name: "Customer Support",
    description: "Handles general customer inquiries and account issues",
    products: ["Platform", "Mobile App", "Web App"],
    issues_handled: ["Account access", "General questions", "Onboarding"],
    contact_email: "support@company.com",
    company_id: 1
  },
  {
    team_name: "Payments Team",
    description: "Manages billing, payments, and subscription issues",
    products: ["Payment Gateway", "Billing System"],
    issues_handled: ["Payment failures", "Refunds", "Subscription changes", "Invoicing"],
    contact_email: "payments@company.com",
    company_id: 1
  },
  {
    team_name: "Engineering",
    description: "Handles technical bugs and platform issues",
    products: ["All Products"],
    issues_handled: ["Bugs", "Performance issues", "API problems", "Integration issues"],
    contact_email: "engineering@company.com",
    company_id: 1
  },
  {
    team_name: "Sales Team",
    description: "Manages enterprise inquiries and product demos",
    products: ["Enterprise Plan", "Professional Plan"],
    issues_handled: ["Pricing inquiries", "Product demos", "Custom solutions", "Upgrades"],
    contact_email: "sales@company.com",
    company_id: 1
  },
];
