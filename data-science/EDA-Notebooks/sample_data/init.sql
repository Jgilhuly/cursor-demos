-- Initialize movie database for webinar demo

CREATE TABLE movies (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    year INTEGER NOT NULL,
    duration_minutes INTEGER,
    budget_millions DECIMAL(10,2),
    revenue_millions DECIMAL(10,2),
    genre_primary VARCHAR(50),
    rating DECIMAL(3,1),
    director VARCHAR(100)
);

CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100),
    age INTEGER,
    country VARCHAR(50),
    subscription_type VARCHAR(20),
    joined_date DATE
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) REFERENCES users(id),
    movie_id VARCHAR(20) REFERENCES movies(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    review_text TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO movies VALUES 
('m_1001', 'The Matrix', 1999, 136, 63, 467, 'Action', 8.7, 'Lana Wachowski'),
('m_2001', 'Barbie', 2023, 114, 145, 1446, 'Comedy', 7.2, 'Greta Gerwig'),
('m_3001', 'Inception', 2010, 148, 160, 836, 'Action', 8.8, 'Christopher Nolan'),
('m_4001', 'Blade Runner 2049', 2017, 164, 150, 259, 'Action', 8.0, 'Denis Villeneuve'),
('m_5001', 'Parasite', 2019, 132, 11, 263, 'Drama', 8.6, 'Bong Joon-ho'),
('m_6001', 'Avengers Endgame', 2019, 181, 356, 2798, 'Action', 8.4, 'Anthony Russo'),
('m_7001', 'Joker', 2019, 122, 55, 1074, 'Drama', 8.4, 'Todd Phillips'),
('m_8001', 'Dune', 2021, 155, 165, 402, 'Sci-Fi', 8.0, 'Denis Villeneuve'),
('m_9001', 'Spider-Man No Way Home', 2021, 148, 200, 1921, 'Action', 8.2, 'Jon Watts'),
('m_10001', 'Everything Everywhere All at Once', 2022, 139, 25, 143, 'Comedy', 7.8, 'Daniels');

INSERT INTO users VALUES 
('u_001', 'Alice Johnson', 28, 'USA', 'premium', '2023-01-15'),
('u_002', 'Bob Smith', 34, 'Canada', 'basic', '2023-02-20'),
('u_003', 'Charlie Brown', 22, 'UK', 'premium', '2023-03-10'),
('u_004', 'Diana Prince', 29, 'Australia', 'basic', '2023-04-05'),
('u_005', 'Ethan Hunt', 35, 'USA', 'premium', '2023-05-12');

INSERT INTO ratings VALUES 
(1, 'u_001', 'm_1001', 9, 'Amazing movie, loved the action scenes!', '2024-01-15 14:35:00'),
(2, 'u_002', 'm_2001', 7, 'Fun comedy, great for family viewing.', '2024-01-16 20:15:00'),
(3, 'u_003', 'm_3001', 6, 'Too confusing for me, stopped halfway.', '2024-01-15 19:30:00'),
(4, 'u_001', 'm_4001', 8, 'Great sequel to Blade Runner.', '2024-01-16 10:20:00'),
(5, 'u_004', 'm_5001', 10, 'Masterpiece! Watched it twice.', '2024-01-16 12:45:00'),
(6, 'u_005', 'm_6001', 9, 'Epic conclusion to the Marvel saga.', '2024-01-17 15:30:00'),
(7, 'u_002', 'm_7001', 8, 'Dark but compelling character study.', '2024-01-17 18:45:00'),
(8, 'u_003', 'm_8001', 7, 'Visually stunning, slow paced.', '2024-01-18 14:20:00');

-- Create indexes for better query performance (demo optimization)
CREATE INDEX idx_movies_year ON movies(year);
CREATE INDEX idx_movies_genre ON movies(genre_primary);
CREATE INDEX idx_ratings_user ON ratings(user_id);
CREATE INDEX idx_ratings_movie ON ratings(movie_id);
CREATE INDEX idx_ratings_rating ON ratings(rating); 