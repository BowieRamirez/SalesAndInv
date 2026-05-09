CREATE TABLE IF NOT EXISTS public.order_chat_messages (
  id text PRIMARY KEY,
  inquiry_id text NOT NULL REFERENCES public.customer_inquiries(id) ON DELETE CASCADE,
  sender_user_id text REFERENCES public.users(id) ON DELETE SET NULL,
  sender_role text NOT NULL CHECK (sender_role IN ('CLIENT', 'SALES')),
  body text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_chat_attachments (
  id text PRIMARY KEY,
  message_id text NOT NULL REFERENCES public.order_chat_messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  attachment_type text NOT NULL CHECK (attachment_type IN ('IMAGE', 'DOCUMENT', 'QUOTATION', 'RECEIPT')),
  data_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_chat_messages_inquiry_created_idx
  ON public.order_chat_messages (inquiry_id, created_at);

CREATE INDEX IF NOT EXISTS order_chat_attachments_message_idx
  ON public.order_chat_attachments (message_id);
