CREATE TABLE Enrolls(id SERIAL PRIMARY KEY, 
  userid int,
  moduleid int references Modules(id),
  unique(userid, moduleid));
