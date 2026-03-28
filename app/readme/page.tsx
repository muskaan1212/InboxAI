'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CheckCircle2 } from 'lucide-react'

export default function ReadmePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            InboxAI Documentation
          </h1>
          <p className="text-lg text-muted-foreground">
            Professional ML Training Platform for Email Classification
          </p>
        </div>

        {/* Table of Contents */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Table of Contents
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            {[
              'Overview',
              'Getting Started',
              'Features',
              'Dashboard Guide',
              'Training Tasks',
              'Model Grading',
              'API Integration',
              'Best Practices',
              'FAQ',
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-accent">→</span>
                <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-accent transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overview */}
          <section id="overview">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Overview
            </h2>
            <div className="rounded-lg border border-border bg-card/50 p-6 text-muted-foreground space-y-4">
              <p>
                InboxAI is an enterprise-grade ML training platform designed specifically for email triage and classification tasks. It provides tools for data curation, model training, evaluation, and deployment.
              </p>
              <p>
                Whether you&apos;re building an internal email management system or training models for customer support automation, InboxAI streamlines the entire workflow from data collection to model deployment.
              </p>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Getting Started
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Create Your Account',
                  desc: 'Sign up and set up your workspace to begin building your email classification model.',
                },
                {
                  step: '2',
                  title: 'Import Email Data',
                  desc: 'Upload your email dataset or connect to your email provider to start collecting training data.',
                },
                {
                  step: '3',
                  title: 'Label Your Data',
                  desc: 'Use the dashboard to categorize emails and build your training dataset.',
                },
                {
                  step: '4',
                  title: 'Train Your Model',
                  desc: 'Configure training parameters and launch model training.',
                },
                {
                  step: '5',
                  title: 'Evaluate Performance',
                  desc: 'Use the grader to evaluate model performance and iterate.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-lg border border-border bg-card/50 p-6"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section id="features">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Real-time Email Classification',
                'Batch Processing Support',
                'Interactive Dashboard',
                'Advanced Metrics Visualization',
                'Feedback Loop Integration',
                'REST API Access',
                'Model Version Control',
                'Performance Analytics',
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Dashboard Guide */}
          <section id="dashboard-guide">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Dashboard Guide
            </h2>
            <div className="rounded-lg border border-border bg-card/50 p-6 text-muted-foreground space-y-4">
              <p>
                The dashboard provides a comprehensive view of your training progress and model performance. Key sections include:
              </p>
              <ul className="space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Metrics Overview:</strong> Real-time statistics on your dataset and model performance
                </li>
                <li>
                  <strong className="text-foreground">Email Observations:</strong> Browse and review individual emails from your training set
                </li>
                <li>
                  <strong className="text-foreground">Classification View:</strong> See how your model categorizes emails
                </li>
                <li>
                  <strong className="text-foreground">Confidence Scores:</strong> Monitor model confidence for each prediction
                </li>
              </ul>
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Best Practices
            </h2>
            <div className="space-y-3">
              {[
                'Use a balanced dataset with representative examples from each category',
                'Validate your model on a separate test set before deployment',
                'Monitor performance metrics and retrain regularly with new data',
                'Implement feedback loops to catch and correct misclassifications',
                'Start with a simple model and incrementally add complexity',
                'Document your training process and model versions',
              ].map((practice, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-4"
                >
                  <span className="text-accent font-bold flex-shrink-0">•</span>
                  <p className="text-foreground text-sm">{practice}</p>
                </div>
              ))}
            </div>
          </section>

          {/* API Integration */}
          <section id="api-integration">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              API Integration
            </h2>
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <p className="text-muted-foreground mb-4">
                InboxAI provides a comprehensive REST API for integrating email classification into your applications. Visit the API Documentation page for detailed endpoint specifications and examples.
              </p>
              <a
                href="/api-docs"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
              >
                View API Docs →
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How much data do I need to train a model?',
                  a: 'We recommend at least 500-1000 labeled examples per category for best results. The more diverse and representative your data, the better your model will perform.',
                },
                {
                  q: 'What email formats are supported?',
                  a: 'InboxAI supports standard email formats including plain text and HTML. We automatically parse subject lines, sender information, and body content.',
                },
                {
                  q: 'Can I export my trained model?',
                  a: 'Yes, you can export your models in standard ML formats and integrate them into your own systems using our API.',
                },
                {
                  q: 'Is my data secure?',
                  a: 'All data is encrypted in transit and at rest. InboxAI is GDPR compliant and follows enterprise security best practices.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-card/50 p-4"
                >
                  <h4 className="font-semibold text-foreground mb-2">
                    {item.q}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-6">
            Begin training your email classification model today
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Launch Dashboard →
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}
