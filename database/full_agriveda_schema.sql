-- ============================================================================
-- AgriVeda Complete PostgreSQL Database Schema
-- Version: 2.0.0 (Unified & Scalable Architecture)
-- Modules: Profiles, RBAC, Organizations, Farmland & Plots, Pathology AI,
--          Marketplace & Quotes, Seed Vault, Crop Calendar, Mandi Prices,
--          Verification Lifecycle, Document Vault, Consents, & Audit Logging.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PART 1: EXTENSIONS & ENUMS
-- ----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Role Master Enum
DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM (
    'farmer',
    'vendor',
    'retail_vendor',
    'wholesale_vendor',
    'input_vendor',
    'agronomist',
    'business',
    'student',
    'research_scholar',
    'institution',
    'bank',
    'government',
    'buyer',
    'fpo',
    'admin',
    'verifier'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Risk Levels for AI Crop Pathology
DO $$ BEGIN
  CREATE TYPE risk_level_enum AS ENUM ('Low', 'Medium', 'High', 'Critical');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Quote & Order Status Enums
DO $$ BEGIN
  CREATE TYPE quote_status_enum AS ENUM ('Open', 'Responded', 'Accepted', 'Rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Organization Types
DO $$ BEGIN
  CREATE TYPE org_type_enum AS ENUM (
    'business',
    'institution',
    'bank',
    'government',
    'fpo_cooperative'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Organization Member Roles
DO $$ BEGIN
  CREATE TYPE org_role_enum AS ENUM (
    'owner',
    'admin',
    'employee',
    'researcher',
    'faculty',
    'student',
    'officer',
    'viewer'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Verification Status Lifecycle
DO $$ BEGIN
  CREATE TYPE verification_status_enum AS ENUM (
    'pending',
    'submitted',
    'under_review',
    'verified',
    'rejected',
    'expired',
    'revoked'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Verification Types
DO $$ BEGIN
  CREATE TYPE verification_type_enum AS ENUM (
    'identity_kyc',
    'land_ownership',
    'business_gst_pan',
    'academic_enrollment',
    'institutional_accreditation',
    'financial_regulatory',
    'government_officer',
    'organic_certification',
    'fpo_registration'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Document Types
DO $$ BEGIN
  CREATE TYPE document_type_enum AS ENUM (
    'aadhaar',
    'pan_individual',
    'pan_business',
    'voter_id',
    'passport',
    'driving_license',
    'land_patta_chitta',
    'khasra_khatauni',
    '7_12_extract',
    'sale_deed',
    'student_id_card',
    'bonafide_certificate',
    'enrollment_letter',
    'gst_certificate',
    'incorporation_certificate',
    'fssai_license',
    'trade_license',
    'bank_statement_cancelled_cheque',
    'rbi_license',
    'banking_license',
    'institutional_affiliation_letter',
    'govt_employee_id',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Consent Types
DO $$ BEGIN
  CREATE TYPE consent_type_enum AS ENUM (
    'terms_and_conditions',
    'privacy_policy',
    'aadhaar_kyc_consent',
    'credit_bureau_pull_consent',
    'data_sharing_with_buyers',
    'data_sharing_with_institutions',
    'crop_data_research_sharing'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ----------------------------------------------------------------------------
-- PART 2: CORE USER PROFILES & AUTHENTICATION INTEGRATION
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  location TEXT,
  farm_id TEXT,
  farm_size_acres DECIMAL,
  primary_crop TEXT,
  soil_type TEXT,
  language VARCHAR(5) DEFAULT 'en',
  avatar_url TEXT,
  role user_role_enum DEFAULT 'farmer',
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- PART 3: ROLE-BASED ACCESS CONTROL (RBAC)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  hierarchy_level INT DEFAULT 1,
  is_system BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  module VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE NOT NULL,
  is_granted BOOLEAN DEFAULT true,
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, permission_id)
);

-- ----------------------------------------------------------------------------
-- PART 4: ORGANIZATIONS & MEMBERSHIPS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  org_type org_type_enum NOT NULL,
  registration_number VARCHAR(100),
  tax_identifier VARCHAR(50),
  official_email VARCHAR(255),
  official_phone VARCHAR(50),
  website VARCHAR(255),
  address_line1 TEXT,
  address_line2 TEXT,
  city VARCHAR(100),
  district VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  verification_status verification_status_enum DEFAULT 'pending',
  logo_url TEXT,
  metadata_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS organization_memberships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  org_role org_role_enum NOT NULL DEFAULT 'employee',
  department VARCHAR(100),
  designation VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  account_holder_name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  branch_name VARCHAR(255),
  account_number_masked VARCHAR(50) NOT NULL,
  account_number_hash VARCHAR(64) NOT NULL,
  ifsc_code VARCHAR(20) NOT NULL,
  account_type VARCHAR(50) DEFAULT 'savings',
  upi_id VARCHAR(100),
  is_primary BOOLEAN DEFAULT true,
  verification_status verification_status_enum DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_bank_owner CHECK (user_id IS NOT NULL OR organization_id IS NOT NULL)
);

-- ----------------------------------------------------------------------------
-- PART 5: ROLE-SPECIFIC PROFILES
-- ----------------------------------------------------------------------------

-- Farmer Profiles
CREATE TABLE IF NOT EXISTS farmer_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  father_or_spouse_name TEXT,
  gender VARCHAR(20),
  dob DATE,
  education_level VARCHAR(50),
  primary_language VARCHAR(10) DEFAULT 'en',
  aadhaar_hash VARCHAR(64),
  aadhaar_masked VARCHAR(20),
  pm_kisan_id VARCHAR(50),
  soil_health_card_number VARCHAR(50),
  total_landholding_acres DECIMAL(10, 2) DEFAULT 0,
  is_organic_certified BOOLEAN DEFAULT false,
  organic_cert_number VARCHAR(100),
  farming_experience_years INT DEFAULT 0,
  annual_income_range VARCHAR(50),
  preferred_mandi_id UUID,
  verification_status verification_status_enum DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farmland_plots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id UUID REFERENCES farmer_profiles(user_id) ON DELETE CASCADE NOT NULL,
  plot_name VARCHAR(100),
  survey_number VARCHAR(100),
  khata_number VARCHAR(100),
  patta_number VARCHAR(100),
  acreage DECIMAL(10, 2) NOT NULL,
  village VARCHAR(100) NOT NULL,
  taluk_tehsil VARCHAR(100),
  district VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(20),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  boundary_geojson JSONB,
  soil_type VARCHAR(100),
  soil_ph DECIMAL(4, 2),
  organic_matter_percent DECIMAL(5, 2),
  irrigation_source VARCHAR(100),
  ownership_type VARCHAR(50) DEFAULT 'owned',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS farmland_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plot_id UUID REFERENCES farmland_plots(id) ON DELETE CASCADE NOT NULL,
  farmer_id UUID REFERENCES farmer_profiles(user_id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type VARCHAR(50) DEFAULT 'crop_overview',
  geotag_lat DECIMAL(10, 7),
  geotag_lng DECIMAL(10, 7),
  caption TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farmer_crop_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id UUID REFERENCES farmer_profiles(user_id) ON DELETE CASCADE NOT NULL,
  plot_id UUID REFERENCES farmland_plots(id) ON DELETE SET NULL,
  crop_name VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  season VARCHAR(50) NOT NULL,
  crop_year INT NOT NULL,
  sowing_date DATE,
  harvest_date DATE,
  acreage DECIMAL(10, 2) NOT NULL,
  actual_yield_metric_tons DECIMAL(10, 2),
  expected_production_tons DECIMAL(10, 2),
  market_price_realized_per_quintal DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2B Business / Buyer Profiles
CREATE TABLE IF NOT EXISTS business_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  business_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255),
  owner_representative_name VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50) NOT NULL,
  gstin VARCHAR(15),
  pan VARCHAR(10),
  cin VARCHAR(21),
  fssai_license_number VARCHAR(30),
  business_category VARCHAR(100) NOT NULL,
  procurement_requirements JSONB DEFAULT '[]'::jsonb,
  procurement_capacity_monthly_metric_tons DECIMAL(10, 2),
  annual_turnover_inr DECIMAL(15, 2),
  operational_regions JSONB DEFAULT '[]'::jsonb,
  registered_address TEXT,
  warehouse_locations JSONB DEFAULT '[]'::jsonb,
  credit_rating VARCHAR(20),
  verification_status verification_status_enum DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  student_id_number VARCHAR(100) NOT NULL,
  university_name VARCHAR(255) NOT NULL,
  campus_name VARCHAR(255),
  department VARCHAR(100) NOT NULL,
  course_program VARCHAR(100) NOT NULL,
  current_academic_year INT NOT NULL,
  current_semester INT,
  admission_year INT NOT NULL,
  expected_graduation_year INT NOT NULL,
  guide_supervisor_name VARCHAR(255),
  guide_email VARCHAR(255),
  specialization_field VARCHAR(100),
  verification_status verification_status_enum DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Research Scholar Profiles
CREATE TABLE IF NOT EXISTS researcher_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  researcher_id_number VARCHAR(100) NOT NULL,
  university_institute_name VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  research_area VARCHAR(255) NOT NULL,
  designation VARCHAR(100) DEFAULT 'Ph.D. Scholar',
  guide_supervisor_name VARCHAR(255),
  supervisor_email VARCHAR(255),
  active_project_title TEXT,
  funding_agency VARCHAR(255),
  grant_id VARCHAR(100),
  orchid_id VARCHAR(50),
  publications_count INT DEFAULT 0,
  verification_status verification_status_enum DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Institution Profiles
CREATE TABLE IF NOT EXISTS institution_profiles (
  organization_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  authorized_representative_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  institution_type VARCHAR(100) NOT NULL,
  official_domain VARCHAR(100),
  accreditation_body VARCHAR(100),
  accreditation_grade VARCHAR(50),
  accreditation_valid_until DATE,
  departments_json JSONB DEFAULT '[]'::jsonb,
  services_offered_json JSONB DEFAULT '[]'::jsonb,
  testing_laboratories_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank & Financial Institution Profiles
CREATE TABLE IF NOT EXISTS financial_institution_profiles (
  organization_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  authorized_officer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  institution_subtype VARCHAR(100) NOT NULL,
  rbi_license_number VARCHAR(100) NOT NULL,
  banking_code_ifsc_prefix VARCHAR(10),
  nodal_officer_name VARCHAR(255),
  nodal_officer_designation VARCHAR(100),
  nodal_officer_employee_id VARCHAR(50),
  official_contact_phone VARCHAR(50),
  official_contact_email VARCHAR(255),
  supported_credit_schemes JSONB DEFAULT '[]'::jsonb,
  branches_count INT DEFAULT 1,
  head_office_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Government Officer Profiles
CREATE TABLE IF NOT EXISTS government_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  department_name VARCHAR(255) NOT NULL,
  officer_designation VARCHAR(100) NOT NULL,
  employee_id_number VARCHAR(100) NOT NULL,
  jurisdiction_level VARCHAR(50) NOT NULL,
  jurisdiction_state VARCHAR(100) NOT NULL,
  jurisdiction_district VARCHAR(100),
  jurisdiction_block VARCHAR(100),
  gov_email VARCHAR(255) NOT NULL,
  verification_status verification_status_enum DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- PART 6: VERIFICATION SUBSYSTEM & DOCUMENT METADATA
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  verification_type verification_type_enum NOT NULL,
  target_role VARCHAR(50),
  status verification_status_enum DEFAULT 'pending' NOT NULL,
  current_stage VARCHAR(50) DEFAULT 'submitted',
  submission_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,
  rejection_reason_code VARCHAR(100),
  rejection_reason_details TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_id UUID REFERENCES verification_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  document_type document_type_enum NOT NULL,
  document_category VARCHAR(50) DEFAULT 'Identity',
  document_number_masked VARCHAR(50),
  document_number_hash VARCHAR(64),
  file_storage_path TEXT NOT NULL,
  file_name_original VARCHAR(255),
  file_mime_type VARCHAR(100),
  file_size_bytes BIGINT,
  file_sha256_checksum VARCHAR(64),
  is_encrypted BOOLEAN DEFAULT true,
  encryption_key_id VARCHAR(100),
  issue_date DATE,
  expiry_date DATE,
  issuing_authority VARCHAR(255),
  verification_status verification_status_enum DEFAULT 'pending',
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS document_verification_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES verification_documents(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  previous_status verification_status_enum,
  new_status verification_status_enum NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_id UUID REFERENCES verification_requests(id) ON DELETE SET NULL,
  document_id UUID REFERENCES verification_documents(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  notes TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_consents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  consent_type consent_type_enum NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  is_granted BOOLEAN DEFAULT true NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id VARCHAR(100),
  changes_json JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- PART 7: AI CHATBOT, PATHOLOGY, MARKETPLACE, SEED BANK & CALENDAR
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New AI Session',
  language VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('user', 'assistant')) NOT NULL,
  message_text TEXT NOT NULL,
  intent_category TEXT,
  action_card_json JSONB,
  audio_url TEXT,
  attached_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_diagnosis_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  crop_type TEXT NOT NULL,
  soil_type TEXT,
  location TEXT,
  detected_issue TEXT NOT NULL,
  confidence INT CHECK (confidence >= 0 AND confidence <= 100),
  risk_level risk_level_enum DEFAULT 'Medium',
  farm_health_score INT,
  image_url TEXT NOT NULL,
  cause TEXT,
  treatment_json JSONB,
  prevention_json JSONB,
  fertilizer_suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL NOT NULL,
  retail_price DECIMAL,
  unit TEXT NOT NULL,
  available_qty DECIMAL NOT NULL,
  min_order_qty DECIMAL DEFAULT 1,
  trade_type TEXT CHECK (trade_type IN ('b2b', 'b2c', 'both')) DEFAULT 'both',
  is_certified BOOLEAN DEFAULT false,
  subsidy_info TEXT,
  image_url TEXT,
  location TEXT,
  harvest_date TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  quoted_price DECIMAL NOT NULL,
  quantity DECIMAL NOT NULL,
  status quote_status_enum DEFAULT 'Open',
  negotiation_history JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES marketplace_products(id) NOT NULL,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  final_price DECIMAL NOT NULL,
  quantity DECIMAL NOT NULL,
  total_amount DECIMAL NOT NULL,
  status order_status_enum DEFAULT 'Pending',
  shipping_address TEXT NOT NULL,
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  crop_context TEXT,
  image_url TEXT,
  likes_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  image_url TEXT,
  likes_count INT DEFAULT 0,
  is_expert BOOLEAN DEFAULT false,
  is_accepted_answer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mapcn_mandi_centers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  market_code VARCHAR(50) UNIQUE NOT NULL,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  location_address TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  secretary_name VARCHAR(255),
  contact_phone VARCHAR(50),
  official_email VARCHAR(255),
  is_enam_connected BOOLEAN DEFAULT true,
  cold_storage_available BOOLEAN DEFAULT false,
  weighbridge_available BOOLEAN DEFAULT true,
  operating_hours VARCHAR(100) DEFAULT '06:00 AM - 06:00 PM',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mapcn_commodity_arrivals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mandi_id UUID REFERENCES mapcn_mandi_centers(id) ON DELETE CASCADE NOT NULL,
  crop_name VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  grade VARCHAR(20) DEFAULT 'FAQ',
  min_price_per_quintal DECIMAL(10, 2) NOT NULL,
  max_price_per_quintal DECIMAL(10, 2) NOT NULL,
  modal_price_per_quintal DECIMAL(10, 2) NOT NULL,
  msp_price_per_quintal DECIMAL(10, 2),
  arrival_volume_metric_tons DECIMAL(10, 2) NOT NULL,
  price_date DATE DEFAULT CURRENT_DATE NOT NULL,
  trend_direction VARCHAR(10) DEFAULT 'STABLE',
  trend_percentage DECIMAL(5, 2) DEFAULT 0.00,
  ai_market_outlook TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mandi_id, crop_name, variety, price_date)
);

CREATE TABLE IF NOT EXISTS mapcn_price_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  crop_name VARCHAR(100) NOT NULL,
  target_price_per_quintal DECIMAL(10, 2) NOT NULL,
  alert_condition VARCHAR(10) DEFAULT 'ABOVE',
  preferred_mandi_id UUID REFERENCES mapcn_mandi_centers(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mapcn_mandi_traders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mandi_id UUID REFERENCES mapcn_mandi_centers(id) ON DELETE CASCADE NOT NULL,
  trader_name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  shop_number VARCHAR(50),
  apmc_license_number VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  verified_buyer BOOLEAN DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 4.8,
  commodities_traded JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_calendars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  crop_name TEXT NOT NULL,
  sowing_date DATE NOT NULL,
  total_duration_days INT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  calendar_id UUID REFERENCES crop_calendars(id) ON DELETE CASCADE NOT NULL,
  day_number INT NOT NULL,
  event_date DATE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, 
  description TEXT,
  recommended_time TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mandi_prices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  market_name TEXT NOT NULL,
  location TEXT NOT NULL,
  price_per_kg DECIMAL NOT NULL,
  date_recorded DATE DEFAULT CURRENT_DATE,
  trend_percentage DECIMAL,
  ai_outlook TEXT,
  UNIQUE(crop_name, market_name, date_recorded)
);

-- ----------------------------------------------------------------------------
-- PART 8: INDEXES & PERFORMANCE OPTIMIZATIONS
-- ----------------------------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS uq_active_org_tax_id ON organizations (tax_identifier) WHERE deleted_at IS NULL AND tax_identifier IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_business_gstin ON business_profiles (gstin) WHERE gstin IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_business_pan ON business_profiles (pan) WHERE pan IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_student_id_per_inst ON student_profiles (institution_id, student_id_number) WHERE institution_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_researcher_id_per_inst ON researcher_profiles (institution_id, researcher_id_number) WHERE institution_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_gov_employee_id ON government_profiles (employee_id_number, jurisdiction_state);
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_bank_account_hash ON bank_accounts (account_number_hash, ifsc_code) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_doc_checksum ON verification_documents (user_id, file_sha256_checksum) WHERE deleted_at IS NULL AND file_sha256_checksum IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON organization_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_farmer_plots_farmer_id ON farmland_plots(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_plots_location ON farmland_plots(state, district);
CREATE INDEX IF NOT EXISTS idx_farmland_photos_plot_id ON farmland_photos(plot_id);
CREATE INDEX IF NOT EXISTS idx_farmer_crop_history_farmer ON farmer_crop_history(farmer_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_req_user_id ON verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_req_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_docs_req_id ON verification_documents(request_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_user ON user_consents(user_id, consent_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_metadata_gin ON organizations USING GIN (metadata_json);
CREATE INDEX IF NOT EXISTS idx_business_procurement_gin ON business_profiles USING GIN (procurement_requirements);

-- ----------------------------------------------------------------------------
-- PART 9: ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users edit own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public roles view" ON roles FOR SELECT USING (true);

ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public permissions view" ON permissions FOR SELECT USING (true);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public role_permissions view" ON role_permissions FOR SELECT USING (true);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own permissions" ON user_permissions FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View verified organizations" ON organizations FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Org admins update organization" ON organizations FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM organization_memberships 
    WHERE organization_id = organizations.id 
      AND user_id = auth.uid() 
      AND org_role IN ('owner', 'admin')
      AND deleted_at IS NULL
  )
);

ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view org memberships" ON organization_memberships FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM organization_memberships m2 
    WHERE m2.organization_id = organization_memberships.organization_id 
      AND m2.user_id = auth.uid()
  )
);

ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bank accounts" ON bank_accounts FOR ALL USING (
  auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM organization_memberships 
    WHERE organization_id = bank_accounts.organization_id 
      AND user_id = auth.uid() 
      AND org_role IN ('owner', 'admin')
  )
);

ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers manage own profile" ON farmer_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read verified farmer profiles" ON farmer_profiles FOR SELECT USING (verification_status = 'verified');

ALTER TABLE farmland_plots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers manage own plots" ON farmland_plots FOR ALL USING (auth.uid() = farmer_id);
CREATE POLICY "Public read active plots" ON farmland_plots FOR SELECT USING (is_active = true AND deleted_at IS NULL);

ALTER TABLE farmland_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers manage own photos" ON farmland_photos FOR ALL USING (auth.uid() = farmer_id);
CREATE POLICY "Public read farmland photos" ON farmland_photos FOR SELECT USING (true);

ALTER TABLE farmer_crop_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers manage own crop history" ON farmer_crop_history FOR ALL USING (auth.uid() = farmer_id);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business owners manage profile" ON business_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public view verified businesses" ON business_profiles FOR SELECT USING (verification_status = 'verified');

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own profile" ON student_profiles FOR ALL USING (auth.uid() = user_id);

ALTER TABLE researcher_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Researchers manage own profile" ON researcher_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public view verified researchers" ON researcher_profiles FOR SELECT USING (verification_status = 'verified');

ALTER TABLE institution_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Institutions manage own profile" ON institution_profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM organization_memberships 
    WHERE organization_id = institution_profiles.organization_id 
      AND user_id = auth.uid() 
      AND org_role IN ('owner', 'admin', 'faculty')
  )
);
CREATE POLICY "Public view verified institutions" ON institution_profiles FOR SELECT USING (true);

ALTER TABLE financial_institution_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Financial org officers manage profile" ON financial_institution_profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM organization_memberships 
    WHERE organization_id = financial_institution_profiles.organization_id 
      AND user_id = auth.uid() 
      AND org_role IN ('owner', 'admin', 'officer')
  )
);
CREATE POLICY "Public view verified financial institutions" ON financial_institution_profiles FOR SELECT USING (true);

ALTER TABLE government_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gov officers manage own profile" ON government_profiles FOR ALL USING (auth.uid() = user_id);

ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read and create own verification requests" ON verification_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own verification requests" ON verification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own pending requests" ON verification_requests FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own documents" ON verification_documents FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own consents" ON user_consents FOR ALL USING (auth.uid() = user_id);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own audit records" ON audit_logs FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE crop_diagnosis_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers can manage own scan reports" ON crop_diagnosis_reports FOR ALL USING (auth.uid() = farmer_id);

ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public marketplace products" ON marketplace_products FOR SELECT USING (is_active = true);
CREATE POLICY "Sellers manage own products" ON marketplace_products FOR ALL USING (auth.uid() = seller_id);

ALTER TABLE price_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quote parties can view quotes" ON price_quotes FOR SELECT USING (auth.uid() IN (buyer_id, seller_id));

ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order parties can manage orders" ON marketplace_orders FOR ALL USING (auth.uid() IN (buyer_id, seller_id));

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public community access" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Public reply access" ON community_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post" ON community_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can reply" ON community_replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE mapcn_mandi_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapcn_commodity_arrivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapcn_price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapcn_mandi_traders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active mandi centers" ON mapcn_mandi_centers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read commodity arrivals" ON mapcn_commodity_arrivals FOR SELECT USING (true);
CREATE POLICY "Public read verified traders" ON mapcn_mandi_traders FOR SELECT USING (is_active = true);
CREATE POLICY "Users manage own price alerts" ON mapcn_price_alerts FOR ALL USING (auth.uid() = user_id);

ALTER TABLE crop_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers manage their own calendars" ON crop_calendars FOR ALL USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers manage calendar events" ON calendar_events FOR ALL USING (
  EXISTS (SELECT 1 FROM crop_calendars WHERE id = calendar_events.calendar_id AND farmer_id = auth.uid())
);

ALTER TABLE mandi_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public market prices" ON mandi_prices FOR SELECT USING (true);
