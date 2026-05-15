from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {
        "message": "FiveM Story Engine Backend Running"
    }