import { render, screen } from '@testing-library/react';
import ProfilePage from './ProfilePage'; // Import the ProfilePage component

test('renders the profile page with user information', () => {
  render(<ProfilePage />); // Render the ProfilePage component

  // Check if the user profile section is displayed
  const profileHeader = screen.getByText(/Welcome/i);
  expect(profileHeader).toBeInTheDocument();
});