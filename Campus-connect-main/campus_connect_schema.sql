USE campus_connect;

SELECT u.full_name, e.title
FROM event_registrations r
JOIN users u ON u.user_id = r.user_id
JOIN events e ON e.event_id = r.event_id;