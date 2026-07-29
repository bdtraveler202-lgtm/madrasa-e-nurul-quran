-- ==========================================
-- MADRASA ERP DATABASE V1
-- ==========================================

create extension if not exists pgcrypto;

-- ==========================================
-- STUDENTS
-- ==========================================

create table if not exists students (

id uuid primary key default gen_random_uuid(),

student_id text unique not null,

full_name text not null,

father_name text,

mother_name text,

guardian_name text,

guardian_relation text,

mobile text,

guardian_mobile text,

email text,

gender text,

date_of_birth date,

blood_group text,

religion text default 'Islam',

nationality text default 'Bangladeshi',

present_address text,

permanent_address text,

class_name text not null,

section text,

roll_no integer,

admission_date date,

admission_fee numeric default 0,

monthly_fee numeric default 0,

photo_url text,

nid_birth_certificate text,

status text default 'Active',

remarks text,

created_at timestamptz default now(),

updated_at timestamptz default now()

);

-- ==========================================
-- AUTO STUDENT ID
-- Format:
-- MDR-2026-000001
-- ==========================================

create sequence if not exists student_serial_seq start 1;

create or replace function generate_student_id()

returns trigger

language plpgsql

as $$

declare

serial_no bigint;

year_part text;

begin

serial_no:=nextval('student_serial_seq');

year_part:=to_char(current_date,'YYYY');

new.student_id:=

'MDR-'||

year_part||

'-'||

lpad(serial_no::text,6,'0');

return new;

end;

$$;

drop trigger if exists trg_student_id on students;

create trigger trg_student_id

before insert

on students

for each row

when (new.student_id is null)

execute function generate_student_id();
