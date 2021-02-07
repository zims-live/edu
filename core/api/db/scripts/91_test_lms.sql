begin;
INSERT INTO LMS.Schools(name, country, city) VALUES ('School1', 'Country1', 'City1');
INSERT INTO LMS.Modules(name, schoolid, grade) VALUES ('Module1', 1, 1);
INSERT INTO LMS.Enrolls(userid, moduleid) VALUES (1, 1);
INSERT INTO LMS.Teaches(userid, moduleid) VALUES (1, 1);
commit;
