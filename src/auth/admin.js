// Google accounts that can open the admin page.
// Keep in sync with isAdmin() in firestore.rules, which is what actually protects the data.
export const ADMIN_EMAILS = ['gina@lagomdevelopment.com', 'egab629@gmail.com']

export function isAdmin(user) {
  return Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))
}
