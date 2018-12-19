<?php
// generate password
$passwordHash = password_hash(
    '5HPytvVcaNN35fHJ',
    PASSWORD_BCRYPT,
    ['cost' => 12]
);
echo $passwordHash;
?>