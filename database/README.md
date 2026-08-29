# AgriVeda Database Architecture & Data Dictionary

## 1. Overview
The AgriVeda database is built on PostgreSQL / Supabase, providing scalable multi-role authentication, verification lifecycle management, granular Role-Based Access Control (RBAC), multi-user organization membership, and role-specific data models for Farmers, B2B Businesses, Students, Researchers, Institutions, Banks, and Government Officers.

---

## 2. Migration Execution Order
Execute the migration scripts in the following order:
1. `01_extensions_and_enums.sql` - Core extensions and initial enums.
2. `02_profiles.sql` - Base profiles table linked to `auth.users`.
3. `03_chatbot_history.sql` - AI Chat sessions and messages.
4. `04_pathology.sql` - Crop disease diagnosis reports.
5. `05_marketplace.sql` - Marketplace products, quotes, and orders.
6. `06_community.sql` - Agri community posts and replies.
7. `07_mapcn_network.sql` - MAPCN (Mandi & APMC Price Commodity Network) centers, arrivals, and alerts.
8. `08_crop_calendar.sql` - Crop sowing and management calendar.
9. `09_mandi_prices.sql` - Mandi commodity price tracker.
10. `10_triggers_and_realtime.sql` - User creation triggers and realtime publications.
11. `11_roles_verification_and_profiles.sql` - Extended RBAC, Organizations, Role-Specific Profiles, Verification Subsystem, Documents, Consents, and Audit Logs.
12. `12_verification_triggers_and_views.sql` - Verification sync triggers, modtime triggers, and analytical views.
13. `13_seed_roles_and_permissions.sql` - Standard system roles and permission catalogue seeding.

*(Alternatively, use `full_agriveda_schema.sql` for single-step provisioning in fresh environments).*

---

## 3. Entity-Relationship & Architecture Overview

```
auth.users (Supabase Auth)
  │ (1:1)
  ▼
public.profiles (Root Identity)
  ├── (1:N) ──► user_roles ◄── (N:1) ── roles ── (M:N) ── permissions
  ├── (1:N) ──► user_permissions (Direct overrides)
  ├── (1:N) ──► organization_memberships ◄── (N:1) ── organizations
  │
  ├── (1:1) ──► farmer_profiles
  │                ├── (1:N) ──► farmland_plots ── (1:N) ──► farmland_photos
  │                └── (1:N) ──► farmer_crop_history
  │
  ├── (1:1) ──► business_profiles (B2B Buyers, Exporters, Processors)
  ├── (1:1) ──► student_profiles (Agricultural Universities)
  ├── (1:1) ──► researcher_profiles (Agronomists, Soil Scientists)
  ├── (1:1) ──► government_profiles (Agri Department, Subsidies)
  │
  ├── (1:N) ──► bank_accounts (Tokenized & Masked)
  ├── (1:N) ──► verification_requests
  │                ├── (1:N) ──► verification_documents ──► document_verification_history
  │                └── (1:N) ──► verification_audit_logs
  │
  └── (1:N) ──► user_consents (DPDP & GDPR Compliance)
```

---

## 4. Role-Specific Profile Schemas

### 1. Farmer (`farmer_profiles`, `farmland_plots`, `farmland_photos`, `farmer_crop_history`)
- **Personal Details**: Father/Spouse name, gender, DOB, education, primary language, masked Aadhaar (`aadhaar_masked`), Aadhaar SHA-256 hash (`aadhaar_hash`), PM-Kisan ID, Soil Health Card number.
- **Farmland / Plot Information**: Plot name, survey number, khata number, patta number, acreage, state, district, taluk/tehsil, village, pincode, GPS latitude/longitude, GeoJSON boundary polygon, soil type, soil pH, organic matter percentage, irrigation source (`Drip`, `Borewell`, `Canal`, `Rainfed`, `Sprinkler`), ownership type (`owned`, `leased`, `shared`).
- **Farmland Photos**: Geotagged images (`photo_url`, `photo_type`, `geotag_lat`, `geotag_lng`, `caption`).
- **Farming History & Production**: Season (`Kharif`, `Rabi`, `Zaid`), year, crop name, variety, acreage, actual yield (tons), expected production (tons), realized mandi prices.
- **Bank Accounts**: Encrypted/hashed account number, masked number, IFSC code, account type (`savings`, `kcc`), UPI ID.

### 2. B2B Business & Buyer (`business_profiles`)
- **Business Details**: Business name, trade name, owner/representative name, designation, contact email, contact phone.
- **Legal & Tax**: GSTIN, PAN, CIN, FSSAI license number.
- **Category & Capacity**: Business category (`Wholesaler`, `Retailer`, `Food Processor`, `Exporter`, `Input Manufacturer`, `Agri-Tech`, `FPO`), monthly procurement capacity (metric tons), annual turnover, operational regions, registered address, warehouse locations.
- **Procurement Requirements**: Structured JSON (`procurement_requirements`) with target commodities, quality grades, and monthly volumes.

### 3. Student (`student_profiles`)
- **Academic Enrollment**: Student ID number, university name, campus name, department, course/program (e.g., *B.Sc. Agriculture*, *M.Sc. Agronomy*), current academic year, current semester, admission year, expected graduation year.
- **Mentorship & Focus**: Guide/supervisor name, guide email, specialization field.
- **Verification Documents**: Student ID card, bonafide certificate, enrollment letter.

### 4. Research Scholar (`researcher_profiles`)
- **Credentials & Domain**: Researcher ID, institute name, department, research domain (e.g., *Crop Genetics*, *Pathology AI*, *Bio-Fertilizers*), designation (*Ph.D. Scholar*, *Postdoc*, *Scientist*), ORCID ID.
- **Projects & Funding**: Active project title, funding agency (*ICAR*, *DBT*, *DST*, *BIRAC*), grant ID, supervisor contact, publications count.

### 5. Institution (`institution_profiles` via `organizations`)
- **Organization Identity**: Institution name, legal name, organization type (`institution`), official domain (e.g. `@icar.gov.in`, `@tnau.ac.in`), physical address.
- **Accreditation**: Accreditation body (*ICAR*, *NAAC A++*, *UGC*, *AICTE*), grade, validity date.
- **Facilities & Services**: Departments list, services offered (soil testing, seed testing, extension advisory), testing laboratories count.

### 6. Bank & Financial Institution (`financial_institution_profiles` via `organizations`)
- **Institutional Details**: Financial institution name, subtype (*Public Sector Bank*, *RRB*, *Cooperative Bank*, *Agri-NBFC*), RBI registration / license number, IFSC prefix.
- **Authorized Nodal Officers**: Nodal officer name, designation, employee ID, official contact phone & email.
- **Credit Offerings**: Supported credit schemes (Kisan Credit Card / KCC, Agri Infrastructure Fund, Tractor loans, Warehouse receipt financing), branches count, head office address.

### 7. Government & Agriculture Department (`government_profiles`)
- **Official Details**: Department name, officer designation, official government employee ID, `.gov.in`/`.nic.in` email.
- **Jurisdiction**: Level (*National*, *State*, *District*, *Taluk_Block*, *Gram_Panchayat*), jurisdiction state, district, block.

---

## 5. Verification Subsystem & Lifecycle

```
[ pending ] ──► [ submitted ] ──► [ under_review ] ──► [ verified ]
                                          │
                                          └──► [ rejected ]
                                          │
                                          └──► [ expired / revoked ]
```

### Key Tables:
1. `verification_requests`: Tracks application status, stage, review notes, rejection codes, reviewer assignments, and timestamps.
2. `verification_documents`: Stores secure metadata references (file storage URI, MIME type, file size, SHA-256 checksum, document category, masked document numbers, encryption key identifiers). **No raw files are stored in the database.**
3. `document_verification_history`: Preserves granular review decisions and transition logs per document.
4. `verification_audit_logs`: Immutable compliance audit trail tracking all state changes, review decisions, and actions with IP and timestamp.

---

## 6. Access Control & Organization Membership

### Organization Roles (`org_role_enum`):
- `owner`: Full control over organization, billing, and membership.
- `admin`: Manage members, departmental profiles, and verify institutional submissions.
- `employee`: Standard business operational access.
- `researcher`: Conduct research trials, access shared data.
- `faculty`: Academic oversight and student verification.
- `student`: Enrolled student member under an institutional account.
- `officer`: Financial/regulatory officer with credit evaluation access.
- `viewer`: Read-only access to organization assets.

---

## 7. Analytical & Operational Views
- `vw_verified_farmers`: Aggregates verified farmer details, total verified acreage, and plot counts.
- `vw_verified_businesses`: Directory of verified buyers, processors, and vendors with procurement capacities.
- `vw_user_effective_permissions`: Resolves the combined permissions matrix per user.
- `vw_pending_verifications`: Priority queue for verification reviewers and compliance teams.
- `vw_organization_directory`: Public directory of accredited universities, institutions, banks, and FPOs.
