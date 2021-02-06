CREATE TABLE Teaches(id SERIAL PRIMARY KEY, 
  userid int references Users(id),
  moduleid int references Modules(id),
  unique(userid, moduleid));
