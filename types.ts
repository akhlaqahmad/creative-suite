export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface EmailCampaign {
  subject: string;
  body: string;
  image: string | null;
}
