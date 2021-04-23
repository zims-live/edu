begin;
CREATE SCHEMA LMS;

CREATE TABLE LMS.Schools(
  id SERIAL PRIMARY KEY, 
  name text NOT NULL,
  country text, 
  city text, 
  unique(name, country, city)
);

CREATE TABLE LMS.Modules(
  id SERIAL PRIMARY KEY, 
  name text not NULL,
  schoolid int references LMS.Schools(id) not NULl,
  grade int check(grade >= 0),
  startDate date not NULL DEFAULT CURRENT_DATE,
  endDate date not NULL DEFAULT CURRENT_DATE,
  check(startDate <= endDate),
  unique(name, schoolid)
);

CREATE TABLE LMS.Teaches(
  id SERIAL PRIMARY KEY, 
  userid int references Auth.Users(id) NOT NULL,
  moduleid int references LMS.Modules(id) NOT NULL,
  unique(userid, moduleid)
);

CREATE TABLE LMS.Classes(
  id serial primary key,
  teachesid int references LMS.Teaches(id),
  startTime time NOT NULL,
  endTime time NOT NULL
);

CREATE TABLE LMS.Enrolls(
  id SERIAL PRIMARY KEY, 
  userid int references Auth.Users(id) NOT NULL,
  moduleid int references LMS.Modules(id) NOT NULL,
  classid int references LMS.Classes(id) NOT NULL,
  unique(userid, moduleid)
);
commit;
