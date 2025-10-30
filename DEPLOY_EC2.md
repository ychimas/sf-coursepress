# Despliegue en AWS EC2

## Pasos para desplegar:

### 1. Conectar a EC2
```bash
ssh -i tu-key.pem ubuntu@TU_IP_EC2
```

### 2. Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Clonar el proyecto
```bash
git clone https://github.com/TU_USUARIO/sf-coursepress.git
cd sf-coursepress
```

### 4. Instalar dependencias
```bash
npm install
```

### 5. Configurar variables de entorno
```bash
cp .env.example .env.local
nano .env.local
```

Edita con tus valores:
```env
GITHUB_CLIENT_ID=tu_client_id_real
GITHUB_CLIENT_SECRET=tu_client_secret_real
NEXT_PUBLIC_APP_URL=http://TU_IP_EC2:3000
```

### 6. Crear directorios necesarios
```bash
mkdir -p cursos
mkdir -p projects
```

### 7. Build y ejecutar
```bash
npm run build
npm start
```

### 8. Ejecutar en background (con PM2)
```bash
sudo npm install -g pm2
pm2 start npm --name "sf-coursepress" -- start
pm2 save
pm2 startup
```

### 9. Configurar Security Group
En AWS Console, abre estos puertos:
- Puerto 22 (SSH)
- Puerto 3000 (HTTP)

## Acceder a la aplicación:
```
http://TU_IP_EC2:3000
```

## Actualizar el proyecto:
```bash
cd sf-coursepress
git pull
npm install
npm run build
pm2 restart sf-coursepress
```
