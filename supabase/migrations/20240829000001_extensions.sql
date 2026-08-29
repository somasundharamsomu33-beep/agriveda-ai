-- 01_extensions_and_enums.sql
-- Run this FIRST.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role_enum AS ENUM ('farmer', 'vendor', 'retail_vendor', 'wholesale_vendor', 'input_vendor', 'agronomist', 'business', 'student');
CREATE TYPE risk_level_enum AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE quote_status_enum AS ENUM ('Open', 'Responded', 'Accepted', 'Rejected');
CREATE TYPE order_status_enum AS ENUM ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');
