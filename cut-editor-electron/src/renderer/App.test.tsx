import { render, screen, waitFor } from '@testing-library/react';
import { App } from './App';

// Mock the electronAPI
const mockGetAppConfig = jest.fn();

beforeAll(() => {
  Object.defineProperty(window, 'electronAPI', {
    value: {
      getAppConfig: mockGetAppConfig,
    },
    writable: true,
  });
});

describe('App', () => {
  it('renders loading state initially', () => {
    mockGetAppConfig.mockReturnValueOnce(new Promise(() => {})); // Never resolve to keep it loading
    render(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders Layout after successful app config fetch', async () => {
    mockGetAppConfig.mockResolvedValueOnce({
      appName: 'Test App',
      appVersion: '1.0.0',
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Test App/i)).toBeInTheDocument(); // Assuming Layout renders appName
    });
  });

  it('renders error message if app config fetch fails', async () => {
    mockGetAppConfig.mockRejectedValueOnce(new Error('Failed to fetch config'));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to Initialize App/i)).toBeInTheDocument();
    });
  });
});
