begin;
INSERT INTO Schools(name, country, city) VALUES ('School1', 'Country1', 'City1');
INSERT INTO Modules(name, schoolid, grade) VALUES ('Module1', 1, 1);
INSERT INTO Enrolls(userid, moduleid) VALUES (1, 1);
INSERT INTO Teaches(userid, moduleid) VALUES (2, 1);
commit;
