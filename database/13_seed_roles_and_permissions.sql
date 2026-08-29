-- ============================================================================
-- AgriVeda Database Schema Migration: 13_seed_roles_and_permissions.sql
-- Description: Standard System Roles, Granular Permission Taxonomy,
--              and Default Role-Permission Assignments.
-- Compatibility: PostgreSQL 14+, Supabase, Idempotent
-- Requires: 11_roles_verification_and_profiles.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED SYSTEM ROLES
-- ----------------------------------------------------------------------------

INSERT INTO public.roles (name, code, description, hierarchy_level, is_system)
VALUES 
  ('Farmer', 'farmer', 'Individual Farmer, Farm Operator, or Smallholder Producer', 1, true),
  ('B2B Business / Buyer', 'business_buyer', 'Wholesale Buyer, Food Processor, Exporter, or FMCG Aggregator', 2, true),
  ('Agri Input Vendor', 'vendor', 'Seed, Fertilizer, Pesticide, and Farm Machinery Supplier', 2, true),
  ('Agricultural Student', 'student', 'Enrolled Student in Agricultural Sciences, Agronomy, or Allied Fields', 1, true),
  ('Research Scholar / Scientist', 'research_scholar', 'Agronomist, Soil Scientist, Plant Pathologist, or Ph.D. Researcher', 2, true),
  ('Agricultural Institution', 'institution', 'Agricultural University, ICAR Institute, KVK, or Extension Center', 3, true),
  ('Bank / Financial Institution', 'financial_institution', 'Commercial Bank, RRB, Cooperative, Agri-NBFC, or Credit Provider', 3, true),
  ('Government / Agri Dept', 'government_officer', 'State Department of Agriculture, APEDA, NABARD, or District Officer', 3, true),
  ('Verification Officer', 'verifier', 'KYC, Farmland, Academic & Legal Document Review Officer', 4, true),
  ('System Administrator', 'admin', 'Super Administrator with Full Platform Access', 5, true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hierarchy_level = EXCLUDED.hierarchy_level;

-- ----------------------------------------------------------------------------
-- 2. SEED PERMISSIONS TAXONOMY
-- ----------------------------------------------------------------------------

INSERT INTO public.permissions (code, module, name, description)
VALUES
  -- Marketplace Module
  ('marketplace:view_catalog', 'marketplace', 'View Marketplace Catalog', 'Browse published agricultural commodities, inputs, and seeds'),
  ('marketplace:create_listing', 'marketplace', 'Create Product Listing', 'Create new sales listings for produce or farm inputs'),
  ('marketplace:manage_own_listings', 'marketplace', 'Manage Own Listings', 'Edit, deactivate, or delete authored marketplace listings'),
  ('marketplace:submit_quote', 'marketplace', 'Submit Price Quote', 'Send price negotiations and quotes for commodity batches'),
  ('marketplace:accept_quote', 'marketplace', 'Accept/Reject Quote', 'Accept or reject inbound price quotes and negotiate terms'),
  ('marketplace:place_order', 'marketplace', 'Place Order', 'Create purchase orders for produce or inputs'),
  ('marketplace:fulfill_order', 'marketplace', 'Fulfill Order', 'Update shipping status and dispatch orders'),
  ('marketplace:b2b_bulk_procure', 'marketplace', 'B2B Bulk Procurement', 'Access wholesale contract farming and multi-tonnage auctions'),

  -- Farm Management & AI Diagnostics
  ('farm:manage_plots', 'farm_management', 'Manage Farmland Plots', 'Create, update, and manage plot boundaries and soil parameters'),
  ('farm:upload_crop_scans', 'farm_management', 'Upload Pathology Scans', 'Run AI image analysis for crop disease and pest diagnosis'),
  ('farm:view_pathology_ai', 'farm_management', 'View AI Pathology Reports', 'Access historical disease diagnoses and treatment plans'),
  ('farm:manage_crop_calendar', 'farm_management', 'Manage Crop Calendar', 'Plan sowing, fertilizer schedules, irrigation, and harvest'),
  ('farm:seed_exchange_request', 'farm_management', 'Request Seed Exchange', 'Request heritage seeds from community seed vaults'),
  ('farm:seed_vault_manage', 'farm_management', 'Manage Seed Vault Stock', 'Register and distribute indigenous seed varieties'),

  -- Research & Agronomy Collaboration
  ('research:publish_findings', 'research', 'Publish Research Findings', 'Share agronomic advisory, disease alerts, and crop trial reports'),
  ('research:access_anonymized_crop_data', 'research', 'Access Crop Research Data', 'Access anonymized regional pathology and yield statistics'),
  ('research:collaborate_with_farmers', 'research', 'Farmer Field Trials', 'Run direct experimental field trials with verified farmers'),
  ('research:submit_soil_recommendations', 'research', 'Provide Expert Soil Rx', 'Provide customized fertilizer and soil amendment prescriptions'),

  -- Institutional Accounts & University Services
  ('institution:manage_members', 'institutional', 'Manage Institutional Members', 'Enroll and manage faculty, researchers, and students'),
  ('institution:issue_bonafide', 'institutional', 'Verify Student Affiliation', 'Endorse student identity and research credentials'),
  ('institution:publish_extension_advisory', 'institutional', 'Publish Extension Bulletins', 'Issue university advisory bulletins to regional farmers'),
  ('institution:manage_testing_lab', 'institutional', 'Manage Testing Laboratories', 'Publish accredited soil, water, and seed test results'),

  -- Banking & Agricultural Credit Services
  ('financial:view_credit_applications', 'financial', 'View Loan Applications', 'Inspect farmer credit profiles, landholdings, and harvest history'),
  ('financial:evaluate_farm_credit_score', 'financial', 'Evaluate Farm Credit Risk', 'Calculate digital agri-credit score from yield & mandi history'),
  ('financial:disburse_kcc_loan', 'financial', 'Disburse Agricultural Credit', 'Offer Kisan Credit Card and warehouse receipt financing'),
  ('financial:manage_credit_schemes', 'financial', 'Manage Credit Products', 'Publish institutional loan and subsidy schemes'),

  -- Government & Public Schemes
  ('gov:view_district_yield_stats', 'government', 'View District Analytics', 'Monitor aggregate crop health, acreage, and yield projections'),
  ('gov:disburse_subsidies', 'government', 'Process Scheme Subsidies', 'Verify eligibility and disburse input/equipment subsidies'),
  ('gov:publish_mandi_tariffs', 'government', 'Publish Mandi MSP & Rates', 'Broadcast official minimum support prices and mandi tariffs'),
  ('gov:broadcast_weather_emergencies', 'government', 'Broadcast Disaster Alerts', 'Send high-priority cyclone, drought, or flood emergency alerts'),

  -- Verification & KYC Engine
  ('verification:submit_request', 'verification', 'Submit Verification Request', 'Apply for KYC, land, academic, or business verification'),
  ('verification:upload_documents', 'verification', 'Upload Verification Documents', 'Upload encrypted government, land, or trade credentials'),
  ('verification:review_queue', 'verification', 'Access Verifier Queue', 'Inspect pending verification submissions across roles'),
  ('verification:approve_reject', 'verification', 'Approve/Reject Verification', 'Approve, reject, or request changes on submitted dossiers'),
  ('verification:view_audit_logs', 'verification', 'View Verification Audit Log', 'Inspect compliance audit trail of all verification actions'),

  -- Platform Administration
  ('admin:all', 'admin', 'Super Admin Access', 'Unrestricted administrative access to all modules and configurations'),
  ('admin:manage_users', 'admin', 'Manage User Accounts', 'Suspend, activate, or update user accounts and identities'),
  ('admin:manage_roles', 'admin', 'Manage RBAC Roles', 'Assign and configure roles and granular permission sets'),
  ('admin:manage_orgs', 'admin', 'Manage Organizations', 'Verify and manage institutions, businesses, and banking entities'),
  ('admin:view_system_audit', 'admin', 'View System Audit Trail', 'Inspect full enterprise system and security audit logs')
ON CONFLICT (code) DO UPDATE SET
  module = EXCLUDED.module,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ----------------------------------------------------------------------------
-- 3. ASSIGN PERMISSIONS TO ROLES
-- ----------------------------------------------------------------------------

-- Helper function to bulk map permission patterns to a role
DO $$
DECLARE
  v_farmer_id UUID;
  v_buyer_id UUID;
  v_vendor_id UUID;
  v_student_id UUID;
  v_researcher_id UUID;
  v_institution_id UUID;
  v_bank_id UUID;
  v_gov_id UUID;
  v_verifier_id UUID;
  v_admin_id UUID;
BEGIN
  SELECT id INTO v_farmer_id FROM public.roles WHERE code = 'farmer';
  SELECT id INTO v_buyer_id FROM public.roles WHERE code = 'business_buyer';
  SELECT id INTO v_vendor_id FROM public.roles WHERE code = 'vendor';
  SELECT id INTO v_student_id FROM public.roles WHERE code = 'student';
  SELECT id INTO v_researcher_id FROM public.roles WHERE code = 'research_scholar';
  SELECT id INTO v_institution_id FROM public.roles WHERE code = 'institution';
  SELECT id INTO v_bank_id FROM public.roles WHERE code = 'financial_institution';
  SELECT id INTO v_gov_id FROM public.roles WHERE code = 'government_officer';
  SELECT id INTO v_verifier_id FROM public.roles WHERE code = 'verifier';
  SELECT id INTO v_admin_id FROM public.roles WHERE code = 'admin';

  -- (1) Farmer Permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_farmer_id, id FROM public.permissions 
  WHERE code IN (
    'marketplace:view_catalog', 'marketplace:create_listing', 'marketplace:manage_own_listings',
    'marketplace:submit_quote', 'marketplace:accept_quote', 'marketplace:place_order',
    'farm:manage_plots', 'farm:upload_crop_scans', 'farm:view_pathology_ai',
    'farm:manage_crop_calendar', 'farm:seed_exchange_request',
    'verification:submit_request', 'verification:upload_documents'
  )
  ON CONFLICT DO NOTHING;

  -- (2) B2B Business / Buyer Permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_buyer_id, id FROM public.permissions 
  WHERE code IN (
    'marketplace:view_catalog', 'marketplace:submit_quote', 'marketplace:accept_quote',
    'marketplace:place_order', 'marketplace:b2b_bulk_procure',
    'verification:submit_request', 'verification:upload_documents'
  )
  ON CONFLICT DO NOTHING;

  -- (3) Input Vendor Permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_vendor_id, id FROM public.permissions 
  WHERE code IN (
    'marketplace:view_catalog', 'marketplace:create_listing', 'marketplace:manage_own_listings',
    'marketplace:submit_quote', 'marketplace:accept_quote', 'marketplace:fulfill_order',
    'farm:seed_vault_manage',
    'verification:submit_request', 'verification:upload_documents'
  )
  ON CONFLICT DO NOTHING;

  -- (4) Student Permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_student_id, id FROM public.permissions 
  WHERE code IN (
    'marketplace:view_catalog',
    'farm:upload_crop_scans', 'farm:view_pathology_ai',
    'research:access_anonymized_crop_data',
    'verification:submit_request', 'verification:upload_documents'
  )
  ON CONFLICT DO NOTHING;

  -- (5) Research Scholar Permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_researcher_id, id FROM public.permissions 
  WHERE code IN (
    'marketplace:view_catalog',
    'farm:upload_crop_scans', 'farm:view_pathology_ai',
    'research:publish_findings', 'research:access_anonymized_crop_data',
    'research:collaborate_with_farmers', 'research:submit_soil_recommendations',
    'verification:submit_request', 'verification:upload_documents'
  )
  ON CONFLICT DO NOTHING;

  -- (6) Institution Permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_institution_id, id FROM public.permissions 
  WHERE code IN (
    'marketplace:view_catalog',
    'institution:manage_members', 'institution:issue_bonafide',
    'institution:publish_extension_advisory', 'institution:manage_testing_lab',
    'research:publish_findings', 'research:access_anonymized_crop_data',
    'verification:submit_request', 'verification:upload_documents'
  )
  ON CONFLICT DO NOTHING;

  -- (7) Financial Institution Permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_bank_id, id FROM public.permissions 
  WHERE code IN (
    'financial:view_credit_applications', 'financial:evaluate_farm_credit_score',
    'financial:disburse_kcc_loan', 'financial:manage_credit_schemes',
    'verification:submit_request', 'verification:upload_documents'
  )
  ON CONFLICT DO NOTHING;

  -- (8) Government Officer Permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_gov_id, id FROM public.permissions 
  WHERE code IN (
    'gov:view_district_yield_stats', 'gov:disburse_subsidies',
    'gov:publish_mandi_tariffs', 'gov:broadcast_weather_emergencies',
    'verification:submit_request', 'verification:upload_documents'
  )
  ON CONFLICT DO NOTHING;

  -- (9) Verifier Permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_verifier_id, id FROM public.permissions 
  WHERE code IN (
    'verification:review_queue', 'verification:approve_reject',
    'verification:view_audit_logs', 'marketplace:view_catalog'
  )
  ON CONFLICT DO NOTHING;

  -- (10) Admin Permissions (All permissions)
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_admin_id, id FROM public.permissions
  ON CONFLICT DO NOTHING;

END $$;
