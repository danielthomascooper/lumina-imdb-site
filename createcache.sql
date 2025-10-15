CREATE TABLE movie_info (
  code varchar(9) PRIMARY KEY,
  title varchar(255) default NULL,
  year_released varchar(255) default NULL,
  plot varchar(4096) default NULL,
  poster varchar(255) default NULL
);
