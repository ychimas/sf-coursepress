# Implementación de Cursos Locales

## Resumen

Se ha implementado un sistema para guardar cursos en el proyecto local en lugar de descargarlos inmediatamente como ZIP. Ahora los cursos se crean, editan y almacenan en la carpeta `cursos/` del proyecto, y solo se descargan cuando el usuario lo solicita desde el Dashboard.

## Cambios Realizados

### 1. Estructura de Carpetas

```
sf-coursepress/
├── cursos/                    # Nueva carpeta para cursos guardados
│   └── [nombre-curso]/        # Cada curso en su carpeta
│       ├── css/
│       ├── js/
│       ├── lecciones/
│       ├── index.html
│       ├── imsmanifest.xml
│       ├── curso-config.js
│       └── course-metadata.json  # Metadata del curso
```

### 2. Nuevas API Routes

#### `/api/cursos/save` (POST)
- Guarda un nuevo curso en `cursos/[folderName]`
- Genera todos los archivos SCORM
- Guarda metadata en `course-metadata.json`

#### `/api/cursos/list` (GET)
- Lista todos los cursos guardados
- Retorna información básica de cada curso

#### `/api/cursos/get` (POST)
- Obtiene los datos completos de un curso específico
- Usado para edición

#### `/api/cursos/update` (PUT)
- Actualiza un curso existente
- Regenera todos los archivos con los nuevos datos

#### `/api/cursos/download` (POST)
- Genera y descarga el ZIP de un curso
- Solo se ejecuta cuando el usuario lo solicita

#### `/api/cursos/delete` (DELETE)
- Elimina un curso del filesystem

### 3. Flujo de Trabajo Actualizado

#### Crear Curso
1. Usuario completa los 3 pasos en `/creator`
2. Al hacer clic en "Crear Curso", se guarda en `cursos/`
3. Redirige al Dashboard
4. **NO se descarga ZIP automáticamente**

#### Editar Curso
1. Desde Dashboard, clic en "Editar Curso"
2. Abre `/edit/[courseId]` con los datos del curso
3. Permite modificar información básica y estructura
4. Al guardar, regenera todos los archivos

#### Descargar Curso
1. Desde Dashboard, clic en "Descargar ZIP"
2. Genera el ZIP del curso
3. Descarga el archivo
4. **Solo cuando el usuario lo solicita**

### 4. Componentes Actualizados

#### `/app/creator/page.tsx`
- Cambiado de descargar ZIP a guardar localmente
- Usa `/api/cursos/save` en lugar de `/api/generate-course`
- Redirige al Dashboard después de crear

#### `/app/dashboard/page.tsx`
- Muestra cursos guardados localmente
- Separación entre "Mis Cursos" y "Proyectos Externos"
- Botones: Editar, Descargar ZIP, Eliminar

#### `/app/edit/[courseId]/page.tsx` (NUEVO)
- Página de edición de cursos
- Tabs para Información Básica y Estructura
- Guarda cambios con `/api/cursos/update`

## Ventajas de esta Implementación

1. **Edición Fácil**: Los cursos están en el proyecto, se pueden editar desde el navegador
2. **Sin Limitaciones del Navegador**: No hay problemas de acceso a archivos locales
3. **Workflow Mejorado**: Crear → Editar → Descargar cuando esté listo
4. **Persistencia**: Los cursos se mantienen en el proyecto
5. **Flexibilidad**: Se puede editar la estructura completa del curso

## Uso

### Crear un Curso
1. Ir a `/creator`
2. Completar los 3 pasos
3. Clic en "Crear Curso"
4. El curso se guarda en `cursos/[nombre-carpeta]`

### Editar un Curso
1. Ir a `/dashboard`
2. Buscar el curso en "Mis Cursos"
3. Clic en "Editar Curso"
4. Modificar información o estructura
5. Clic en "Guardar Cambios"

### Descargar un Curso
1. Ir a `/dashboard`
2. Buscar el curso en "Mis Cursos"
3. Clic en "Descargar ZIP"
4. El archivo ZIP se descarga automáticamente

### Eliminar un Curso
1. Ir a `/dashboard`
2. Buscar el curso en "Mis Cursos"
3. Clic en "Eliminar"
4. Confirmar eliminación

## Notas Técnicas

- Los cursos se guardan en el filesystem del servidor Next.js
- Cada curso tiene su propia carpeta con estructura SCORM completa
- El archivo `course-metadata.json` contiene los datos originales del curso
- La regeneración de archivos es automática al editar
- Compatible con el sistema de generación SCORM existente

## Próximos Pasos Sugeridos

1. **Editor de Contenido HTML**: Permitir editar el contenido de cada momento
2. **Preview en Vivo**: Vista previa del curso antes de descargar
3. **Versionado**: Guardar versiones anteriores del curso
4. **Importar Curso**: Subir un ZIP y convertirlo a curso editable
5. **Colaboración**: Compartir cursos entre usuarios
