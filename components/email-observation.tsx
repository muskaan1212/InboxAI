'use client'

import { Email } from '@/lib/data/emails'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock } from 'lucide-react'

interface EmailObservationProps {
  email: Email
  onSelect?: (email: Email) => void
  isSelected?: boolean
}

const categoryColors: Record<Email['category'], string> = {
  urgent: 'bg-red-500/10 text-red-400 border-red-500/30',
  important: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  'follow-up': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  archive: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  spam: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
}

export function EmailObservation({
  email,
  onSelect,
  isSelected = false,
}: EmailObservationProps) {
  return (
    <button
      onClick={() => onSelect?.(email)}
      className={`w-full text-left rounded-lg border p-4 transition-colors ${
        isSelected
          ? 'border-accent bg-accent/5'
          : 'border-border hover:border-accent/50 hover:bg-secondary/5'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Status Indicator */}
        <div className="mt-1">
          {email.status === 'reviewed' ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Clock className="w-5 h-5 text-yellow-500" />
          )}
        </div>

        {/* Email Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {email.subject}
            </h3>
            <Badge
              variant="outline"
              className={`whitespace-nowrap ml-2 ${categoryColors[email.category]}`}
            >
              {email.category}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground mb-2">
            {email.from} • {email.timestamp}
          </p>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {email.preview}
          </p>

          {/* Confidence Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${email.confidence * 100}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {(email.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
