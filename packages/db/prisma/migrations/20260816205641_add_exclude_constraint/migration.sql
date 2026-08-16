-- Habilitar extensión btree_gist si no está habilitada
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Agregar restricción de exclusión en booking_items para evitar solapamiento de reservas de un mismo profesional
ALTER TABLE booking_items
ADD CONSTRAINT no_overlapping_professional_bookings
EXCLUDE USING gist (
    professional_id WITH =,
    tsrange(start_time, end_time) WITH &&
);