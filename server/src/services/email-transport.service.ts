export type EmailMessage = {
  subject: string;
  text: string;
  to: string;
};

export type EmailTransport = {
  send(message: EmailMessage): Promise<void>;
};

const consoleEmailTransport: EmailTransport = {
  async send(message) {
    console.log('[email:dev] Outgoing email');
    console.log(`To: ${message.to}`);
    console.log(`Subject: ${message.subject}`);
    console.log(message.text);
  },
};

export const emailTransport = consoleEmailTransport;
