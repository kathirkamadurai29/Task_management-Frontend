import sys
import os

# Add root project directory to sys.path so 'app' package is always found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
