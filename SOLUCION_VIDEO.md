# Solución: Error al cargar video

## Problema
El video se creaba pero mostraba error "an error occurred while loading the video file"

## Causa
El archivo base64 no se estaba procesando o guardando correctamente como archivo binario.

## Solución Implementada

### 1. Validación en Frontend (step-one.tsx)
- Verifica que el archivo sea de tipo video
- Valida que el resultado del FileReader sea válido (empiece con 'data:')
- Agrega manejo de errores con mensajes al usuario
- Logs en consola para debugging

### 2. Procesamiento en Backend (route.ts)
- Valida que exista data antes de procesar
- Maneja correctamente el split del base64 (con o sin prefijo)
- Verifica que el base64 no esté vacío
- Try-catch para capturar errores
- Logs para tracking

## Cómo Probar

1. **Crear un curso nuevo**
2. **En Paso 1, subir un video:**
   - Usar un video MP4 válido (pequeño para pruebas, ej: 5-10MB)
   - Verificar en consola del navegador: "Video cargado: nombre.mp4, Tamaño: XXXX"
3. **Completar los pasos y crear curso**
4. **Verificar en consola del servidor:** "Video guardado exitosamente: nombre.mp4"
5. **Navegar a:** `cursos/[nombre-curso]/assets/video/custom_video.mp4`
6. **Abrir el video** - Debe reproducirse correctamente

## Si Persiste el Error

### Verificar:
1. **Tamaño del video:** Videos muy grandes pueden causar problemas
   - Recomendado: < 50MB
   - Máximo: Depende de configuración del servidor

2. **Formato del video:** 
   - Usar MP4 con codec H.264
   - Evitar formatos exóticos

3. **Consola del navegador:**
   - Buscar errores al cargar el archivo
   - Verificar que aparezca "Video cargado"

4. **Consola del servidor:**
   - Buscar errores al guardar
   - Verificar que aparezca "Video guardado exitosamente"

5. **Archivo generado:**
   - Verificar que el archivo .mp4 tenga tamaño > 0 bytes
   - Intentar abrirlo directamente con un reproductor

## Alternativa Manual

Si el problema persiste, puedes:
1. Crear el curso sin video personalizado
2. Copiar manualmente tu video a: `cursos/[nombre-curso]/assets/video/custom_video.mp4`
3. El index.html ya está configurado para usarlo

## Límites de Tamaño

Para videos grandes, considera:
- Usar servicios externos (YouTube, Vimeo)
- Comprimir el video antes de subirlo
- Ajustar límites en Next.js config si es necesario
