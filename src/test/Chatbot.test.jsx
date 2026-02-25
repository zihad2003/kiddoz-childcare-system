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
        // Look for the "How can I help you today?" text
        expect(screen.getByText(/How can I help you today/i)).toBeInTheDocument();
    });

    it('opens the chat window when clicked', () => {
        render(
            <BrowserRouter>
                <Chatbot user={null} />
            </BrowserRouter>
        );

        const button = screen.getByText(/How can I help you today/i).closest('div');
        fireEvent.click(button);

        // Check for "Helpful Staff Online"
        expect(screen.getByText('Helpful Staff Online')).toBeInTheDocument();
    });

    it('sends a structured message and displays the correct local response', async () => {
        render(
            <BrowserRouter>
                <Chatbot user={null} />
            </BrowserRouter>
        );

        // Open chat
        const button = screen.getByText(/How can I help you today/i).closest('div');
        fireEvent.click(button);

        // Find input
        const input = screen.getByPlaceholderText('Type your question...');
        // Use a known question from KIDDOZ_QA
        fireEvent.change(input, { target: { value: 'What are your operating hours?' } });

        // Send
        const sendBtn = screen.getByTestId('send-button');
        fireEvent.click(sendBtn);

        // Check if user message appears
        expect(screen.getByText('What are your operating hours?')).toBeInTheDocument();

        // Wait for structured bot response (handling the 700ms setTimeout)
        await waitFor(() => {
            expect(screen.getByText(/We are open Sunday through Thursday/i)).toBeInTheDocument();
        }, { timeout: 2000 });
    });

    it('displays a fallback message for unrecognized general questions', async () => {
        render(
            <BrowserRouter>
                <Chatbot user={null} />
            </BrowserRouter>
        );

        // Open chat
        const button = screen.getByText(/How can I help you today/i).closest('div');
        fireEvent.click(button);

        // Find input
        const input = screen.getByPlaceholderText('Type your question...');
        fireEvent.change(input, { target: { value: 'Some unknown question' } });

        // Send
        const sendBtn = screen.getByTestId('send-button');
        fireEvent.click(sendBtn);

        // Wait for fallback response (handling the 1000ms setTimeout)
        await waitFor(() => {
            expect(screen.getByText(/I'm sorry, I don't have a specific answer/i)).toBeInTheDocument();
        }, { timeout: 2000 });
    });
});
