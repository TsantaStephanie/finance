<?php
require_once 'api/config.php';

try {
    $pdo = getConnection();
    echo "OK - Connexion réussie";
} catch (Exception $e) {
    echo "ERREUR - " . $e->getMessage();
}
?>
