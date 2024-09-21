import { describe, expect, it, vi } from 'vitest';
import * as emailModule from './email';
import type { EmailSendResult } from '@azure/communication-email';

describe('sendEmail', () => {
	it('should send an email', async () => {
		// Arrange
		const to = 'john.doe@example.com';
		const subject = 'Test Subject';
		const body = 'Test Body';
		const mockedResult: EmailSendResult = {
			id: 'mocked-id',
			status: 'Succeeded',
			error: {
				code: 'mocked-code',
				message: 'mocked-message'
			}
		};

		// Mock the sendEmail function
		const mockSendEmail = vi.spyOn(emailModule, 'sendEmail').mockResolvedValue(mockedResult);

		// Act
		const result = await emailModule.sendEmail(to, subject, body);

		// Assert
		expect(mockSendEmail).toHaveBeenCalledWith(to, subject, body);
		expect(result).toBe(mockedResult);

		// Clean up
		mockSendEmail.mockRestore();
	});
});
