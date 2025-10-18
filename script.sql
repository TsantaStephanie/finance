-- ======================================
--   BASE DE DONNÉES : budget_2025
-- ======================================
CREATE DATABASE IF NOT EXISTS finance;
USE finance;

-- ======================
-- TABLE : depenses_interets_dette
-- ======================
CREATE TABLE depenses_interets_dette (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_dette VARCHAR(100),
  interets_2024 DECIMAL(12,1),
  interets_2025 DECIMAL(12,1),
  observation TEXT
);

-- ======================
-- TABLE : depenses_soldes_pensions
-- ======================
CREATE TABLE depenses_soldes_pensions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(150),
  lfr_2024 DECIMAL(12,1),
  lf_2025 DECIMAL(12,1),
  ecart DECIMAL(12,1),
  observation TEXT
);

-- ======================
-- TABLE : depenses_fonctionnement
-- ======================
CREATE TABLE depenses_fonctionnement (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nature_depense VARCHAR(150),
  annee_2024 DECIMAL(12,1),
  annee_2025 DECIMAL(12,1),
  ecart DECIMAL(12,1),
  observation TEXT
);

-- ======================
-- TABLE : depenses_investissement
-- ======================
CREATE TABLE depenses_investissement (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categorie VARCHAR(150),
  lfr_2024 DECIMAL(12,1),
  lf_2025 DECIMAL(12,1),
  observation TEXT
);

-- ======================
-- TABLE : depenses_ministeres
-- ======================
CREATE TABLE depenses_ministeres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ministere VARCHAR(200),
  lfr_2024 DECIMAL(12,1),
  lf_2025 DECIMAL(12,1)
);


CREATE TABLE recettes_fiscales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nature_impot VARCHAR(150),
  lfr_2024 DECIMAL(12,1),
  lf_2025 DECIMAL(12,1)
);

-- ======================
-- TABLE : recettes_douanieres
-- ======================
CREATE TABLE recettes_douanieres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nature_droit VARCHAR(150),
  lfr_2024 DECIMAL(12,1),
  lf_2025 DECIMAL(12,1)
);

-- ======================
-- TABLE : recettes_non_fiscales
-- ======================
CREATE TABLE recettes_non_fiscales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_recette VARCHAR(150),
  lfr_2024 DECIMAL(12,1),
  lf_2025 DECIMAL(12,1)
);

CREATE TABLE dons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_don VARCHAR(100),
  lf_2024 DECIMAL(12,1),
  lf_2025 DECIMAL(12,1)
);