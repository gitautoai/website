export const isolatedComponentTest = `
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';
import * as userService from '../services/userService';

// Mock external dependencies
jest.mock('../services/userService');
const mockUserService = userService as jest.Mocked<typeof userService>;

describe('UserProfile', () => {
  beforeEach(() => {
    mockUserService.fetchUser.mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('should display user name when loaded', async () => {
    render(<UserProfile userId={1} />);
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
  });
});`;
