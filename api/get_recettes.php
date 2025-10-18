<?php
require_once 'config.php';

try {
    $pdo = getConnection();
    
    // Récupération des recettes fiscales
    $stmt = $pdo->query("SELECT * FROM recettes_fiscales ORDER BY lf_2025 DESC");
    $fiscales = $stmt->fetchAll();
    
    // Récupération des recettes douanières
    $stmt = $pdo->query("SELECT * FROM recettes_douanieres ORDER BY lf_2025 DESC");
    $douanieres = $stmt->fetchAll();
    
    // Récupération des recettes non fiscales
    $stmt = $pdo->query("SELECT * FROM recettes_non_fiscales ORDER BY lf_2025 DESC");
    $nonFiscales = $stmt->fetchAll();
    
    // Récupération des dons
    $stmt = $pdo->query("SELECT * FROM dons ORDER BY lf_2025 DESC");
    $dons = $stmt->fetchAll();
    
    $data = [
        'fiscales' => $fiscales,
        'douanieres' => $douanieres,
        'nonFiscales' => $nonFiscales,
        'dons' => $dons
    ];
    
    jsonResponse(true, $data);
    
} catch (Exception $e) {
    jsonResponse(false, null, $e->getMessage());
}
?>
