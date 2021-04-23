begin;
INSERT INTO Auth.Users(handle, firstname, lastname, email, password) 
  VALUES ('davie', 'Davie', 'Davie', 'davie@test.com', '$argon2i$v=19$m=4096,t=3,p=1$vuPOjbWQI1RFIkQkGtjj+A$RYR+KExY7kmWdhz1m5W92ED+naKUGUiRGDnX5ZAzibk');
commit;
