'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Code2, Database, Zap, Shield } from 'lucide-react'

export default function ApiDocsPage() {
  const endpoints = [
    {
      method: 'POST',
      path: '/api/emails/classify',
      description: 'Classify a single email using the trained model',
      example: {
        request: {
          email: {
            subject: 'Urgent: Server Down',
            from: 'alerts@company.com',
            body: 'Production server is down...',
          },
        },
        response: {
          category: 'urgent',
          confidence: 0.98,
          timestamp: '2024-03-26T10:30:00Z',
        },
      },
    },
    {
      method: 'POST',
      path: '/api/batch/classify',
      description: 'Classify multiple emails in a batch',
      example: {
        request: {
          emails: [
            { id: '1', subject: '...', from: '...', body: '...' },
            { id: '2', subject: '...', from: '...', body: '...' },
          ],
        },
        response: {
          results: [
            { id: '1', category: 'urgent', confidence: 0.98 },
            { id: '2', category: 'important', confidence: 0.91 },
          ],
        },
      },
    },
    {
      method: 'GET',
      path: '/api/model/metrics',
      description: 'Get current model performance metrics',
      example: {
        response: {
          accuracy: 0.87,
          precision: 0.86,
          recall: 0.88,
          f1Score: 0.87,
          lastUpdated: '2024-03-26T10:00:00Z',
        },
      },
    },
    {
      method: 'POST',
      path: '/api/feedback',
      description: 'Submit feedback on classification predictions',
      example: {
        request: {
          emailId: '123',
          predictedCategory: 'important',
          actualCategory: 'urgent',
          feedback: 'Model underestimated urgency',
        },
        response: {
          status: 'accepted',
          feedbackId: 'fb_456',
        },
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            API Documentation
          </h1>
          <p className="text-muted-foreground">
            Integrate InboxAI email classification API into your applications
          </p>
        </div>

        {/* Getting Started */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Getting Started
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Base URL
              </h3>
              <code className="block bg-secondary/50 text-foreground p-3 rounded-lg font-mono text-sm">
                https://api.triagea.ai/v1
              </code>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Authentication
              </h3>
              <p className="text-muted-foreground mb-2">
                All API requests require authentication using an API key. Include it in the Authorization header:
              </p>
              <code className="block bg-secondary/50 text-foreground p-3 rounded-lg font-mono text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Real-time Classification
            </h3>
            <p className="text-sm text-muted-foreground">
              Get instant predictions with sub-100ms latency
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Batch Processing
            </h3>
            <p className="text-sm text-muted-foreground">
              Classify up to 1000 emails in a single request
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Enterprise Security
            </h3>
            <p className="text-sm text-muted-foreground">
              End-to-end encryption and compliance with GDPR
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Feedback Loop
            </h3>
            <p className="text-sm text-muted-foreground">
              Submit corrections to continuously improve accuracy
            </p>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            API Endpoints
          </h2>

          {endpoints.map((endpoint, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded ${
                    endpoint.method === 'POST'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-blue-500/10 text-blue-400'
                  }`}
                >
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-foreground bg-secondary/50 px-3 py-1 rounded">
                  {endpoint.path}
                </code>
              </div>

              <p className="text-foreground mb-4">
                {endpoint.description}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Example Request
                  </h4>
                  <pre className="bg-secondary/50 text-foreground p-4 rounded-lg overflow-x-auto text-xs font-mono">
                    {JSON.stringify(endpoint.example.request, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Example Response
                  </h4>
                  <pre className="bg-secondary/50 text-foreground p-4 rounded-lg overflow-x-auto text-xs font-mono">
                    {JSON.stringify(endpoint.example.response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error Handling */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Error Handling
          </h2>
          <div className="space-y-3">
            {[
              { code: '200', message: 'Success' },
              { code: '400', message: 'Bad request - Invalid parameters' },
              { code: '401', message: 'Unauthorized - Invalid API key' },
              { code: '429', message: 'Rate limit exceeded' },
              { code: '500', message: 'Server error - Please retry' },
            ].map((error, idx) => (
              <div key={idx} className="flex gap-4 py-2">
                <code className="text-sm font-mono text-red-400 min-w-fit">
                  {error.code}
                </code>
                <span className="text-sm text-muted-foreground">
                  {error.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rate Limits */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Rate Limits
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-foreground">Free Plan</span>
              <span className="text-muted-foreground">100 requests/minute</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-foreground">Pro Plan</span>
              <span className="text-muted-foreground">1000 requests/minute</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-foreground">Enterprise</span>
              <span className="text-muted-foreground">Unlimited</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
