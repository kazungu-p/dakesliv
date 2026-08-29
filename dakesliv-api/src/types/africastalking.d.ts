declare module 'africastalking' {
  interface AfricasTalkingOptions {
    apiKey: string | undefined;
    username: string | undefined;
  }

  interface SmsSendOptions {
    to: string[];
    message: string;
    from?: string;
  }

  interface WhatsAppSendOptions {
    waNumber: string | undefined;
    phoneNumber: string;
    body: { message: string };
  }

  interface AfricasTalkingClient {
    SMS: { send(options: SmsSendOptions): Promise<unknown> };
    WHATSAPP: { sendMessage(options: WhatsAppSendOptions): Promise<unknown> };
  }

  function africastalking(options: AfricasTalkingOptions): AfricasTalkingClient;
  export = africastalking;
}
