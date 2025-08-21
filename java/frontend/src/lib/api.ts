import type { Course } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status} ${response.statusText}${text ? `: ${text}` : ''}`);
  }
  return response.json() as Promise<T>;
}

export function getCourses(): Promise<Course[]> {
  return http<Course[]>('/courses');
}

export function searchCourses(query: string): Promise<Course[]> {
  const q = encodeURIComponent(query);
  return http<Course[]>(`/courses/search?q=${q}`);
}


