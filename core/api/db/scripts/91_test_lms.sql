begin;
INSERT INTO LMS.Schools(name, country, city) VALUES ('School1', 'Country1', 'City1');
INSERT INTO LMS.Modules(name, schoolid, grade) VALUES ('Module1', 1, 1);
INSERT INTO LMS.Teaches(userid, moduleid) VALUES (1, 1);
INSERT INTO LMS.Classes(teachesid, starttime, endtime) VALUES (1, '10:00', '12:00');
INSERT INTO LMS.Enrolls(userid, moduleid, classid) VALUES (1, 1, 1);
commit;
