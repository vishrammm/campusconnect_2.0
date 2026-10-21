USE campus_connect;

-- ============================================
-- USERS
-- ============================================
INSERT INTO users (full_name, email, password_hash, phone, role_id, department) VALUES
('Priya Singh',  'priya@campus.edu',  'hash1', '9876543210', 1, 'CSE'),
('Arjun Mehta',  'arjun@campus.edu',  'hash2', '9876500000', 1, 'ECE'),
('Anita Sharma', 'anita@campus.edu',  'hash3', '9876500001', 3, 'Admin'),
('Rahul Verma',  'rahul@campus.edu',  'hash4', '9876500002', 2, 'Coding Club');

-- ============================================
-- LOST & FOUND
-- ============================================
INSERT INTO items (title, description, category_id, status, location, reported_by) VALUES
('Black Wallet', 'Lost near library', 5, 'lost', 'Central Library', 1),
('Scientific Calculator', 'Found in Lab 3', 1, 'found', 'Lab 3, Block B', 2);

-- ============================================
-- NOTICE BOARD
-- ============================================
INSERT INTO notices (title, content, category_id, priority, posted_by) VALUES
('Mid-Sem Schedule Released', 'Check portal for dates', 2, 'important', 3),
('NSS Drive Next Week', 'Register by Friday', 3, 'normal', 3);

-- ============================================
-- CLUBS & EVENTS
-- ============================================
INSERT INTO clubs (club_name, description) VALUES
('Coding Club', 'Programming & hackathons'),
('Robotics Club', 'Build robots and compete');

INSERT INTO club_members (club_id, user_id, is_co_admin) VALUES
(1, 4, TRUE), (1, 1, FALSE);

INSERT INTO events (club_id, title, description, event_date, venue, created_by) VALUES
(1, 'Hackathon 2026', '24-hour coding event', '2026-11-15 09:00:00', 'Auditorium', 4);

INSERT INTO event_registrations (event_id, user_id) VALUES (1, 1), (1, 2);

-- ============================================
-- MARKETPLACE
-- ============================================
INSERT INTO listings (title, description, category_id, price, condition_grade, seller_id) VALUES
('Calculus Textbook', 'Slightly used', 1, 350.00, 'Good', 1),
('Arduino Starter Kit', 'Complete with sensors', 3, 1200.00, 'Like New', 2);

INSERT INTO listing_inquiries (listing_id, buyer_id, message) VALUES
(1, 2, 'Is it still available?');