import { fireEvent, render, screen } from '@testing-library/react';
import { mockSubmission } from 'factories/submissions';
import SubmissionPanel from './SubmissionPanel';

describe('SubmissionPanel', () => {
  it('renders the right basic information and controls', () => {
    render(<SubmissionPanel submission={mockSubmission} />);
    expect(screen.queryAllByText('Started').length).toBe(0);
    expect(screen.queryAllByText('Progress').length).toBe(0);
    expect(screen.getByText('Details'));
    expect(screen.getAllByRole('button').length).toBe(1);
    expect(screen.getAllByRole('link').length).toBe(2);
  });

  it('can launch and close the dialog', () => {
    render(<SubmissionPanel submission={mockSubmission} />);
    fireEvent.click(screen.getByText('Details'));
    expect(screen.getByText('Sandbox form details'));
    expect(screen.getByRole('dialog'));

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Sandbox form details')).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
