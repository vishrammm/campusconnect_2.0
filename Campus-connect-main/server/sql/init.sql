CREATE DATABASE IF NOT EXISTS campus_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_connect;
CREATE TABLE IF NOT EXISTS users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 full_name VARCHAR(120) NOT NULL,
 email VARCHAR(190) NULL,
 username VARCHAR(60) NOT NULL,
 password_hash VARCHAR(255) NOT NULL,
 phone VARCHAR(30) NULL,
 role ENUM('student','co-admin','staff','admin') NOT NULL DEFAULT 'student',
 year VARCHAR(30) NULL, branch VARCHAR(100) NULL, club VARCHAR(100) NULL, title VARCHAR(100) NULL,
 last_login DATETIME NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_users_email (email), UNIQUE KEY uq_users_username (username), UNIQUE KEY uq_users_phone (phone), KEY idx_users_role(role)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS lost_found_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(180) NOT NULL, description TEXT NULL,
 category VARCHAR(80) NOT NULL, status ENUM('lost','found','claimed','security_desk') NOT NULL DEFAULT 'lost',
 location VARCHAR(180) NOT NULL, event_date DATE NULL, reported_by BIGINT UNSIGNED NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_items_reporter FOREIGN KEY(reported_by) REFERENCES users(id) ON DELETE CASCADE,
 KEY idx_items_status(status), KEY idx_items_created(created_at)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS notices (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(220) NOT NULL, content TEXT NOT NULL,
 category VARCHAR(80) NOT NULL DEFAULT 'General', priority ENUM('normal','important') NOT NULL DEFAULT 'normal',
 posted_by BIGINT UNSIGNED NOT NULL, is_published BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_notices_author FOREIGN KEY(posted_by) REFERENCES users(id) ON DELETE CASCADE,
 KEY idx_notices_published(is_published,created_at)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS clubs (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE, description TEXT NULL,
 is_active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS events (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, club_id BIGINT UNSIGNED NULL, name VARCHAR(180) NOT NULL,
 description TEXT NULL, event_date DATE NOT NULL, event_time VARCHAR(30) NULL, venue VARCHAR(180) NOT NULL,
 created_by BIGINT UNSIGNED NOT NULL, is_published BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_events_club FOREIGN KEY(club_id) REFERENCES clubs(id) ON DELETE SET NULL,
 CONSTRAINT fk_events_creator FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE CASCADE,
 KEY idx_events_date(event_date)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS event_registrations (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, event_id BIGINT UNSIGNED NOT NULL, user_id BIGINT UNSIGNED NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY uq_event_user(event_id,user_id),
 CONSTRAINT fk_reg_event FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE,
 CONSTRAINT fk_reg_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS marketplace_listings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(180) NOT NULL, description TEXT NULL,
 category VARCHAR(80) NOT NULL, price DECIMAL(10,2) NOT NULL, condition_label VARCHAR(40) NOT NULL DEFAULT 'Used',
 location VARCHAR(180) NULL, seller_id BIGINT UNSIGNED NOT NULL, is_active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_listing_seller FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE,
 KEY idx_listing_active(is_active,created_at)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS notifications (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id BIGINT UNSIGNED NOT NULL,
 title VARCHAR(180) NOT NULL, message TEXT NOT NULL, type VARCHAR(40) NOT NULL DEFAULT 'general',
 is_read BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_notifications_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 KEY idx_notifications_user(user_id,is_read,created_at)
) ENGINE=InnoDB;
INSERT IGNORE INTO clubs(name,description) VALUES
 ('Coding Club','Programming, workshops and hackathons'),('Robotics Club','Robotics, automation and competitions'),
 ('IEEE Student Branch','Technical events and professional development'),('Cultural Club','Arts, music, dance and campus culture'),
 ('Sports Club','Campus sports and tournaments'),('E-Cell','Entrepreneurship and innovation'),('NSS','Community service and volunteering');
