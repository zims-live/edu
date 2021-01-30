CREATE TABLE Schools(id SERIAL PRIMARY KEY, name text NOT NULL,
  country text, city text, unique(name, country, city));
