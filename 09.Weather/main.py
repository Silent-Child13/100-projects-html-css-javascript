from fastapi import FastAPI, Depends
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import pytz

# Define Pydantic model
class WeatherCreate(BaseModel):
    city: str
    temperature: float
    feels_like: float
    description: str

# Database setup
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:sergiu2002@localhost:3306/weather_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define Weather Model
class Weather(Base):
    __tablename__ = 'weather_data'
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(255), index=True)
    temperature = Column(Float)
    feels_like = Column(Float)
    description = Column(String(255))
    search_time = Column(DateTime, default=datetime.now(pytz.timezone('Europe/Chisinau')))

Base.metadata.create_all(bind=engine)

# FastAPI instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Save weather data to DB
@app.post("/weather/")
async def save_weather(weather: WeatherCreate, db: Session = Depends(get_db)):
    try:
        local_tz = pytz.timezone('Europe/Chisinau')
        local_time = datetime.now(local_tz)
        
        new_weather = Weather(
            city=weather.city,
            temperature=weather.temperature,
            feels_like=weather.feels_like,
            description=weather.description,
            search_time=local_time
        )
        db.add(new_weather)
        db.commit()
        db.refresh(new_weather)
        return new_weather
    except Exception as e:
        print(f"Error saving weather data: {e}")
        return {"error": str(e)}

@app.get("/weather/")
def get_weather_data(db: Session = Depends(get_db)):
    try:
        weather_data = db.query(Weather).all()  # Query all weather data
        return weather_data
    except Exception as e:
        print(f"Error retrieving weather data: {e}")
        return {"error": str(e)}
