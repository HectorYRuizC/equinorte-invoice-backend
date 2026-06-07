-- =========================
-- FACTURAS
-- =========================

INSERT INTO invoice (subtotal, total_iva, total)
VALUES (150000, 28500, 178500);

INSERT INTO invoice (subtotal, total_iva, total)
VALUES (220000, 41800, 261800);


-- =========================
-- DETALLES FACTURA 1
-- =========================

INSERT INTO invoice_details (product_name, price, iva, total, invoice_id)
VALUES ('Excavadora Caterpillar 320D (Alquiler diario)', 80000, 15200, 95200, 1);

INSERT INTO invoice_details (product_name, price, iva, total, invoice_id)
VALUES ('Mezcladora de concreto industrial (Alquiler diario)', 40000, 7600, 47600, 1);

INSERT INTO invoice_details (product_name, price, iva, total, invoice_id)
VALUES ('Andamios metálicos (Paquete semanal)', 30000, 5700, 35700, 1);


-- =========================
-- DETALLES FACTURA 2
-- =========================

INSERT INTO invoice_details (product_name, price, iva, total, invoice_id)
VALUES ('Compactadora de suelo (Alquiler diario)', 70000, 13300, 83300, 2);

INSERT INTO invoice_details (product_name, price, iva, total, invoice_id)
VALUES ('Generador eléctrico 15kVA (Alquiler diario)', 90000, 17100, 107100, 2);

INSERT INTO invoice_details (product_name, price, iva, total, invoice_id)
VALUES ('Vibrador de concreto (Alquiler diario)', 60000, 11400, 71400, 2);