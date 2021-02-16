create extension if not exists "uuid-ossp";

create table if not exists users (
    uuid uuid primary key default uuid_generate_v1mc(),
    id serial,
    email varchar(64) not null,
    password varchar(64) not null
)
;

insert into users (email, password) values
('john@doo.com', 'johndoo'),
('foo@bar.com', 'foobar')
;