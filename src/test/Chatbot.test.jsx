import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Chatbot from '../components/ai/Chatbot';
import { vi } from 'vitest';
import api from '../services/api';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('../services/api', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn()
    }
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Chatbot Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the chat button initially (closed state)', () => {
        render(
            <BrowserRouter>
                <Chatbot user={null} />
            </BrowserRouter>
        );
        // Look for the "Ask AI about KiddoZ!" text or icon
        expect(screen.getByText(/Ask AI about KiddoZ/i)).toBeInTheDocument();
    });

    it('opens the chat window when clicked', () => {
        render(
            <BrowserRouter>
                <Chatbot user={null} />
            </BrowserRouter>
        );

        const button = screen.getByText(/Ask AI about KiddoZ/i).closest('div');
        fireEvent.click(button);

        // Check for "General Assistant Online"
        expect(screen.getByText('General Assistant Online')).toBeInTheDocument();
    });

    it('sends a message and displays response', async () => {
        // Mock API response
        api.post.mockResolvedValue({ text: 'I am a bot response' });

        render(
            <BrowserRouter>
                <Chatbot user={null} />
            </BrowserRouter>
        );

        // Open chat
        const button = screen.getByText(/Ask AI about KiddoZ/i).closest('div');
        fireEvent.click(button);

        // Find input
        const input = screen.getByPlaceholderText('Type your question...');
        fireEvent.change(input, { target: { value: 'Hello AI' } });

        // Send
        const sendBtn = screen.getByTestId('send-button');
        fireEvent.click(sendBtn);

        // Check if user message appears
        expect(screen.getByText('Hello AI')).toBeInTheDocument();

        // Wait for bot response
        await waitFor(() => {
            expect(screen.getByText('I am a bot response')).toBeInTheDocument();
        });
    });
});
