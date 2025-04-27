import { render, screen } from '@testing-library/react';
import ProfilePage from '../ProfilePage';

describe('Profile Page', () => {
    it('renders the profile header', () => {
        render(<ProfilePage />);
        const headerElement = screen.getByText(/profile/i);
        expect(headerElement).toBeInTheDocument();
    });

    it('displays user information correctly', () => {
        const mockUser = { name: 'John Doe', email: 'john.doe@example.com' };
        render(<ProfilePage user={mockUser} />);
        const nameElement = screen.getByText(/john doe/i);
        const emailElement = screen.getByText(/john.doe@example.com/i);
        expect(nameElement).toBeInTheDocument();
        expect(emailElement).toBeInTheDocument();
    });

    it('renders an edit button', () => {
        render(<ProfilePage />);
        const editButton = screen.getByRole('button', { name: /edit profile/i });
        expect(editButton).toBeInTheDocument();
    });

    it('shows a loading state when data is being fetched', () => {
        render(<ProfilePage isLoading={true} />);
        const loadingElement = screen.getByText(/loading/i);
        expect(loadingElement).toBeInTheDocument();
    });

    it('displays an error message when there is an error', () => {
        render(<ProfilePage error="Failed to load profile" />);
        const errorElement = screen.getByText(/failed to load profile/i);
        expect(errorElement).toBeInTheDocument();
    });
});