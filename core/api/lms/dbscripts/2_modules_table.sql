CREATE TABLE Modules(id SERIAL PRIMARY KEY, 
  name text,
  schoolid int references Schools(id),
  grade int check(grade > 0),
  unique(name, schoolid));
