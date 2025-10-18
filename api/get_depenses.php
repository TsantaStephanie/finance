<?php
require_once 'config.php';

try {
    $pdo = getConnection();

   $data = [];

    // Dépenses de fonctionnement
    $stmt = $pdo->query("SELECT * FROM depenses_fonctionnement");
    $data['fonctionnement'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Dépenses d'investissement
    $stmt = $pdo->query("SELECT * FROM depenses_investissement");
    $data['investissement'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Intérêts de la dette
    $stmt = $pdo->query("SELECT * FROM depenses_interets_dette");
    $data['interets'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Soldes et pensions
    $stmt = $pdo->query("SELECT * FROM depenses_soldes_pensions");
    $data['pensions'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Dépenses par ministère
    $stmt = $pdo->query("SELECT * FROM depenses_ministeres");
    $data['ministeres'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $data
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>