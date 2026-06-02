import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutForm from '../src/components/CheckoutForm';

describe('CheckoutForm', () => {
  const mockSubmit = vi.fn();

  it('renders all form fields', () => {
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={false} />);

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Delivery Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Place Order')).toBeInTheDocument();
  });

  it('shows validation error for empty name', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={false} />);

    const nameInput = screen.getByLabelText('Full Name');
    await user.click(nameInput);
    await user.tab(); // Trigger blur

    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('shows validation error for short name', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={false} />);

    const nameInput = screen.getByLabelText('Full Name');
    await user.type(nameInput, 'A');
    await user.tab();

    expect(
      screen.getByText('Name must be at least 2 characters')
    ).toBeInTheDocument();
  });

  it('shows validation error for empty address', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={false} />);

    const addressInput = screen.getByLabelText('Delivery Address');
    await user.click(addressInput);
    await user.tab();

    expect(
      screen.getByText('Delivery address is required')
    ).toBeInTheDocument();
  });

  it('shows validation error for invalid phone', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={false} />);

    const phoneInput = screen.getByLabelText('Phone Number');
    await user.type(phoneInput, 'not-a-phone');
    await user.tab();

    expect(
      screen.getByText('Please enter a valid phone number')
    ).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={false} />);

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(
      screen.getByLabelText('Delivery Address'),
      '123 Main Street, Apt 4B'
    );
    await user.type(screen.getByLabelText('Phone Number'), '1234567890');

    await user.click(screen.getByText('Place Order'));

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      address: '123 Main Street, Apt 4B',
      phone: '1234567890',
    });
  });

  it('does not submit with invalid data', async () => {
    const user = userEvent.setup();
    const submitFn = vi.fn();
    render(<CheckoutForm onSubmit={submitFn} isSubmitting={false} />);

    // Click submit without filling any field
    await user.click(screen.getByText('Place Order'));

    expect(submitFn).not.toHaveBeenCalled();
  });

  it('shows loading state when submitting', () => {
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={true} />);

    expect(screen.getByText('Placing Order...')).toBeInTheDocument();
  });

  it('disables inputs when submitting', () => {
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={true} />);

    expect(screen.getByLabelText('Full Name')).toBeDisabled();
    expect(screen.getByLabelText('Delivery Address')).toBeDisabled();
    expect(screen.getByLabelText('Phone Number')).toBeDisabled();
  });
});
