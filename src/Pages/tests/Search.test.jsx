import { render, screen, fireEvent } from '@testing-library/react';
import SearchPage from '../SearchPage';

describe('Search Page', () => {
    it('renders the search input field', () => {
        render(<SearchPage />);
        const inputElement = screen.getByPlaceholderText(/search/i);
        expect(inputElement).toBeInTheDocument();
    });

    it('updates the input value when typing', () => {
        render(<SearchPage />);
        const inputElement = screen.getByPlaceholderText(/search/i);
        fireEvent.change(inputElement, { target: { value: 'test query' } });
        expect(inputElement.value).toBe('test query');
    });

    it('calls the onSearch callback when the search button is clicked', () => {
        const mockOnSearch = vi.fn();
        render(<SearchPage onSearch={mockOnSearch} />);
        const inputElement = screen.getByPlaceholderText(/search/i);
        const buttonElement = screen.getByRole('button', { name: /search/i });

        fireEvent.change(inputElement, { target: { value: 'test query' } });
        fireEvent.click(buttonElement);

        expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    it('displays a message when no results are found', () => {
        render(<SearchPage results={[]} />);
        const noResultsMessage = screen.getByText(/no results found/i);
        expect(noResultsMessage).toBeInTheDocument();
    });

    it('renders search results when provided', () => {
        const mockResults = ['Result 1', 'Result 2', 'Result 3'];
        render(<SearchPage results={mockResults} />);
        mockResults.forEach((result) => {
            expect(screen.getByText(result)).toBeInTheDocument();
        });
    });
});