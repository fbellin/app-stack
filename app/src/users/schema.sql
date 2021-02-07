drop table users if exists;
create table users if not exists (
    id integer primary_key,
    name varchar(64) not null,
    password varchar(64) not null
)