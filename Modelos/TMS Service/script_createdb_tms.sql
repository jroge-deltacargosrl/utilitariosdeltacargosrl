


-- tabla alterna para manejar los datos de ODOO
create table usuario(
    id int primary key,
    correo varchar(40) not null,
    contraseña varchar(40) not null,
);


delete from usuario
insert into usuario 
    values(1,'manuel','123'),(2,'jorge','321'),(3,'ramiro','9999'); 

select * from usuario



select * from usuario
