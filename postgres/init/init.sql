-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    surname VARCHAR(100),
    password VARCHAR(255) NOT NULL
);

-- Create Stations Table
CREATE TABLE IF NOT EXISTS stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Create WeatherData Table
CREATE TABLE IF NOT EXISTS weatherdata (
    id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    weathercode INTEGER,
    temperature DOUBLE PRECISION,
    wind DOUBLE PRECISION,
    winddirection DOUBLE PRECISION,
    pressure DOUBLE PRECISION,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);