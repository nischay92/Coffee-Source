CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handle text NOT NULL UNIQUE CHECK (handle ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL,
  description text NOT NULL,
  collection text NOT NULL CHECK (collection IN ('green-coffee', 'roasted-coffee', 'signature-blends', 'coffee-gifting')),
  image_path text CHECK (image_path LIKE '/images/%'),
  image_alt text,
  origin text,
  variety text,
  processing text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  sku text NOT NULL UNIQUE,
  grade text,
  roast text,
  format text,
  pack_size text,
  price_minor integer NOT NULL CHECK (price_minor > 0),
  stock integer NOT NULL CHECK (stock >= 0),
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','closed','paid','paid_review','refunded')),
  fulfilment_status text NOT NULL DEFAULT 'pending' CHECK (fulfilment_status IN ('pending','processing','shipped','delivered')),
  tracking_reference text,
  customer jsonb NOT NULL,
  subtotal_minor integer NOT NULL CHECK (subtotal_minor > 0),
  shipping_minor integer NOT NULL CHECK (shipping_minor >= 0),
  currency text NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  razorpay_order_id text UNIQUE,
  reservation_expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id uuid NOT NULL REFERENCES orders(id),
  variant_id uuid NOT NULL REFERENCES variants(id),
  product_title text NOT NULL,
  variant_label text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_minor integer NOT NULL CHECK (price_minor > 0),
  PRIMARY KEY (order_id, variant_id)
);
CREATE INDEX IF NOT EXISTS order_items_variant ON order_items (variant_id);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL CHECK (source IN ('razorpay','paypal','manual')),
  provider_ref text,
  order_id uuid REFERENCES orders(id),
  reference text,
  method text NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  refunded_minor bigint NOT NULL DEFAULT 0 CHECK (refunded_minor >= 0 AND refunded_minor <= amount_minor),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  status text NOT NULL CHECK (status IN ('pending','paid','failed','partially_refunded','refunded')),
  note text,
  recorded_by text,
  occurred_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source, provider_ref)
);
CREATE INDEX IF NOT EXISTS transactions_occurred ON transactions (occurred_at DESC, id DESC);
CREATE UNIQUE INDEX IF NOT EXISTS manual_transaction_reference
  ON transactions (method, currency, reference) WHERE source = 'manual' AND reference IS NOT NULL;

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  contact jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS request_limits (
  key text NOT NULL,
  bucket integer NOT NULL,
  hits integer NOT NULL,
  PRIMARY KEY (key, bucket)
);
