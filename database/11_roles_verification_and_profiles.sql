-- ============================================================================
-- AgriVeda Database Schema Migration: 11_roles_verification_and_profiles.sql
-- Description: Scalable RBAC, Organizations, Role-Specific Profiles, 
--              Verification Subsystem, Consents, and Audit Trail.
-- Compatibility: PostgreSQL 14+, Supabase, Non-Destructive / Idempotent
-- Requires: 01_extensions_and_enums.sql, 02_profiles.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTEND EXISTING ENUMS & CREATE NEW DOMAIN TYPES
-- ----------------------------------------------------------------------------

-- Extend user_role_enum safely without dropping or recreating
DO $$ 
BEGIN
  -- Add new role values if they do not exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'research_scholar' AND enumtypid = 'user_role_enum'::regtype) THEN
    ALTER TYPE user_role_enum ADD VALUE 'research_scholar';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'institution' AND enumtypid = 'user_role_enum'::regtype) THEN
    ALTER TYPE user_role_enum ADD VALUE 'institution';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'bank' AND enumtypid = 'user_role_enum'::regtype) THEN
    ALTER TYPE user_role_enum ADD VALUE 'bank';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'government' AND enumtypid = 'user_role_enum'::regtype) THEN
    ALTER TYPE user_role_enum ADD VALUE 'government';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'buyer' AND enumtypid = 'user_role_enum'::regtype) THEN
    ALTER TYPE user_role_enum ADD VALUE 'buyer';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'fpo' AND enumtypid = 'user_role_enum'::regtype) THEN
    ALTER TYPE user_role_enum ADD VALUE 'fpo';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'admin' AND enumtypid = 'user_role_enum'::regtype) THEN
    ALTER TYPE user_role_enum ADD VALUE 'admin';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'verifier' AND enumtypid = 'user_role_enum'::regtype) THEN
    ALTER TYPE user_role_enum ADD VALUE 'verifier';
  END IF;
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

-- User Consent Types for DPDP / Privacy Compliance
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
-- 2. ROLE-BASED ACCESS CONTROL (RBAC) MASTER TABLES
-- ----------------------------------------------------------------------------

-- System Roles Definition
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

-- Granular Permissions Catalogue
CREATE TABLE IF NOT EXISTS permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  module VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mapping Roles to Permissions (M:N)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- Mapping Users to Multiple Roles (M:N with validity and primary flag)
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

-- Direct User Permission Overrides (Grant or Revoke individual permissions)
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
-- 3. ORGANIZATIONS & MULTI-USER MEMBERSHIP
-- ----------------------------------------------------------------------------

-- Organizations (Businesses, Institutions, Banks, Govt Departments, FPOs)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  org_type org_type_enum NOT NULL,
  registration_number VARCHAR(100),
  tax_identifier VARCHAR(50), -- GSTIN / PAN / CIN / Reg Code
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

-- Organization Memberships (Multi-user association with organizational roles)
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

-- ----------------------------------------------------------------------------
-- 4. UNIFIED SECURE BANK ACCOUNTS TABLE
-- ----------------------------------------------------------------------------

-- Bank Accounts (for Farmers, Businesses, Institutions, etc. with masked/tokenized numbers)
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  account_holder_name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  branch_name VARCHAR(255),
  account_number_masked VARCHAR(50) NOT NULL, -- e.g. 'XXXX-XXXX-1234'
  account_number_hash VARCHAR(64) NOT NULL,   -- SHA-256 for uniqueness checks
  ifsc_code VARCHAR(20) NOT NULL,
  account_type VARCHAR(50) DEFAULT 'savings', -- 'savings', 'current', 'kcc', 'fpo_current'
  upi_id VARCHAR(100),
  is_primary BOOLEAN DEFAULT true,
  verification_status verification_status_enum DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_bank_owner CHECK (user_id IS NOT NULL OR organization_id IS NOT NULL)
);

-- ----------------------------------------------------------------------------
-- 5. ROLE-SPECIFIC PROFILE TABLES
-- ----------------------------------------------------------------------------

-- (A) Farmer Profiles
CREATE TABLE IF NOT EXISTS farmer_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  father_or_spouse_name TEXT,
  gender VARCHAR(20),
  dob DATE,
  education_level VARCHAR(50),
  primary_language VARCHAR(10) DEFAULT 'en',
  aadhaar_hash VARCHAR(64),                  -- SHA-256 hash for deduplication
  aadhaar_masked VARCHAR(20),                -- e.g. 'XXXX-XXXX-1234'
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

-- Farmer Farmland Plots
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
  irrigation_source VARCHAR(100), -- 'Drip', 'Borewell', 'Canal', 'Rainfed', 'Sprinkler', 'Well'
  ownership_type VARCHAR(50) DEFAULT 'owned', -- 'owned', 'leased', 'shared'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Farmland Photographs (Geotagged plot & crop imagery)
CREATE TABLE IF NOT EXISTS farmland_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plot_id UUID REFERENCES farmland_plots(id) ON DELETE CASCADE NOT NULL,
  farmer_id UUID REFERENCES farmer_profiles(user_id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type VARCHAR(50) DEFAULT 'crop_overview', -- 'crop_overview', 'soil_sample', 'irrigation_setup', 'boundary_post', 'infestation'
  geotag_lat DECIMAL(10, 7),
  geotag_lng DECIMAL(10, 7),
  caption TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Farmer Farming & Crop History
CREATE TABLE IF NOT EXISTS farmer_crop_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id UUID REFERENCES farmer_profiles(user_id) ON DELETE CASCADE NOT NULL,
  plot_id UUID REFERENCES farmland_plots(id) ON DELETE SET NULL,
  crop_name VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  season VARCHAR(50) NOT NULL, -- 'Kharif', 'Rabi', 'Zaid', 'Perennial'
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

-- (B) B2B Business / Buyer Profiles
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
  business_category VARCHAR(100) NOT NULL, -- 'Wholesaler', 'Retailer', 'Food Processor', 'Exporter', 'Input Manufacturer', 'Agri-Tech', 'FPO'
  procurement_requirements JSONB DEFAULT '[]'::jsonb, -- e.g. [{"crop": "Tomato", "monthly_demand_tons": 50, "min_grade": "A"}]
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

-- (C) Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  student_id_number VARCHAR(100) NOT NULL,
  university_name VARCHAR(255) NOT NULL,
  campus_name VARCHAR(255),
  department VARCHAR(100) NOT NULL,
  course_program VARCHAR(100) NOT NULL, -- 'B.Sc. Agriculture', 'M.Sc. Agronomy', 'B.Tech Agri-Informatics', 'Ph.D. Soil Science'
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

-- (D) Research Scholar Profiles
CREATE TABLE IF NOT EXISTS researcher_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  researcher_id_number VARCHAR(100) NOT NULL,
  university_institute_name VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  research_area VARCHAR(255) NOT NULL, -- 'Crop Genetics', 'Plant Pathology AI', 'Microbial Bio-Fertilizers', 'Precision Irrigation'
  designation VARCHAR(100) DEFAULT 'Ph.D. Scholar', -- 'Ph.D. Scholar', 'Postdoc Fellow', 'Principal Investigator', 'Scientist B/C/D'
  guide_supervisor_name VARCHAR(255),
  supervisor_email VARCHAR(255),
  active_project_title TEXT,
  funding_agency VARCHAR(255), -- 'ICAR', 'DBT', 'DST', 'BIRAC', 'Global Agri Fund'
  grant_id VARCHAR(100),
  orchid_id VARCHAR(50),
  publications_count INT DEFAULT 0,
  verification_status verification_status_enum DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- (E) Institution Profiles (linked to organization entity)
CREATE TABLE IF NOT EXISTS institution_profiles (
  organization_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  authorized_representative_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  institution_type VARCHAR(100) NOT NULL, -- 'Agricultural University', 'ICAR Research Institute', 'Krishi Vigyan Kendra (KVK)', 'Autonomous College'
  official_domain VARCHAR(100),           -- e.g. '@icar.gov.in', '@tnau.ac.in'
  accreditation_body VARCHAR(100),        -- 'ICAR', 'NAAC A++', 'UGC', 'AICTE', 'ISO-17025'
  accreditation_grade VARCHAR(50),
  accreditation_valid_until DATE,
  departments_json JSONB DEFAULT '[]'::jsonb,
  services_offered_json JSONB DEFAULT '[]'::jsonb, -- ['Soil Testing', 'Seed Certification', 'Pathology Lab', 'Extension Advisory']
  testing_laboratories_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- (F) Bank / Financial Institution Profiles (linked to organization entity)
CREATE TABLE IF NOT EXISTS financial_institution_profiles (
  organization_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  authorized_officer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  institution_subtype VARCHAR(100) NOT NULL, -- 'Public Sector Bank', 'Private Commercial Bank', 'Regional Rural Bank (RRB)', 'Agri-NBFC'
  rbi_license_number VARCHAR(100) NOT NULL,
  banking_code_ifsc_prefix VARCHAR(10),
  nodal_officer_name VARCHAR(255),
  nodal_officer_designation VARCHAR(100),
  nodal_officer_employee_id VARCHAR(50),
  official_contact_phone VARCHAR(50),
  official_contact_email VARCHAR(255),
  supported_credit_schemes JSONB DEFAULT '[]'::jsonb, -- ['KCC', 'Agri Infra Fund', 'Tractor Finance', 'Warehouse Receipt Financing']
  branches_count INT DEFAULT 1,
  head_office_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- (G) Government / Agriculture Department Profiles
CREATE TABLE IF NOT EXISTS government_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  department_name VARCHAR(255) NOT NULL, -- 'Department of Agriculture & Farmers Welfare', 'Horticulture Dept', 'APEDA', 'NABARD'
  officer_designation VARCHAR(100) NOT NULL,
  employee_id_number VARCHAR(100) NOT NULL,
  jurisdiction_level VARCHAR(50) NOT NULL, -- 'National', 'State', 'District', 'Taluk_Block', 'Gram_Panchayat'
  jurisdiction_state VARCHAR(100) NOT NULL,
  jurisdiction_district VARCHAR(100),
  jurisdiction_block VARCHAR(100),
  gov_email VARCHAR(255) NOT NULL,
  verification_status verification_status_enum DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. VERIFICATION SUBSYSTEM & SECURE DOCUMENT METADATA
-- ----------------------------------------------------------------------------

-- Verification Requests (Multi-stage workflow tracker)
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

-- Verification Documents (Metadata & storage URI references ONLY - No raw binary)
CREATE TABLE IF NOT EXISTS verification_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_id UUID REFERENCES verification_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  document_type document_type_enum NOT NULL,
  document_category VARCHAR(50) DEFAULT 'Identity', -- 'Identity', 'Land', 'Academic', 'Business_Tax', 'Regulatory', 'Accreditation'
  document_number_masked VARCHAR(50),               -- e.g. 'XXXX-XXXX-9901'
  document_number_hash VARCHAR(64),                 -- SHA-256 hash for fraud & duplicate prevention
  file_storage_path TEXT NOT NULL,                  -- Secure storage path / bucket URI
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

-- Document Verification History (Lifecycle transition audit per document)
CREATE TABLE IF NOT EXISTS document_verification_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES verification_documents(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  previous_status verification_status_enum,
  new_status verification_status_enum NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification Audit Logs (Immutable event stream for compliance)
CREATE TABLE IF NOT EXISTS verification_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_id UUID REFERENCES verification_requests(id) ON DELETE SET NULL,
  document_id UUID REFERENCES verification_documents(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- 'request_created', 'document_uploaded', 'assigned_to_reviewer', 'status_updated', 'approved', 'rejected'
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  notes TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. USER CONSENTS & GENERAL ENTERPRISE AUDIT LOGS
-- ----------------------------------------------------------------------------

-- User Consents (Digital Personal Data Protection / GDPR compliance)
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

-- Enterprise Audit Logs (Security, RBAC and system action events)
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
-- 8. INDEXES & UNIQUE CONSTRAINTS (Optimized Performance & Data Integrity)
-- ----------------------------------------------------------------------------

-- Unique partial indexes for organizations & business identifiers
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_org_tax_id 
  ON organizations (tax_identifier) 
  WHERE deleted_at IS NULL AND tax_identifier IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_business_gstin 
  ON business_profiles (gstin) 
  WHERE gstin IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_business_pan 
  ON business_profiles (pan) 
  WHERE pan IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_student_id_per_inst 
  ON student_profiles (institution_id, student_id_number) 
  WHERE institution_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_researcher_id_per_inst 
  ON researcher_profiles (institution_id, researcher_id_number) 
  WHERE institution_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_gov_employee_id 
  ON government_profiles (employee_id_number, jurisdiction_state);

CREATE UNIQUE INDEX IF NOT EXISTS uq_active_bank_account_hash 
  ON bank_accounts (account_number_hash, ifsc_code) 
  WHERE deleted_at IS NULL;

-- Document Checksum Uniqueness per User (prevents re-uploading identical file)
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_doc_checksum 
  ON verification_documents (user_id, file_sha256_checksum) 
  WHERE deleted_at IS NULL AND file_sha256_checksum IS NOT NULL;

-- Standard B-Tree Indexes on Foreign Keys & Status Columns
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON user_roles(is_active);

CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON organization_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON organization_memberships(user_id);

CREATE INDEX IF NOT EXISTS idx_farmer_plots_farmer_id ON farmland_plots(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_plots_location ON farmland_plots(state, district);
CREATE INDEX IF NOT EXISTS idx_farmland_photos_plot_id ON farmland_photos(plot_id);
CREATE INDEX IF NOT EXISTS idx_farmer_crop_history_farmer ON farmer_crop_history(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_crop_history_season_year ON farmer_crop_history(crop_name, season, crop_year);

CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_org_id ON bank_accounts(organization_id);

CREATE INDEX IF NOT EXISTS idx_verification_req_user_id ON verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_req_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_req_type ON verification_requests(verification_type);
CREATE INDEX IF NOT EXISTS idx_verification_req_reviewer ON verification_requests(reviewer_id);

CREATE INDEX IF NOT EXISTS idx_verification_docs_req_id ON verification_documents(request_id);
CREATE INDEX IF NOT EXISTS idx_verification_docs_user_id ON verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_docs_status ON verification_documents(verification_status);

CREATE INDEX IF NOT EXISTS idx_user_consents_user ON user_consents(user_id, consent_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- GIN Indexes on JSONB fields
CREATE INDEX IF NOT EXISTS idx_organizations_metadata_gin ON organizations USING GIN (metadata_json);
CREATE INDEX IF NOT EXISTS idx_business_procurement_gin ON business_profiles USING GIN (procurement_requirements);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changes_gin ON audit_logs USING GIN (changes_json);

-- ----------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Roles & Permissions: Read-only for authenticated users
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

-- Organizations: Public read for active verified orgs, write by member owners/admins
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

-- Organization Memberships:
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view org memberships" ON organization_memberships FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM organization_memberships m2 
    WHERE m2.organization_id = organization_memberships.organization_id 
      AND m2.user_id = auth.uid()
  )
);
CREATE POLICY "Org admins manage memberships" ON organization_memberships FOR ALL USING (
  EXISTS (
    SELECT 1 FROM organization_memberships m2 
    WHERE m2.organization_id = organization_memberships.organization_id 
      AND m2.user_id = auth.uid() 
      AND m2.org_role IN ('owner', 'admin')
  )
);

-- Bank Accounts: Owner access only
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bank accounts" ON bank_accounts FOR ALL USING (
  auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM organization_memberships 
    WHERE organization_id = bank_accounts.organization_id 
      AND user_id = auth.uid() 
      AND org_role IN ('owner', 'admin')
  )
);

-- Role-Specific Profiles: Owner access + Public directory viewing where verified
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

-- Verification Subsystem Policies
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read and create own verification requests" ON verification_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own verification requests" ON verification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own pending requests" ON verification_requests FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own documents" ON verification_documents FOR ALL USING (auth.uid() = user_id);

ALTER TABLE document_verification_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own document history" ON document_verification_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM verification_documents 
    WHERE id = document_verification_history.document_id AND user_id = auth.uid()
  )
);

ALTER TABLE verification_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own verification audit logs" ON verification_audit_logs FOR SELECT USING (
  actor_id = auth.uid() OR EXISTS (
    SELECT 1 FROM verification_requests 
    WHERE id = verification_audit_logs.request_id AND user_id = auth.uid()
  )
);

-- User Consents & Enterprise Audit Logs
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own consents" ON user_consents FOR ALL USING (auth.uid() = user_id);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own audit records" ON audit_logs FOR SELECT USING (auth.uid() = user_id);
