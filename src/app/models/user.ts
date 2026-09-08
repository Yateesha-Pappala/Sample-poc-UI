/** The minimal user shape the shell needs to render. Extend for your project. */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: string[];
}
