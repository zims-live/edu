CREATE TABLE Users(id SERIAL PRIMARY KEY, handle varchar(255) UNIQUE, firstname text, lastname text, email text UNIQUE, password text);
