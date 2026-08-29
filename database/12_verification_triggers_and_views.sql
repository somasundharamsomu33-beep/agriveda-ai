-- ============================================================================
-- AgriVeda Database Schema Migration: 12_verification_triggers_and_views.sql
-- Description: Automated Timestamp Triggers, Verification Sync Logic,
--              Audit Logging Triggers, and Analytical / Operational Views.
-- Compatibility: PostgreSQL 14+, Supabase
-- Requires: 10_triggers_and_realtime.sql, 11_roles_verification_and_profiles.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ATTACH `updated_at` MODIFICATION TRIGGERS
-- ----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS update_roles_modtime ON roles;
CREATE TRIGGER update_roles_modtime BEFORE UPDATE ON roles 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_user_roles_modtime ON user_roles;
CREATE TRIGGER update_user_roles_modtime BEFORE UPDATE ON user_roles 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_user_permissions_modtime ON user_permissions;
CREATE TRIGGER update_user_permissions_modtime BEFORE UPDATE ON user_permissions 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_organizations_modtime ON organizations;
CREATE TRIGGER update_organizations_modtime BEFORE UPDATE ON organizations 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_org_memberships_modtime ON organization_memberships;
CREATE TRIGGER update_org_memberships_modtime BEFORE UPDATE ON organization_memberships 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_bank_accounts_modtime ON bank_accounts;
CREATE TRIGGER update_bank_accounts_modtime BEFORE UPDATE ON bank_accounts 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_farmer_profiles_modtime ON farmer_profiles;
CREATE TRIGGER update_farmer_profiles_modtime BEFORE UPDATE ON farmer_profiles 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_farmland_plots_modtime ON farmland_plots;
CREATE TRIGGER update_farmland_plots_modtime BEFORE UPDATE ON farmland_plots 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_business_profiles_modtime ON business_profiles;
CREATE TRIGGER update_business_profiles_modtime BEFORE UPDATE ON business_profiles 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_student_profiles_modtime ON student_profiles;
CREATE TRIGGER update_student_profiles_modtime BEFORE UPDATE ON student_profiles 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_researcher_profiles_modtime ON researcher_profiles;
CREATE TRIGGER update_researcher_profiles_modtime BEFORE UPDATE ON researcher_profiles 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_institution_profiles_modtime ON institution_profiles;
CREATE TRIGGER update_institution_profiles_modtime BEFORE UPDATE ON institution_profiles 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_financial_inst_profiles_modtime ON financial_institution_profiles;
CREATE TRIGGER update_financial_inst_profiles_modtime BEFORE UPDATE ON financial_institution_profiles 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_gov_profiles_modtime ON government_profiles;
CREATE TRIGGER update_gov_profiles_modtime BEFORE UPDATE ON government_profiles 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_verification_req_modtime ON verification_requests;
CREATE TRIGGER update_verification_req_modtime BEFORE UPDATE ON verification_requests 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_verification_docs_modtime ON verification_documents;
CREATE TRIGGER update_verification_docs_modtime BEFORE UPDATE ON verification_documents 
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

-- ----------------------------------------------------------------------------
-- 2. VERIFICATION STATUS SYNCHRONIZATION TRIGGER
-- Automatically updates the role-specific profile or organization status when a
-- verification request status changes.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sync_verification_request_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only execute if status has changed
  IF (TG_OP = 'UPDATE' AND OLD.status = NEW.status) THEN
    RETURN NEW;
  END IF;

  -- 1. Sync Farmer profile
  IF NEW.verification_type IN ('identity_kyc', 'land_ownership', 'organic_certification') THEN
    UPDATE public.farmer_profiles
    SET verification_status = NEW.status,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;

  -- 2. Sync Business profile
  IF NEW.verification_type = 'business_gst_pan' THEN
    UPDATE public.business_profiles
    SET verification_status = NEW.status,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    IF NEW.organization_id IS NOT NULL THEN
      UPDATE public.organizations
      SET verification_status = NEW.status,
          updated_at = NOW()
      WHERE id = NEW.organization_id;
    END IF;
  END IF;

  -- 3. Sync Student profile
  IF NEW.verification_type = 'academic_enrollment' THEN
    UPDATE public.student_profiles
    SET verification_status = NEW.status,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;

  -- 4. Sync Researcher profile
  IF NEW.verification_type = 'academic_enrollment' THEN
    UPDATE public.researcher_profiles
    SET verification_status = NEW.status,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;

  -- 5. Sync Institution profile
  IF NEW.verification_type = 'institutional_accreditation' AND NEW.organization_id IS NOT NULL THEN
    UPDATE public.organizations
    SET verification_status = NEW.status,
        updated_at = NOW()
    WHERE id = NEW.organization_id;
  END IF;

  -- 6. Sync Bank profile
  IF NEW.verification_type = 'financial_regulatory' AND NEW.organization_id IS NOT NULL THEN
    UPDATE public.organizations
    SET verification_status = NEW.status,
        updated_at = NOW()
    WHERE id = NEW.organization_id;
  END IF;

  -- 7. Sync Government Officer profile
  IF NEW.verification_type = 'government_officer' THEN
    UPDATE public.government_profiles
    SET verification_status = NEW.status,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;

  -- Record in verification audit logs
  INSERT INTO public.verification_audit_logs (
    request_id,
    actor_id,
    action,
    old_status,
    new_status,
    notes,
    metadata_json
  ) VALUES (
    NEW.id,
    COALESCE(NEW.reviewer_id, NEW.user_id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'request_submitted'
      WHEN NEW.status = 'verified' THEN 'request_verified'
      WHEN NEW.status = 'rejected' THEN 'request_rejected'
      WHEN NEW.status = 'under_review' THEN 'request_under_review'
      ELSE 'status_changed'
    END,
    CASE WHEN TG_OP = 'UPDATE' THEN OLD.status::text ELSE NULL END,
    NEW.status::text,
    COALESCE(NEW.reviewer_notes, NEW.submission_notes),
    jsonb_build_object(
      'verification_type', NEW.verification_type,
      'target_role', NEW.target_role,
      'rejection_reason_code', NEW.rejection_reason_code
    )
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_verification_status ON verification_requests;
CREATE TRIGGER trg_sync_verification_status
  AFTER INSERT OR UPDATE OF status ON verification_requests
  FOR EACH ROW EXECUTE PROCEDURE public.sync_verification_request_status();

-- ----------------------------------------------------------------------------
-- 3. DOCUMENT VERIFICATION AUDIT TRIGGER
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.log_document_verification_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.verification_status != NEW.verification_status) THEN
    -- Insert history entry
    INSERT INTO public.document_verification_history (
      document_id,
      reviewer_id,
      previous_status,
      new_status,
      notes
    ) VALUES (
      NEW.id,
      NEW.verified_by,
      OLD.verification_status,
      NEW.verification_status,
      NEW.verification_notes
    );

    -- Insert verification audit entry
    INSERT INTO public.verification_audit_logs (
      request_id,
      document_id,
      actor_id,
      action,
      old_status,
      new_status,
      notes
    ) VALUES (
      NEW.request_id,
      NEW.id,
      NEW.verified_by,
      'document_status_changed',
      OLD.verification_status::text,
      NEW.verification_status::text,
      NEW.verification_notes
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_document_verification ON verification_documents;
CREATE TRIGGER trg_log_document_verification
  AFTER UPDATE OF verification_status ON verification_documents
  FOR EACH ROW EXECUTE PROCEDURE public.log_document_verification_change();

-- ----------------------------------------------------------------------------
-- 4. AUTO-ASSIGN DEFAULT 'FARMER' ROLE ON PROFILE CREATION
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.assign_default_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role_id UUID;
  v_role_code VARCHAR(50);
BEGIN
  -- Determine role code from new profile or default to 'farmer'
  v_role_code := COALESCE(NEW.role::text, 'farmer');
  
  -- Look up role id
  SELECT id INTO v_role_id FROM public.roles WHERE code = v_role_code;
  
  IF v_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id, is_primary)
    VALUES (NEW.id, v_role_id, true)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;

  -- If the role is farmer, ensure farmer_profiles row exists
  IF v_role_code = 'farmer' THEN
    INSERT INTO public.farmer_profiles (user_id, total_landholding_acres)
    VALUES (NEW.id, COALESCE(NEW.farm_size_acres, 0))
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_default_user_role ON profiles;
CREATE TRIGGER trg_assign_default_user_role
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.assign_default_user_role();

-- ----------------------------------------------------------------------------
-- 5. ANALYTICAL & OPERATIONAL VIEWS
-- ----------------------------------------------------------------------------

-- (A) Verified Farmers Directory View
CREATE OR REPLACE VIEW public.vw_verified_farmers AS
SELECT 
  p.id AS user_id,
  p.name AS farmer_name,
  p.phone,
  p.location,
  p.avatar_url,
  p.language,
  fp.aadhaar_masked,
  fp.is_organic_certified,
  fp.organic_cert_number,
  fp.farming_experience_years,
  fp.verification_status,
  COALESCE(SUM(fp_plots.acreage), fp.total_landholding_acres, 0) AS verified_acreage,
  COUNT(fp_plots.id) AS total_plots,
  p.created_at AS member_since
FROM public.profiles p
JOIN public.farmer_profiles fp ON p.id = fp.user_id
LEFT JOIN public.farmland_plots fp_plots ON fp.user_id = fp_plots.farmer_id AND fp_plots.is_active = true AND fp_plots.deleted_at IS NULL
GROUP BY p.id, fp.user_id;

-- (B) Verified B2B Businesses & Buyers Directory View
CREATE OR REPLACE VIEW public.vw_verified_businesses AS
SELECT 
  bp.user_id,
  bp.business_name,
  bp.trade_name,
  bp.business_category,
  bp.owner_representative_name,
  bp.contact_email,
  bp.contact_phone,
  bp.gstin,
  bp.pan,
  bp.procurement_capacity_monthly_metric_tons,
  bp.procurement_requirements,
  bp.operational_regions,
  bp.registered_address,
  bp.verification_status,
  o.id AS organization_id,
  o.name AS organization_name,
  bp.created_at AS registered_at
FROM public.business_profiles bp
LEFT JOIN public.organizations o ON bp.organization_id = o.id;

-- (C) User Effective Permissions View
-- Computes the resolved set of permissions for each user combining role grants and user overrides
CREATE OR REPLACE VIEW public.vw_user_effective_permissions AS
WITH user_role_perms AS (
  SELECT 
    ur.user_id,
    p.code AS permission_code,
    p.module,
    p.name AS permission_name,
    'role' AS source
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  JOIN public.role_permissions rp ON r.id = rp.role_id
  JOIN public.permissions p ON rp.permission_id = p.id
  WHERE ur.is_active = true 
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
),
direct_overrides AS (
  SELECT 
    up.user_id,
    p.code AS permission_code,
    p.module,
    p.name AS permission_name,
    up.is_granted
  FROM public.user_permissions up
  JOIN public.permissions p ON up.permission_id = p.id
)
SELECT 
  urp.user_id,
  urp.permission_code,
  urp.module,
  urp.permission_name
FROM user_role_perms urp
LEFT JOIN direct_overrides do ON urp.user_id = do.user_id AND urp.permission_code = do.permission_code
WHERE COALESCE(do.is_granted, true) = true
UNION
SELECT 
  do.user_id,
  do.permission_code,
  do.module,
  do.permission_name
FROM direct_overrides do
WHERE do.is_granted = true;

-- (D) Pending Verification Queue for Reviewers / Admins
CREATE OR REPLACE VIEW public.vw_pending_verifications AS
SELECT 
  vr.id AS request_id,
  vr.user_id,
  p.name AS applicant_name,
  p.phone AS applicant_phone,
  p.location AS applicant_location,
  vr.organization_id,
  o.name AS organization_name,
  vr.verification_type,
  vr.target_role,
  vr.status,
  vr.current_stage,
  vr.submitted_at,
  vr.submission_notes,
  COUNT(vd.id) AS attached_documents_count,
  NOW() - vr.submitted_at AS waiting_duration
FROM public.verification_requests vr
JOIN public.profiles p ON vr.user_id = p.id
LEFT JOIN public.organizations o ON vr.organization_id = o.id
LEFT JOIN public.verification_documents vd ON vr.id = vd.request_id AND vd.deleted_at IS NULL
WHERE vr.status IN ('pending', 'submitted', 'under_review')
GROUP BY vr.id, p.id, o.id;

-- (E) Institutional & Banking Organizations Directory View
CREATE OR REPLACE VIEW public.vw_organization_directory AS
SELECT 
  o.id AS organization_id,
  o.name AS organization_name,
  o.legal_name,
  o.org_type,
  o.tax_identifier,
  o.city,
  o.district,
  o.state,
  o.website,
  o.official_email,
  o.official_phone,
  o.verification_status,
  COUNT(om.id) AS total_members,
  ip.institution_type,
  ip.accreditation_body,
  ip.services_offered_json,
  fip.institution_subtype AS bank_subtype,
  fip.supported_credit_schemes,
  o.created_at
FROM public.organizations o
LEFT JOIN public.organization_memberships om ON o.id = om.organization_id AND om.deleted_at IS NULL AND om.is_active = true
LEFT JOIN public.institution_profiles ip ON o.id = ip.organization_id
LEFT JOIN public.financial_institution_profiles fip ON o.id = fip.organization_id
WHERE o.deleted_at IS NULL
GROUP BY o.id, ip.organization_id, fip.organization_id;
