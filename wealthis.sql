create table reqresUsers (
  id mediumint unsigned not null primary key auto_increment,
  reqresId mediumint unsigned not null, email varchar(255) not null,
  first_name varchar(255) not null, last_name varchar(255) not null,
  avatar varchar(255) not null,
  index emailIdx(email), fulltext index namesIdx( first_name, last_name )
);
