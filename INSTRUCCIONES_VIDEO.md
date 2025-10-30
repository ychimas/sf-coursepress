# Instrucciones: Personalización de Cursos

## 1. Video Personalizado en Index

### ¿Qué hace?
Personaliza el video de fondo de la página principal (index.html) del curso.

### Cómo usar
1. **Paso 1: Información Básica**
   - Campo: "Video Principal (Opcional)"
   - Click para subir video (MP4, WebM, OGG)
   - Si no subes video, se usa el por defecto

### Resultado
- **Con video:** `assets/video/custom_video.mp4`
- **Sin video:** `assets/video/background_index.mp4` (por defecto)

---

## 2. Imágenes en Momentos Interactivos

### ¿Qué hace?
Agrega imágenes personalizadas a actividades interactivas de cada momento.

### Cómo usar
1. **Paso 2: Estructura del Curso**
   - Crea una lección
   - Agrega un momento
   - Selecciona tipo: "Interactivo"
   - Aparecerá opción "Imagen (Opcional)"
   - Click para subir imagen (JPG, PNG, WebP, etc.)

### Resultado
La imagen se guarda en:
```
module/leccion#/momento#_#/img/img.[extensión]
```

Ejemplos:
- Lección 1, Momento 2 → `module/leccion1/momento1_2/img/img.webp`
- Lección 3, Momento 1 → `module/leccion3/momento3_1/img/img.png`

### En el HTML
La imagen aparece automáticamente en el template interactivo:
```html
<img src="./img/img.webp" alt="Actividad" />
```

---

## Estructura de Archivos Generados

```
mi-curso/
├── assets/
│   └── video/
│       ├── background_index.mp4 (por defecto)
│       └── custom_video.mp4 (opcional)
├── module/
│   ├── leccion1/
│   │   ├── momento1_1/
│   │   │   ├── img/
│   │   │   │   └── img.webp (si se subió)
│   │   │   ├── index.html
│   │   │   └── ...
│   │   └── momento1_2/
│   └── leccion2/
├── index.html
└── ...
```

## Notas Técnicas

- Archivos se guardan en base64 durante creación
- Se convierten a binarios al guardar el curso
- NO se incluyen en metadata JSON (por tamaño)
- Carpetas se crean automáticamente si no existen
- La extensión de la imagen se preserva (jpg, png, webp, etc.)
