export default function UserGuidePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">User Guide</h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        {/* Getting Started */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Welcome to MailSplit! MailSplit is an email management dashboard designed to help you route customer emails to the right teams efficiently. With AI-powered assignment and intelligent search, managing your customer communications has never been easier.
            </p>
            <div className="bg-accent/30 border border-border rounded-lg p-4 space-y-2">
              <h3 className="text-lg font-medium text-foreground">Company Selector</h3>
              <p>
                At the top-right of the dashboard, you'll find the company selector. If you manage multiple companies (e.g., MegaTech, TechCorp), you can easily switch between them using this dropdown. All emails and teams are scoped to the selected company.
              </p>
            </div>
          </div>
        </section>

        {/* Email Management */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Email Management</h2>

          <div className="space-y-4 text-muted-foreground">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Receiving Emails</h3>
              <p>
                Each company has a unique email address that automatically syncs to MailSplit. The format is:
              </p>
              <div className="bg-accent/50 border border-border rounded-md px-4 py-2 font-mono text-sm">
                companyname@institutional-mouse.resend.app
              </div>
              <p>
                For example, if your company is called "MegaTech", your email address would be:
              </p>
              <div className="bg-accent/50 border border-border rounded-md px-4 py-2 font-mono text-sm">
                megatech@institutional-mouse.resend.app
              </div>
              <p className="text-sm">
                When customers send emails to this address, they automatically appear in your MailSplit dashboard and sync to Supabase.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Viewing Emails</h3>
              <p>
                Navigate to the <span className="font-semibold">Emails</span> page (the home page) to see all emails for your selected company. Emails are displayed as cards showing:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Sender information</li>
                <li>Subject line</li>
                <li>Preview of the email content</li>
                <li>Date received</li>
                <li>Assigned team(s), if any</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Email Details</h3>
              <p>
                Click on any email card to view its full details. On the detail page, you can:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Read the complete email content</li>
                <li>Assign the email to one or more teams</li>
                <li>Add notes for team collaboration</li>
                <li>View the assignment reason (if auto-assigned by AI)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Assigning to Teams</h3>
              <p>
                From the email detail page, use the team dropdown selector to assign the email to one or multiple teams. MailSplit also features AI-powered auto-assignment that analyzes email content and routes it to the most appropriate team based on:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Email content and keywords</li>
                <li>Team specializations (products and issues they handle)</li>
                <li>Historical patterns</li>
              </ul>
              <p className="text-sm">
                Auto-assigned emails are clearly marked with "Auto-generated with Algolia" for transparency. You can always manually override these assignments.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Adding Notes</h3>
              <p>
                Use the notes section on the email detail page to add contextual information or instructions for your team. This is helpful for collaboration and providing context about customer issues.
              </p>
            </div>
          </div>
        </section>

        {/* Team Management */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Team Management</h2>

          <div className="space-y-4 text-muted-foreground">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">What are Teams?</h3>
              <p>
                Teams are groups within your organization that handle specific products and types of customer issues. Each team has:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li><span className="font-semibold">Team Name:</span> A unique identifier for the team</li>
                <li><span className="font-semibold">Description:</span> Details about what the team does, including email-to-responsibility mapping</li>
                <li><span className="font-semibold">Products:</span> List of products or services the team supports</li>
                <li><span className="font-semibold">Issues Handled:</span> Types of customer issues the team manages</li>
                <li><span className="font-semibold">Contact Emails:</span> One or more email addresses for team members</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Creating Teams Manually</h3>
              <p>
                Navigate to the <span className="font-semibold">Teams</span> page and click the <span className="font-semibold">Create Team</span> button. Fill in the team creation form with:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Team name (required)</li>
                <li>Description</li>
                <li>Products (add multiple by pressing Enter after each one)</li>
                <li>Issues handled (add multiple by pressing Enter after each one)</li>
                <li>Contact email addresses (can add multiple)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Upload Document to Auto-Create Team</h3>
              <p>
                Save time by uploading a document containing team information! Click the <span className="font-semibold">Upload Document</span> button on the Teams page.
              </p>
              <p>
                <span className="font-semibold">Supported file formats:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>PDF (.pdf)</li>
                <li>Plain text (.txt)</li>
                <li>Word documents (.docx)</li>
                <li>Markdown (.md)</li>
              </ul>
              <p>
                MailSplit uses AI (OpenAI GPT or Anthropic Claude) to automatically extract:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Team name</li>
                <li>Team description with email-to-responsibility mapping</li>
                <li>Products</li>
                <li>Issues handled</li>
                <li>Contact email addresses</li>
              </ul>
              <p className="text-sm">
                After uploading, review the auto-filled form and make any necessary adjustments before saving the team.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Viewing Team Details</h3>
              <p>
                Click on any team card to view its complete information, including all products, issues handled, and contact details.
              </p>
            </div>
          </div>
        </section>

        {/* Search Features */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Search Features</h2>

          <div className="space-y-4 text-muted-foreground">
            <p>
              MailSplit includes powerful Algolia-powered search functionality located in the header (center of the top bar).
            </p>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Searching Emails and Teams</h3>
              <p>
                Use the search bar to quickly find:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Emails by sender, subject, or content</li>
                <li>Teams by name, products, or issues they handle</li>
              </ul>
              <p className="text-sm">
                The intelligent search understands context and finds relevant results even with partial matches or typos.
              </p>
            </div>
          </div>
        </section>

        {/* Tips & Best Practices */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Tips & Best Practices</h2>

          <div className="space-y-3 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <span className="font-semibold">Set up teams first</span> - Before emails start arriving, create your teams so that AI-powered assignment can work effectively.
              </li>
              <li>
                <span className="font-semibold">Be specific with team descriptions</span> - Include detailed information about what each team handles to improve auto-assignment accuracy.
              </li>
              <li>
                <span className="font-semibold">Use notes liberally</span> - Add context to emails to help your team members understand customer issues quickly.
              </li>
              <li>
                <span className="font-semibold">Review auto-assignments</span> - While AI is powerful, always verify that emails are routed correctly, especially in the beginning.
              </li>
              <li>
                <span className="font-semibold">Upload team documents</span> - If you have existing team documentation, use the document upload feature to quickly populate team information.
              </li>
            </ul>
          </div>
        </section>

        {/* Support */}
        <section className="space-y-4 pb-8">
          <h2 className="text-2xl font-semibold">Need Help?</h2>
          <div className="bg-accent/30 border border-border rounded-lg p-4 space-y-2">
            <p className="text-muted-foreground">
              If you encounter any issues or have questions about using MailSplit, please reach out to your administrator or check the project documentation.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
