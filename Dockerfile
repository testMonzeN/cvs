FROM python:3.10-slim

RUN apt-get update && apt-get install -y gcc

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "cvs.wsgi:application"]
