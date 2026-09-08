import { Signal, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { ApiResult } from '../../core/http/api-client';

/**
 * Test helpers for the example pages. `mockResult()` returns the same
 * `{ data, loading, error }` shape as `ApiClient`, so pages are written exactly
 * as they would be against a real backend — swap the mock service for a real one
 * and the templates don't change.
 */
export function mockResult<T>(value: T, latencyMs = 400): ApiResult<T> {
  const data = signal<T | null>(null);
  const loading = signal(true);
  const error = signal(null);

  (of(value).pipe(delay(latencyMs)) as Observable<T>).subscribe({
    next: (v) => data.set(v),
    complete: () => loading.set(false),
  });

  return { data: data.asReadonly(), loading: loading.asReadonly(), error: error.asReadonly() };
}

/** A resolved result with no latency — handy for synchronous example state. */
export function resolved<T>(value: T): ApiResult<T> {
  return {
    data: signal(value).asReadonly() as Signal<T | null>,
    loading: signal(false).asReadonly(),
    error: signal(null).asReadonly(),
  };
}

// --- Sample domain data -----------------------------------------------------

export type ResourceStatus = 'active' | 'draft' | 'archived';

export interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  status: ResourceStatus;
  owner: string;
  version: string;
  details: string;
  steps: string[];
}

export const RESOURCES: Resource[] = [
  {
    id: 1,
    name: 'Contract Analyzer',
    description: 'Extracts key clauses, dates and obligations from uploaded contracts.',
    category: 'Documents',
    status: 'active',
    owner: 'Priya Nair',
    version: '2.4.1',
    details:
      'Upload a PDF or Word contract and the analyzer returns a structured summary: parties, effective dates, renewal terms, liability caps and notable clauses, each linked back to its source paragraph.',
    steps: [
      'Open the workspace and drop a contract file onto the upload area.',
      'Wait for the parse to finish — larger documents take a few seconds.',
      'Review the extracted fields; click any value to jump to its source text.',
      'Export the summary as CSV or copy it into your notes.',
    ],
  },
  {
    id: 2,
    name: 'Support Triage',
    description: 'Classifies inbound tickets by topic and urgency and drafts a first reply.',
    category: 'Support',
    status: 'active',
    owner: 'Diego Alvarez',
    version: '1.9.0',
    details:
      'Connects to your ticket queue, tags each new ticket with a topic and a priority, routes it to the right group, and writes a suggested response an agent can edit and send.',
    steps: [
      'Connect a queue from the Settings tab.',
      'New tickets are triaged automatically as they arrive.',
      'Agents review the suggested reply and priority, then approve or adjust.',
    ],
  },
  {
    id: 3,
    name: 'Meeting Notes',
    description: 'Turns a recording or transcript into decisions, action items and owners.',
    category: 'Productivity',
    status: 'active',
    owner: 'Sarah Kim',
    version: '3.1.2',
    details:
      'Paste a transcript or upload an audio file. Returns a clean summary, a decisions list, and action items with owners and due dates you can push to your task tracker.',
    steps: [
      'Upload the recording or paste the transcript.',
      'Review the summary and action items.',
      'Send action items to your tracker.',
    ],
  },
  {
    id: 4,
    name: 'Revenue Forecast',
    description: 'Projects the next four quarters from historical pipeline and close rates.',
    category: 'Analytics',
    status: 'draft',
    owner: 'Tom Becker',
    version: '0.6.0',
    details:
      'Still in development. Wire up a pipeline data source to preview projected bookings with confidence bands.',
    steps: [
      'Connect a pipeline source.',
      'Choose a forecast horizon.',
      'Review projections and export.',
    ],
  },
  {
    id: 5,
    name: 'Onboarding Assistant',
    description: 'Answers new-hire questions from your internal handbook and policies.',
    category: 'HR',
    status: 'active',
    owner: 'Lena Fischer',
    version: '1.2.5',
    details:
      'A chat assistant grounded in your handbook, benefits docs and IT guides so new hires get consistent answers on day one.',
    steps: [
      'Index your handbook from Settings.',
      'Share the assistant link with new hires.',
      'Review unanswered questions weekly.',
    ],
  },
  {
    id: 6,
    name: 'Invoice Matcher',
    description: 'Reconciles incoming invoices against purchase orders and flags mismatches.',
    category: 'Finance',
    status: 'archived',
    owner: 'Raj Patel',
    version: '2.0.0',
    details:
      'Archived — superseded by the finance team’s ERP integration. Kept here for reference.',
    steps: ['Import invoices and POs.', 'Review flagged mismatches.'],
  },
];

export const RESOURCE_VERSIONS = [
  { id: '2.4.1', label: '2.4.1', badge: 'Active' },
  { id: '2.4.0', label: '2.4.0' },
  { id: '2.3.2', label: '2.3.2' },
  { id: '2.3.0', label: '2.3.0' },
  { id: '2.2.0', label: '2.2.0', hint: 'not built' },
];

// --- People (data-table example) -------------------------------------------

export type PersonStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED';

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: 'Admin' | 'Member' | 'Viewer';
  status: PersonStatus;
  joinedAt: string;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const FIRST = [
  'Ada',
  'Grace',
  'Alan',
  'Katherine',
  'Linus',
  'Margaret',
  'Dennis',
  'Barbara',
  'Ken',
  'Radia',
  'Guido',
  'Shafi',
];
const LAST = [
  'Lovelace',
  'Hopper',
  'Turing',
  'Johnson',
  'Torvalds',
  'Hamilton',
  'Ritchie',
  'Liskov',
  'Thompson',
  'Perlman',
  'van Rossum',
  'Goldwasser',
];
const COMPANIES = [
  'Northwind',
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella',
  'Hooli',
  'Soylent',
  'Stark Industries',
];
const ROLES: Person['role'][] = ['Admin', 'Member', 'Member', 'Viewer'];
const STATUSES: PersonStatus[] = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'INVITED', 'SUSPENDED'];

export const PEOPLE: Person[] = Array.from({ length: 47 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 3) % LAST.length];
  return {
    id: i + 1,
    firstName: first,
    lastName: last,
    email: `${first}.${last}`.toLowerCase().replace(/\s/g, '') + '@example.com',
    company: COMPANIES[i % COMPANIES.length],
    role: ROLES[i % ROLES.length],
    status: STATUSES[i % STATUSES.length],
    joinedAt: new Date(Date.UTC(2025, (i * 2) % 12, ((i * 7) % 27) + 1)).toISOString(),
  };
});

// --- Daily activity (analytics example) -----------------------------------

export interface DailyPoint {
  label: string;
  value: number;
}

export function dailySeries(days: number): DailyPoint[] {
  const out: DailyPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const base = 1800 + Math.sin(i / 3) * 900 + (i % 7 === 0 ? -700 : 0);
    out.push({
      label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: Math.max(0, Math.round(base + Math.random() * 600)),
    });
  }
  return out;
}
