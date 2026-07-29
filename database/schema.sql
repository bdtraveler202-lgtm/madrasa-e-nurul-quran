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
-- ==========================================
-- TEACHERS
-- ==========================================

create table if not exists teachers (

id uuid primary key default gen_random_uuid(),

teacher_id text unique not null,

full_name text not null,

designation text,

department text,

qualification text,

mobile text,

email text,

gender text,

date_of_birth date,

joining_date date,

salary numeric default 0,

photo_url text,

nid text,

address text,

status text default 'Active',

created_at timestamptz default now(),

updated_at timestamptz default now()

);

create sequence if not exists teacher_serial_seq start 1;

create or replace function generate_teacher_id()

returns trigger
language plpgsql
as $$

declare

serial_no bigint;

year_part text;

begin

serial_no:=nextval('teacher_serial_seq');

year_part:=to_char(current_date,'YYYY');

new.teacher_id:=
'MTR-'||
year_part||
'-'||
lpad(serial_no::text,6,'0');

return new;

end;

$$;

drop trigger if exists trg_teacher_id on teachers;

create trigger trg_teacher_id

before insert

on teachers

for each row

when (new.teacher_id is null)

execute function generate_teacher_id();

-- ==========================================
-- EMPLOYEES
-- ==========================================

create table if not exists employees (

id uuid primary key default gen_random_uuid(),

employee_id text unique,

full_name text not null,

designation text,

mobile text,

salary numeric default 0,

joining_date date,

photo_url text,

status text default 'Active',

created_at timestamptz default now()

);

-- ==========================================
-- USERS
-- ==========================================

create table if not exists users (

id uuid primary key default gen_random_uuid(),

full_name text,

email text unique,

role text,

status text default 'Active',

created_at timestamptz default now()

); 
-- ==========================================
-- STUDENT ATTENDANCE
-- ==========================================

create table if not exists attendance_students (

id uuid primary key default gen_random_uuid(),

student_id text not null,

attendance_date date not null,

status text not null check (status in ('Present','Absent','Late','Leave')),

remarks text,

created_at timestamptz default now()

);

-- ==========================================
-- FEES
-- ==========================================

create table if not exists fees (

id uuid primary key default gen_random_uuid(),

student_id text not null,

fee_month text not null,

fee_year integer not null,

admission_fee numeric default 0,

monthly_fee numeric default 0,

exam_fee numeric default 0,

other_fee numeric default 0,

discount numeric default 0,

paid_amount numeric default 0,

due_amount numeric default 0,

payment_date date,

payment_method text,

receipt_no text,

status text default 'Due',

created_at timestamptz default now()

);

-- ==========================================
-- SMS QUEUE
-- ==========================================

create table if not exists sms_queue (

id uuid primary key default gen_random_uuid(),

student_id text,

mobile text not null,

message text not null,

sms_type text,

status text default 'Pending',

provider_response text,

sent_at timestamptz,

created_at timestamptz default now()

);

-- ==========================================
-- NOTICES
-- ==========================================

create table if not exists notices (

id uuid primary key default gen_random_uuid(),

title text not null,

details text,

notice_date date,

status text default 'Published',

created_at timestamptz default now()

);
-- ==========================================
-- GALLERY
-- ==========================================

create table if not exists gallery (

id uuid primary key default gen_random_uuid(),

title text not null,

image_url text not null,

description text,

status text default 'Published',

created_at timestamptz default now()

);

-- ==========================================
-- VIDEOS
-- ==========================================

create table if not exists videos (

id uuid primary key default gen_random_uuid(),

title text not null,

video_url text not null,

thumbnail text,

status text default 'Published',

created_at timestamptz default now()

);

-- ==========================================
-- DONATIONS
-- ==========================================

create table if not exists donations (

id uuid primary key default gen_random_uuid(),

donor_name text,

mobile text,

amount numeric default 0,

target_amount numeric default 0,

payment_method text,

reference_no text,

status text default 'Paid',

created_at timestamptz default now()

);

-- ==========================================
-- WEBSITE SETTINGS
-- ==========================================

create table if not exists settings (

id uuid primary key default gen_random_uuid(),

website_name text,

address text,

phone text,

email text,

facebook text,

youtube text,

logo_url text,

favicon_url text,

office_time text,

language_default text default 'bn',

created_at timestamptz default now()

);

-- ==========================================
-- DOWNLOADS
-- ==========================================

create table if not exists downloads (

id uuid primary key default gen_random_uuid(),

title text not null,

file_url text not null,

category text,

status text default 'Published',

download_count integer default 0,

created_at timestamptz default now()

);

-- ==========================================
-- COMPLAINTS
-- ==========================================

create table if not exists complaints (

id uuid primary key default gen_random_uuid(),

name text not null,

mobile text,

subject text,

message text not null,

status text default 'Pending',

created_at timestamptz default now()

);
