import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import fetchMock from 'jest-fetch-mock';
import AIDevEnvironment, { AppProvider } from './App'; // Zakładamy, że AIDevEnvironment jest wyeksportowany

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
    i18n: { changeLanguage: jest.fn() }
  })
}));

fetchMock.enableMocks();

describe('AIDevEnvironment', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    localStorage.clear();
  });

  it('renders login panel when not authenticated', () => {
    render(
      <AppProvider>
        <AIDevEnvironment />
      </AppProvider>
    );

    expect(screen.getByText('login')).toBeInTheDocument();
    expect(screen.getByLabelText('username')).toBeInTheDocument();
    expect(screen.getByLabelText('password')).toBeInTheDocument();
  });

  it('logs in successfully and shows main UI', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ token: 'mocked-token' }));

    render(
      <AppProvider>
        <AIDevEnvironment />
      </AppProvider>
    );

    fireEvent.change(screen.getByLabelText('username'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('login'));

    await waitFor(() => {
      expect(screen.getByText('app_title')).toBeInTheDocument();
      expect(localStorage.getItem('jwtToken')).toBe('mocked-token');
    });
  });

  it('shows error on failed login', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: 'Nieprawidłowa nazwa użytkownika lub hasło' }), { status: 401 });

    render(
      <AppProvider>
        <AIDevEnvironment />
      </AppProvider>
    );

    fireEvent.change(screen.getByLabelText('username'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('login'));

    await waitFor(() => {
      expect(screen.getByText('login_failed')).toBeInTheDocument();
    });
  });

  it('generates code and downloads ZIP with valid token', async () => {
    localStorage.setItem('jwtToken', 'mocked-token');
    fetchMock.mockResponses(
      [new Blob(['zip-content'], { type: 'application/zip' }), { status: 200, headers: { 'content-type': 'application/zip' } }],
      [JSON.stringify({ generatedCode: 'const App = () => <div>Hello</div>;' }), { status: 200 }]
    );

    render(
      <AppProvider>
        <AIDevEnvironment />
      </AppProvider>
    );

    fireEvent.change(screen.getByLabelText('describe_project'), { target: { value: 'Create a React app' } });
    fireEvent.click(screen.getByText('generate_with_ai'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3000/api/generate-code',
        expect.any(Object)
      );
      expect(screen.getByText('Projekt wygenerowany! Pobrano plik ZIP. Sprawdź zakładkę "Podgląd".')).toBeInTheDocument();
    });
  });

  it('shows unauthorized error and redirects to login', async () => {
    localStorage.setItem('jwtToken', 'invalid-token');
    fetchMock.mockResponseOnce(JSON.stringify({ error: 'Nieprawidłowy lub wygasły token' }), { status: 401 });

    render(
      <AppProvider>
        <AIDevEnvironment />
      </AppProvider>
    );

    fireEvent.change(screen.getByLabelText('describe_project'), { target: { value: 'Create a React app' } });
    fireEvent.click(screen.getByText('generate_with_ai'));

    await waitFor(() => {
      expect(screen.getByText('login')).toBeInTheDocument();
      expect(localStorage.getItem('jwtToken')).toBeNull();
    });
  });
});
