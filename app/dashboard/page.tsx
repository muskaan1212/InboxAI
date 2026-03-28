'use client'

import { useState, useCallback, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { stepAction, resetEnvironment, StepAction, StepResponse } from '@/hooks/use-api'
import {
  MOCK_EMAILS,
  INITIAL_MOCK_STATE,
  gradeMockAction,
  EnvState,
  EmailObservation,
} from '@/lib/data/mock-env'
import {
  Zap,
  RotateCcw,
  Mail,
  Clock,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Layers,
  BarChart2,
  ChevronRight,
  Bot,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type ActionType = 'classify' | 'reply' | 'escalate'
type Priority = 'low' | 'medium' | 'high'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function priorityColor(p: string) {
  if (p === 'high' || p === 'critical') return 'text-red-400 bg-red-500/10 border-red-500/30'
  if (p === 'medium') return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
}

function senderTypeColor(t: string) {
  if (t === 'automated') return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  if (t === 'external') return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  if (t === 'internal') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  return 'text-slate-400 bg-slate-500/10 border-slate-500/30'
}

function rewardColor(r: number) {
  if (r >= 0.8) return 'text-emerald-400'
  if (r >= 0.5) return 'text-amber-400'
  return 'text-red-400'
}

function ScoreMeter({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100)
  const color =
    pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── JSON viewer ─────────────────────────────────────────────────────────────

function JsonBlock({ data }: { data: unknown }) {
  return (
    <pre className="font-mono text-xs leading-5 text-emerald-300 overflow-auto max-h-72 p-4 bg-[#0a0f1a] rounded-xl border border-emerald-500/10 scrollbar-thin">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

// ─── Stat badge ──────────────────────────────────────────────────────────────

function StatBadge({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent ?? 'bg-secondary'}`}>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground font-mono">{value}</p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [useMock, setUseMock] = useState(true)
  const [mockState, setMockState] = useState<EnvState>(INITIAL_MOCK_STATE)
  const [emailIndex, setEmailIndex] = useState(0)

  // Action form state
  const [actionType, setActionType] = useState<ActionType>('classify')
  const [priority, setPriority] = useState<Priority>('medium')
  const [responseText, setResponseText] = useState('')

  // Result state
  const [lastResult, setLastResult] = useState<StepResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Live observation to display
  const currentObs: EmailObservation = useMock
    ? mockState.current_observation
    : ({} as EmailObservation)

  const handleRunStep = useCallback(async () => {
    setIsRunning(true)
    setError(null)

    const action: StepAction = { action_type: actionType, priority, response_text: responseText }

    if (useMock) {
      // Simulate API latency
      await new Promise((r) => setTimeout(r, 600))
      const result = gradeMockAction(currentObs, actionType, priority, responseText)
      const nextIdx = (emailIndex + 1) % MOCK_EMAILS.length
      const done = nextIdx === 0

      setLastResult({
        reward: result.reward,
        done,
        info: result.info,
        observation: MOCK_EMAILS[nextIdx],
      })
      setMockState((prev) => ({
        ...prev,
        step: prev.step + 1,
        actions_taken: prev.actions_taken + 1,
        cumulative_reward: parseFloat((prev.cumulative_reward + result.reward).toFixed(2)),
        done,
        current_observation: MOCK_EMAILS[nextIdx],
        last_result: result,
        accuracy:
          (prev.accuracy * prev.actions_taken + (result.info.total_score >= 0.7 ? 1 : 0)) /
          (prev.actions_taken + 1),
      }))
      setEmailIndex(nextIdx)
    } else {
      try {
        const res = await stepAction(action)
        setLastResult(res)
      } catch (e) {
        setError('Backend unavailable — switch to Mock mode above.')
      }
    }

    setIsRunning(false)
  }, [actionType, priority, responseText, useMock, currentObs, emailIndex])

  const handleReset = useCallback(async () => {
    setLastResult(null)
    setError(null)
    setResponseText('')
    if (useMock) {
      setMockState(INITIAL_MOCK_STATE)
      setEmailIndex(0)
    } else {
      try {
        await resetEnvironment()
      } catch {
        setError('Reset failed — backend may be offline.')
      }
    }
  }, [useMock])

  const isDone = useMock ? mockState.done : lastResult?.done ?? false

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Environment Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              InboxIQ · Interactive Email Triage Simulation
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Mode:</span>
            <button
              onClick={() => setUseMock((v) => !v)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                useMock
                  ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {useMock ? '⚡ Mock Simulation' : '🌐 Live Backend'}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatBadge
            label="Step"
            value={`${mockState.step} / ${mockState.max_steps}`}
            icon={Layers}
            accent="bg-violet-500/10"
          />
          <StatBadge
            label="Cumulative Reward"
            value={mockState.cumulative_reward.toFixed(2)}
            icon={BarChart2}
            accent="bg-emerald-500/10"
          />
          <StatBadge
            label="Actions Taken"
            value={mockState.actions_taken}
            icon={Zap}
            accent="bg-blue-500/10"
          />
          <StatBadge
            label="Accuracy"
            value={`${Math.round(mockState.accuracy * 100)}%`}
            icon={CheckCircle2}
            accent="bg-amber-500/10"
          />
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── LEFT: Observation ── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Email header card */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Current Observation</span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {currentObs.email_id}
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Metadata row */}
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${priorityColor(
                      currentObs.priority_hint
                    )}`}
                  >
                    {currentObs.priority_hint?.toUpperCase()} PRIORITY
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${senderTypeColor(
                      currentObs.sender_type
                    )}`}
                  >
                    {currentObs.sender_type}
                  </span>
                  {currentObs.has_attachments && (
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border text-slate-400 bg-slate-500/10 border-slate-500/30">
                      📎 attachment
                    </span>
                  )}
                </div>

                {/* From / Subject */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground w-14 shrink-0">From</span>
                    <span className="text-foreground font-medium truncate">{currentObs.sender}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground w-14 shrink-0">Subject</span>
                    <span className="text-foreground font-semibold">{currentObs.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground w-14 shrink-0">Time</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {currentObs.timestamp}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="rounded-xl bg-secondary/30 border border-border p-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-mono text-xs">
                  {currentObs.body}
                </div>

                {/* Labels */}
                {currentObs.labels?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {currentObs.labels.map((l) => (
                      <span
                        key={l}
                        className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* JSON viewer */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
                <span className="text-sm font-semibold text-foreground">Observation JSON</span>
                <span className="ml-auto text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                  raw
                </span>
              </div>
              <div className="p-4">
                <JsonBlock data={currentObs} />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Action Panel + Result ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Action panel */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
                <Bot className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Action Panel</span>
              </div>

              <div className="p-5 space-y-5">
                {/* Action Type */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Action Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['classify', 'reply', 'escalate'] as ActionType[]).map((a) => (
                      <button
                        key={a}
                        id={`action-${a}`}
                        onClick={() => setActionType(a)}
                        disabled={isDone || isRunning}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 ${
                          actionType === a
                            ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                            : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'low', cls: 'emerald' },
                      { val: 'medium', cls: 'amber' },
                      { val: 'high', cls: 'red' },
                    ].map(({ val, cls }) => (
                      <button
                        key={val}
                        id={`priority-${val}`}
                        onClick={() => setPriority(val as Priority)}
                        disabled={isDone || isRunning}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 ${
                          priority === val
                            ? cls === 'emerald'
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : cls === 'amber'
                              ? 'bg-amber-600 border-amber-500 text-white'
                              : 'bg-red-600 border-red-500 text-white'
                            : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response text */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Response Text
                  </label>
                  <textarea
                    id="response-text"
                    rows={4}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    disabled={isDone || isRunning}
                    placeholder="Write your response or classification reasoning here…"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-foreground text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none disabled:opacity-40 transition-all"
                  />
                </div>

                {/* Run Step button */}
                <button
                  id="run-step-btn"
                  onClick={handleRunStep}
                  disabled={isDone || isRunning}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isRunning ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Running Step…
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Run Step
                      <ChevronRight className="w-4 h-4 opacity-60" />
                    </>
                  )}
                </button>

                {isDone && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
                    <p className="text-emerald-400 text-sm font-medium">
                      ✅ Session complete! Click Reset to start over.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3">
                    <p className="text-red-400 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {error}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Result card ── */}
            {lastResult && (
              <div className="rounded-2xl border border-border bg-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
                  <BarChart2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Step Result</span>
                  <span
                    className={`ml-auto font-mono text-base font-bold ${rewardColor(lastResult.reward)}`}
                  >
                    +{lastResult.reward.toFixed(2)}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Done / info row */}
                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`px-2.5 py-1 rounded-full font-semibold border ${
                        lastResult.done
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                      }`}
                    >
                      {lastResult.done ? 'done = true' : 'done = false'}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      reward = {lastResult.reward}
                    </span>
                  </div>

                  {/* Score meters */}
                  <div className="space-y-3">
                    <ScoreMeter
                      label="Classification"
                      value={lastResult.info.classification_score / 0.4}
                    />
                    <ScoreMeter
                      label="Priority"
                      value={lastResult.info.priority_score / 0.3}
                    />
                    <ScoreMeter
                      label="Response Quality"
                      value={lastResult.info.response_score / 0.3}
                    />
                  </div>

                  {/* Feedback */}
                  <div className="rounded-xl bg-secondary/40 border border-border p-3 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-medium">Feedback: </span>
                    {lastResult.info.feedback}
                  </div>

                  {/* Correct answers */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-secondary/40 border border-border p-2.5">
                      <p className="text-muted-foreground mb-0.5">Expected action</p>
                      <p className="text-foreground font-mono font-semibold">
                        {lastResult.info.correct_action}
                      </p>
                    </div>
                    <div className="rounded-lg bg-secondary/40 border border-border p-2.5">
                      <p className="text-muted-foreground mb-0.5">Expected priority</p>
                      <p className="text-foreground font-mono font-semibold">
                        {lastResult.info.correct_priority}
                      </p>
                    </div>
                  </div>

                  {/* Full result JSON */}
                  <details className="group">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors list-none flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                      View raw JSON
                    </summary>
                    <div className="mt-3">
                      <JsonBlock data={lastResult} />
                    </div>
                  </details>
                </div>
              </div>
            )}

            {/* Empty result placeholder */}
            {!lastResult && (
              <div className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center">
                <BarChart2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  Step result will appear here after you click <strong>Run Step</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
