'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowRight, Zap, Database, BarChart3, Brain } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Train Your Email
              <span className="block text-accent">Triage AI Model</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              InboxAI is a professional ML training platform for email classification. Curate datasets, train models, and evaluate performance with enterprise-grade tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Launch Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/api-docs"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary/10 transition-colors"
              >
                View API Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Powerful Features for ML Teams
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to train and optimize your email classification models
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature Cards */}
          <div className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Training</h3>
            <p className="text-sm text-muted-foreground">
              Train custom ML models with labeled email data
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Dataset Curation</h3>
            <p className="text-sm text-muted-foreground">
              Organize and manage training datasets efficiently
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Performance Metrics</h3>
            <p className="text-sm text-muted-foreground">
              Track accuracy, precision, and recall in real-time
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Fast Evaluation</h3>
            <p className="text-sm text-muted-foreground">
              Get instant feedback on model performance
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Ready to build your model?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start with sample emails and build your training pipeline today
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
