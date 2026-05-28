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