create table if not exists users (
    id integer primary key,
    email varchar(64) not null,
    password varchar(64) not null
)
;

insert into users values
(1, 'john@doo.com', 'johndoo'),
(3, 'foo@bar.com', 'foobar')
;