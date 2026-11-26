CREATE TABLE IF NOT EXISTS product_images (
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  path text NOT NULL CHECK (path LIKE '/images/%'),
  alt text NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  PRIMARY KEY (product_id, path)
);
