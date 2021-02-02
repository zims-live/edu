CREATE TABLE Modules(id SERIAL PRIMARY KEY, 
  name text not NULL,
  schoolid int references Schools(id) not NULl,
  grade int check(grade > 0),
  startDate date not NULL,
  endDate date not NULL,
  unique(name, schoolid));
