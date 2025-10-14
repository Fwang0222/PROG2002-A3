CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255)
)

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  short_description VARCHAR(255),
  description TEXT,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NULL,
  location_city VARCHAR(120),
  location_venue VARCHAR(200),
  address_line VARCHAR(255),
  ticket_price DECIMAL(10,2) DEFAULT 0.00,
  goal_amount DECIMAL(12,2) DEFAULT 0.00,
  progress_amount DECIMAL(12,2) DEFAULT 0.00,
  image_url VARCHAR(500),
  suspended TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_cat FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_events_dates (start_datetime, end_datetime),
  INDEX idx_events_city (location_city),
  INDEX idx_events_cat (category_id),
  INDEX idx_events_suspended (suspended)
)

CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(40),
  tickets_qty INT NOT NULL,
  registration_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events(id),
  CONSTRAINT uq_reg_event_email UNIQUE (event_id, email)
);

INSERT INTO categories (name, description) VALUES
('Fun Run', 'Community run to raise funds and awareness'),
('Gala', 'Dinner gala with speakers and performances'),
('Auction', 'Silent/live auction of donated items'),
('Concert', 'Live music event to fundraise for a cause');

INSERT INTO events
(category_id, name, short_description, description, start_datetime, end_datetime, location_city, location_venue, address_line, ticket_price, goal_amount, progress_amount, image_url, suspended)
VALUES
(1, 'Run for Education 5K', 'Community 5K to fund school supplies', 'Join us for a family-friendly run supporting local students in need.', '2025-10-05 08:00:00', '2025-10-05 11:00:00', 'Sydney', 'Centennial Park', 'Grand Dr, Centennial Park NSW', 20.00, 10000.00, 2500.00, '/images/charity-4.png', 0),
(2, 'Spring Gala', 'Black-tie dinner & auction', 'An elegant evening featuring a keynote, dinner, and a mini auction to support clinics.', '2025-11-15 18:30:00', '2025-11-15 22:30:00', 'Melbourne', 'Royal Exhibition Building', '9 Nicholson St, Carlton VIC', 120.00, 50000.00, 8000.00, '/images/charity-2.png', 0),
(3, 'Silent Auction Night', 'Bid on eco-friendly items', 'All proceeds go to native tree planting and community gardens.', '2025-09-10 17:00:00', '2025-09-10 20:00:00', 'Brisbane', 'City Hall', '64 Adelaide St, Brisbane City QLD', 0.00, 15000.00, 15000.00, '/images/charity-5.png', 0),
(4, 'Concert for the Coast', 'Indie bands for ocean cleanup', 'Live music to fund beach cleanup drives and marine education.', '2025-12-03 19:00:00', '2025-12-03 22:00:00', 'Perth', 'Riverside Theatre', '21 Mounts Bay Rd, Perth WA', 45.00, 30000.00, 9000.00, '/images/charity-1.png', 0),
(1, 'City Park 10K', '10K challenge in the park', 'Bring laptops to rural classrooms with this 10K race.', '2025-08-20 07:30:00', '2025-08-20 10:30:00', 'Sydney', 'Hyde Park', 'Elizabeth St, Sydney NSW', 25.00, 12000.00, 11800.00, '/images/charity-7.png', 0),
(2, 'Lights of Hope Dinner', 'Formal dinner with live quartet', 'Support maternal health initiatives.', '2025-09-01 19:00:00', '2025-09-01 22:00:00', 'Melbourne', 'Town Hall Ballroom', '90-130 Swanston St, Melbourne VIC', 150.00, 60000.00, 42000.00, '/images/charity-6.png', 0),
(3, 'Art for Good Auction', 'Local artists donate work', 'Bid on paintings, sculptures, and prints; funds go to wildlife corridors.', '2025-10-22 18:00:00', '2025-10-22 21:00:00', 'Adelaide', 'Art Gallery Atrium', 'North Terrace, Adelaide SA', 10.00, 20000.00, 3000.00, '/images/charity-3.png', 0),
(4, 'Buskers for Community', 'Open-air mini concert series', 'Street performers gather funds for neighbourhood projects.', '2025-07-05 16:00:00', '2025-07-05 19:00:00', 'Hobart', 'Salamanca Place', 'Salamanca Pl, Hobart TAS', 0.00, 8000.00, 8200.00, '/images/charity-8.png', 1);

INSERT INTO registrations
(event_id, full_name, email, phone, tickets_qty, registration_datetime, amount_paid)
VALUES
(1, 'Alice Nguyen', 'alice@mail.com', '+61-400-111-001', 2, '2025-09-28 09:15:00', 40.00),
(1, 'Brian O''Connor', 'brian@mail.com', '+61-400-111-002', 1, '2025-09-29 14:02:00', 20.00),
(1, 'Cathy Lin', 'cathy@mail.com', '+61-400-111-003', 3, '2025-10-01 10:48:00', 60.00),
(2, 'Daniel Kim', 'daniel@mail.com', '+61-400-222-001', 1, '2025-10-10 18:01:00', 120.00),
(2, 'Emily Zhang', 'emily@mail.com', '+61-400-222-002', 2, '2025-10-12 09:23:00', 240.00),
(2, 'Oliver Stone', 'oliver@mail.com', '+61-400-222-003', 3, '2025-10-13 19:05:00', 360.00),
(3, 'Frank Li', 'frank@mail.com', '+61-400-333-001', 1, '2025-08-30 16:39:00', 0.00),
(3, 'Grace Turner', 'grace@mail.com', '+61-400-333-002', 2, '2025-09-05 12:10:00', 0.00),
(4, 'Hannah Brown', 'hannah@mail.com', '+61-400-444-001', 2, '2025-10-20 20:20:00', 90.00),
(4, 'Ivan Petrov', 'ivan@mail.com', '+61-400-444-002', 1, '2025-10-25 08:33:00', 45.00),
(5, 'Jade Williams', 'jade@mail.com', '+61-400-555-001', 1, '2025-08-10 07:50:00', 25.00),
(5, 'Ken Adams', 'ken@mail.com', '+61-400-555-002', 4, '2025-08-15 13:11:00', 100.00),
(6, 'Lily Chen', 'lily@mail.com', '+61-400-666-001', 1, '2025-08-25 19:55:00', 150.00),
(7, 'Marco Rossi', 'marco@mail.com', '+61-400-777-001', 2, '2025-10-18 18:20:00', 20.00),
(7, 'Natalie Park', 'natalie@mail.com', '+61-400-777-002', 5, '2025-10-19 10:00:00', 50.00),
(8, 'Oscar Diaz', 'oscar@mail.com', '+61-400-888-001', 1, '2025-06-30 16:40:00', 0.00);
