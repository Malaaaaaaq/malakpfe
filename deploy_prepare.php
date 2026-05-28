<?php
/**
 * Script de préparation au déploiement ParLak
 * 
 * Usage : php deploy_prepare.php
 * 
 * Ce script génère les fichiers nécessaires pour déployer :
 * - Backend Laravel → AlwaysData (PHP + MySQL)
 * - Frontend React → Vercel
 */

echo "╔══════════════════════════════════════════╗\n";
echo "║    Préparation déploiement ParLak       ║\n";
echo "╚══════════════════════════════════════════╝\n\n";

// ─── 1. Générer le .env.production pour AlwaysData ─────
echo "[1/4] Génération du .env.production...\n";

$productionEnv = <<<ENV
APP_NAME=ParLak
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://VOTRE_DOMAINE.alwaysdata.net

DB_CONNECTION=mysql
DB_HOST=mysql-VOTRE_COMPTE.alwaysdata.net
DB_PORT=3306
DB_DATABASE=VOTRE_COMPTE_parlak
DB_USERNAME=VOTRE_COMPTE
DB_PASSWORD=VOTRE_MOT_DE_PASSE_MYSQL

SESSION_DRIVER=database
SESSION_LIFETIME=120

QUEUE_CONNECTION=sync

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=malaktamrani6@gmail.com
MAIL_PASSWORD=kzqpgfqdezjhmqce
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=malaktamrani6@gmail.com
MAIL_FROM_NAME="\${APP_NAME}"

FILESYSTEM_DISK=local
ENV;

file_put_contents(__DIR__ . '/backend/.env.production', $productionEnv);
echo "   ✅ backend/.env.production créé\n";
echo "   ⚠️  Remplacez VOTRE_COMPTE, VOTRE_DOMAINE, VOTRE_MOT_DE_PASSE_MYSQL\n\n";

// ─── 2. Générer le dossier public_html pour AlwaysData ─────
echo "[2/4] Génération du dossier public_html (AlwaysData)...\n";

$publicDir = __DIR__ . '/public_html';
if (!is_dir($publicDir)) {
    mkdir($publicDir, 0755, true);
}

// index.php adapté pour AlwaysData
$indexPhp = <<<'PHP'
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Maintenance mode
if (file_exists($maintenance = __DIR__.'/../parlak/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Autoload
require __DIR__.'/../parlak/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__.'/../parlak/bootstrap/app.php';

$app->handleRequest(Request::capture());
PHP;

file_put_contents($publicDir . '/index.php', $indexPhp);

// .htaccess pour AlwaysData
$htaccess = <<<'HTACCESS'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Redirect trailing slashes
    RewriteRule ^(.*)/$ /$1 [L,R=301]

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Handle X-XSRF-Token Header
    RewriteCond %{HTTP:x-xsrf-token} .
    RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]

    # Redirect to index.php
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

# Security: block access to sensitive files
<FilesMatch "\.(env|git|htaccess|log)$">
    Require all denied
</FilesMatch>
HTACCESS;

file_put_contents($publicDir . '/.htaccess', $htaccess);
echo "   ✅ public_html/index.php créé\n";
echo "   ✅ public_html/.htaccess créé\n\n";

// ─── 3. Générer le vercel.json (frontend) ─────
echo "[3/4] Vérification du vercel.json (frontend)...\n";
if (file_exists(__DIR__ . '/pfemalak/vercel.json')) {
    echo "   ✅ pfemalak/vercel.json déjà existant\n\n";
} else {
    file_put_contents(__DIR__ . '/pfemalak/vercel.json', json_encode([
        'framework' => 'vite',
        'buildCommand' => 'npm run build',
        'outputDirectory' => 'dist',
        'installCommand' => 'npm install',
    ], JSON_PRETTY_PRINT));
    echo "   ✅ pfemalak/vercel.json créé\n\n";
}

// ─── 4. Instructions ─────
echo "[4/4] Instructions de déploiement :\n";
echo "╔══════════════════════════════════════════════════════════════╗\n";
echo "║                    PROCÉDURE DE DÉPLOIEMENT                 ║\n";
echo "╠══════════════════════════════════════════════════════════════╣\n";
echo "║                                                              ║\n";
echo "║ 1. CRÉER UN COMPTE ALWAYSDATA                                ║\n";
echo "║    Aller sur https://www.alwaysdata.com/fr                   ║\n";
echo "║    Créer un compte gratuit                                   ║\n";
echo "║                                                              ║\n";
echo "║ 2. CRÉER UNE BASE DE DONNÉES MYSQL                           ║\n";
echo "║    Dans AlwaysData → Bases de données → MySQL                ║\n";
echo "║    Notez: Hôte, Nom de la base, Utilisateur, Mot de passe    ║\n";
echo "║                                                              ║\n";
echo "║ 3. CONFIGURER .env.production                                ║\n";
echo "║    Éditer backend/.env.production avec vos identifiants      ║\n";
echo "║    Renommer en .env                                          ║\n";
echo "║    Puis lancer: php artisan key:generate                     ║\n";
echo "║                                                              ║\n";
echo "║ 4. UPLOADER VIA FTP (FileZilla ou autre)                     ║\n";
echo "║    ┌─────────────────────────────────────────────────────┐   ║\n";
echo "║    │ FTP SERVER: ftp-VOTRE_COMPTE.alwaysdata.net         │   ║\n";
echo "║    │ USERNAME: VOTRE_COMPTE                              │   ║\n";
echo "║    │ PASSWORD: votre mot de passe AlwaysData             │   ║\n";
echo "║    └─────────────────────────────────────────────────────┘   ║\n";
echo "║                                                              ║\n";
echo "║    Structure sur le serveur :                                ║\n";
echo "║    ~/                                                        ║\n";
echo "║    ├── www/        <- Uploadez le dossier public_html/* ici  ║\n";
echo "║    │   ├── index.php                                         ║\n";
echo "║    │   └── .htaccess                                         ║\n";
echo "║    └── parlak/     <- Uploadez tout le dossier backend/* ici ║\n";
echo "║        ├── app/                                              ║\n";
echo "║        ├── config/                                           ║\n";
echo "║        ├── .env (renommer .env.production)                   ║\n";
echo "║        └── ...                                               ║\n";
echo "║                                                              ║\n";
echo "║ 5. LANCER LES MIGRATIONS (SSH ou web)                        ║\n";
echo "║    En SSH: cd ~/parlak && php artisan migrate --force        ║\n";
echo "║    Ou créer un route /migrate temporaire (décommentez)       ║\n";
echo "║                                                              ║\n";
echo "║ 6. DÉPLOYER LE FRONTEND SUR VERCEL                          ║\n";
echo "║    - Push le projet sur GitHub                               ║\n";
echo "║    - Aller sur https://vercel.com/new                        ║\n";
echo "║    - Importer le dépôt GitHub                                ║\n";
echo "║    - Root Directory: pfemalak                                ║\n";
echo "║    - Environment Variable: VITE_API_URL                      ║\n";
echo "║      → https://VOTRE_COMPTE.alwaysdata.net/api               ║\n";
echo "║    - Déployer !                                              ║\n";
echo "║                                                              ║\n";
echo "╚══════════════════════════════════════════════════════════════╝\n";

// Sauvegarder les instructions dans un fichier
$instructions = file_get_contents(__DIR__ . '/deploy_prepare.php');
preg_match('/PROCÉDURE DE DÉPLOIEMENT.*?(?=```|$)/s', '', $instructions);
file_put_contents(__DIR__ . '/DEPLOY.md', <<<MD
# Procédure de déploiement ParLak

## Backend → AlwaysData (gratuit)

1. Créer un compte sur https://www.alwaysdata.com/fr
2. Créer une base MySQL (Bases de données → MySQL)
3. Copier \`backend/.env.production\` vers \`backend/.env\` et renseigner vos identifiants
4. \`cd backend && php artisan key:generate\`
5. Uploader via FTP :
   - Contenu de \`public_html/\` → \`~/www/\`
   - Contenu de \`backend/\` → \`~/parlak/\`
6. \`cd ~/parlak && php artisan migrate --force\`
7. \`php artisan storage:link\`

## Frontend → Vercel (gratuit)

1. Push le projet sur GitHub
2. Aller sur https://vercel.com/new
3. Importer le dépôt → Root Directory: \`pfemalak\`
4. Ajouter env variable: \`VITE_API_URL\` = \`https://VOTRE-DOMAINE.alwaysdata.net/api\`
5. Déployer !
MD);
echo "\n📄 Instructions sauvegardées dans DEPLOY.md\n\n";

echo "✅ Prêt ! Suivez les étapes ci-dessus.\n";
