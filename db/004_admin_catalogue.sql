ALTER TABLE products ADD COLUMN editor_revision uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE variants ADD COLUMN sale_price_minor integer;
ALTER TABLE variants ADD CONSTRAINT variants_sale_below_price
  CHECK (sale_price_minor IS NULL OR (sale_price_minor > 0 AND sale_price_minor < price_minor));

CREATE TABLE product_image_uploads (
  id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_name text NOT NULL,
  content bytea NOT NULL CHECK (octet_length(content) > 0 AND octet_length(content) <= 2097152)
);
CREATE INDEX product_image_uploads_product ON product_image_uploads (product_id);
