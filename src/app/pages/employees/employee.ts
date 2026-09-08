/** One employee record. Mirrors the shape a real `EmployeeApi` would return. */
export interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  status: EmployeeStatus;
}

export type EmployeeStatus = 'Active' | 'On Leave';

/** Draft an "Add employee" form produces — the id is assigned by the service. */
export type EmployeeDraft = Omit<Employee, 'id'>;

/** Headline counts shown on the dashboard. */
export interface EmployeeSummary {
  total: number;
  active: number;
  onLeave: number;
  departments: number;
}

/** Seed data for the POC. Kept in memory by `EmployeeService`. */
export const SEED_EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: 'Arun Kumar',
    department: 'Engineering',
    role: 'Software Engineer',
    status: 'Active',
  },
  { id: 2, name: 'Priya Sharma', department: 'HR', role: 'HR Manager', status: 'Active' },
  { id: 3, name: 'Rahul Singh', department: 'Finance', role: 'Accountant', status: 'On Leave' },
  { id: 4, name: 'Ananya Rao', department: 'Engineering', role: 'UI Developer', status: 'Active' },
];

export const EMPLOYEE_STATUSES: EmployeeStatus[] = ['Active', 'On Leave'];
