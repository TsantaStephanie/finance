INSERT INTO depenses_interets_dette (type_dette, interets_2024, interets_2025, observation) VALUES
('Dette extérieure', 287.6, 314.2, 'Paiement des intérêts sur la dette extérieure du pays'),
('Dette intérieure', 384.4, 442.2, 'Interets sur les titres émis par le Trésor public, taux moyen de 13%');

INSERT INTO depenses_soldes_pensions (libelle, lfr_2024, lf_2025, ecart, observation) VALUES
('Depenses de solde', 3814.5, 3846.4, 31.9, 'Masse salariale des agents de l Etat'),
('Solde PIB nominal (%)', 4.8, 4.3, -0.5, 'Indicateur de part du PIB'),
('Solde Recettes fiscales nettes (%)', 47.9, 40.5, -7.4, 'Part des salaires dans les recettes fiscales'),
('Solde Depenses totales (%)', 29.9, 23.6, -6.3, 'Part des salaires dans les depenses totales'),
('Subvention CRCM (Caisse de Retraite Civile et Militaire)', 278.4, 296.2, 17.8, 'Hausse due a l augmentation du nombre de retraites');

-- ============================
-- INSERTS : DEPENSES - FONCTIONNEMENT
-- ============================
INSERT INTO depenses_fonctionnement (nature_depense, annee_2024, annee_2025, ecart, observation) VALUES
('Indemnites', 244.8, 244.8, 0.0, 'Aucune variation prevue en 2025'),
('Biens et services', 573.2, 504.7, -68.5, 'Rationalisation des achats et prestations'),
('Transferts et subventions', 2251.0, 1554.8, -696.2, 'Reduction des transferts aux institutions'),
('Total depenses de fonctionnement hors solde', 3069.0, 2304.3, -764.7, 'Baisse globale de pres de 25 pourcent des depenses hors soldes');

-- ============================
-- INSERTS : DEPENSES - INVESTISSEMENT
-- ============================
INSERT INTO depenses_investissement (categorie, lfr_2024, lf_2025, observation) VALUES
('Total investissements publics', 4520.4, 8265.8, 'Hausse de 82.9 pourcent par rapport a 2024'),
('PIP sur financement interne', 1262.5, 2368.4, 'Financement interne'),
('PIP sur financement externe', 3265.6, 5897.4, 'Financement externe'),
('Energie et transition ecologique', NULL, NULL, 'Projets hydroelectriques Mandraka III, Volobe, installation de 150 MW solaires'),
('Agriculture et securite alimentaire', NULL, NULL, 'Riziculture, irrigation, mecanisation PFUMVUDZA, usines d engrais'),
('Infrastructures et amenagement du territoire', NULL, NULL, 'RN13, autoroute Tana Toamasina, pipeline Efaho, transport urbain'),
('Sante et education', NULL, NULL, 'Construction d ecoles, cantines, centres de sante, distribution de vaccins'),
('Digitalisation et gouvernance', NULL, NULL, 'Distribution des karinem pokontany avec QR code');

-- ============================
-- INSERTS : DEPENSES - MINISTERES
-- ============================
INSERT INTO depenses_ministeres (ministere, lfr_2024, lf_2025) VALUES
('Presidence de la Republique', 177.1, 224.7),
('Senat', 22.1, 21.3),
('Assemblee Nationale', 87.4, 85.9),
('Haute Cour Constitutionnelle', 11.9, 9.3),
('Primature', 278.3, 339.9),
('Conseil du Fampihavanana Malagasy', 6.7, 6.3),
('Commission Electorale Nationale Independante', 113.3, 16.4),
('Ministere de la Defense Nationale', 557.0, 543.2),
('Ministere des Affaires Etrangeres', 99.2, 104.7),
('Ministere de la Justice', 199.6, 219.8),
('Ministere de l Interieur', 150.2, 134.7),
('Ministere de l Economie et des Finances', 2848.0, 2332.7),
('Ministere de la Securite Publique', 228.3, 229.2),
('Ministere de l Industrialisation et du Commerce', 113.2, 119.6),
('Ministere de la Decentralisation et de l Amenagement du Territoire', 356.8, 568.1),
('Ministere du Travail, de l Emploi et de la Fonction Publique', 31.8, 33.7),
('Ministere du Tourisme et de l Artisanat', 19.2, 43.9),
('Ministere de l Enseignement Superieur et de la Recherche Scientifique', 284.2, 285.6),
('Ministere de l Environnement et du Developpement Durable', 94.4, 188.8),
('Ministere de l Education Nationale', 1532.8, 1562.0),
('Ministere des Transports et de la Meteorologie', 63.9, 216.3),
('Ministere de la Sante Publique', 716.6, 921.0),
('Ministere de la Communication et de la Culture', 38.4, 32.1),
('Ministere des Travaux Publics', 1217.3, 2327.5),
('Ministere des Mines et des Ressources Strategiques', 18.3, 18.1),
('Ministere de l Energie et des Hydrocarbures', 407.9, 1332.0),
('Ministere de l Eau, de l Assainissement et de l Hygiene', 306.1, 600.2),
('Ministere de l Agriculture et de l Elevage', 469.8, 795.5),
('Ministere de la Peche et de l Economie Bleue', 29.9, 28.8),
('Ministere de l Enseignement Technique et de la Formation Professionnelle', 103.7, 94.8),
('Ministere du Developpement Numerique, des Postes et Telecommunications', 8.4, 8.8),
('Ministere de la Population et des Solidarites', 99.1, 193.4),
('Ministere de la Jeunesse et des Sports', 40.5, 58.1),
('Secretariat d Etat en charge des Nouvelles Villes et de l Habitat', 247.1, 138.8),
('Ministere delegue charge de la Gendarmerie', 414.8, 446.4),
('Secretariat d Etat en charge de la Souverainete Alimentaire', 0.0, 127.3);

-- ============================
-- INSERTS : RECETTES FISCALES
-- ============================
INSERT INTO recettes_fiscales (nature_impot, lfr_2024, lf_2025) VALUES
('Impot sur les revenus', 1179.0, 1411.4),
('Impot sur les revenus salariaux et assimiles', 848.2, 889.9),
('Impot sur les revenus des capitaux mobiliers', 78.2, 93.7),
('Impot sur les plus values immobilieres', 14.0, 18.3),
('Impot synthetique', 132.3, 164.7),
('Droit d enregistrement', 49.0, 62.8),
('Taxe sur la valeur ajoutee (y compris TTM)', 1400.2, 1742.2),
('Impot sur les marches publics', 148.7, 250.0),
('Droit d accise (y compris taxe environnementale)', 754.1, 955.4),
('Taxes sur les assurances', 17.2, 20.6),
('Droit de timbre', 14.1, 16.8),
('Autres', 1.5, 2.7);

-- ============================
-- INSERTS : RECETTES DOUANIERES
-- ============================
INSERT INTO recettes_douanieres (nature_droit, lfr_2024, lf_2025) VALUES
('Droit de douane', 847.5, 1010.7),
('TVA a l importation', 1768.3, 2148.3),
('Taxe sur les produits petroliers', 308.0, 326.0),
('TVA sur les produits petroliers', 842.8, 879.0),
('Droit de navigation', 1.2, 1.9),
('Autres', 0.2, 0.1);

-- ============================
-- INSERTS : RECETTES NON FISCALES
-- ============================
INSERT INTO recettes_non_fiscales (type_recette, lfr_2024, lf_2025) VALUES
('Dividendes', 89.5, 120.2),
('Productions immobilieres financieres', 0.5, 2.1),
('Redevance de peche', 10.0, 15.0),
('Redevances minieres', 84.9, 331.2),
('Autres redevances', 9.7, 10.0),
('Produits des activites et autres', 11.1, 8.1),
('Autres', 140.1, 5.2);

-- ============================
-- INSERTS : DONS
-- ============================
INSERT INTO dons (type_don, lf_2024, lf_2025) VALUES
('Courants', 0.3, 31.0),
('Capital', 1086.0, 2445.6);