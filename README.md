# WeatherTop

**WeatherTop** is a weather application developed as part of my Bachelor's degree in Media Informatics during the second semester. It provides real-time weather updates for cities using the [OpenWeatherMap API](https://openweathermap.org/api).

## Features
- User accounts (be aware: passwords are saved in clear text).
- Create your own weather stations or add real city names for fetching weather data via API.
- Get current weather for real cities.
- Displays temperature, humidity, wind speed, and more.
- Built with Node.js and Express.
- Data is stored in PostgreSQL.

## Technologies
- **Node.js & Express**: Backend server.
- **PostgreSQL**: Database for storing user and weather data.
- **OpenWeatherMap API**: Fetches real-time weather data.

## Demo
You can try out **WeatherTop** on my server (if it's currently online). Visit the website here: [WeatherTop Demo](https://weathertop.tizian-zimmermann.de)

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/Tizi006/WeatherTop.git
```
### 2. Setup .env
```bash
# .env file
PORT=80
DB_CON_STRING=postgres://POSTGRES_USER:POSTGRES_PASSWORD@weathertop-postgres17:5432/POSTGRES_DB
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
API_KEY=
```
### 3. Compose
```bash
docker-compose up -d
```

