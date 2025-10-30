# Configuración de GitHub OAuth

## Pasos para configurar:

### 1. Crear GitHub OAuth App

1. Ve a: https://github.com/settings/developers
2. Click en "New OAuth App"
3. Completa:
   - **Application name**: SF CoursePress
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/github/callback
4. Click "Register application"
5. Copia el **Client ID**
6. Click "Generate a new client secret" y copia el **Client Secret**

### 2. Configurar variables de entorno

Edita el archivo `.env.local`:

```env
GITHUB_CLIENT_ID=tu_client_id_copiado
GITHUB_CLIENT_SECRET=tu_client_secret_copiado
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Reiniciar el servidor

```bash
npm run dev
```

## Cómo funciona:

1. Usuario hace click en botón GitHub en un curso
2. Si no está conectado, aparece botón "Conectar con GitHub"
3. Al hacer click, se abre GitHub para autorizar
4. GitHub redirige de vuelta y guarda el token
5. El modal muestra automáticamente:
   - Usuario de GitHub conectado
   - Repositorio más reciente
   - Branch actual (main)
6. Usuario puede hacer "Push Changes" para subir el curso

## Gratis y sin límites:

- ✅ OAuth completamente gratis
- ✅ API de GitHub gratis (5000 requests/hora)
- ✅ Repositorios ilimitados
- ✅ Sin costos adicionales
