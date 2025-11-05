# 📖 Biblia PWA

Este proyecto busca proporcionar acceso completo a la Biblia en múltiples versiones y de fácil acceso con características nuevas de estudio bíblico y documentación personal por usuario.

## 🌟 Características Principales

- **PWA (Progressive Web App)**: Funciona offline y se puede instalar como aplicación nativa
- **Interfaz moderna**: Diseño intuitivo con tema claro/oscuro
- **Múltiples versiones**: Acceso a diferentes traducciones de la Biblia
- **Búsqueda avanzada**: Encuentra versículos por palabra clave
- **Navegación fluida**: Cambio rápido entre libros y capítulos
- **Responsive**: Optimizado para móviles, tablets y desktop
- **Configuración personalizable**: Ajuste de tamaño de fuente y preferencias

## 🚀 Tecnologías

- **Frontend**: React 19.1.0 + Vite
- **UI**: Tailwind CSS + Radix UI Components
- **PWA**: Service Worker + Web App Manifest
- **Iconos**: Lucide React
- **Gestión de paquetes**: pnpm

## 📁 Estructura del Proyecto

```
biblia/
├── bible-pwa/          # Aplicación PWA principal
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── services/   # API y servicios
│   │   └── ...
│   ├── public/         # Archivos estáticos y PWA
│   └── dist/          # Build de producción
├── docs/              # Documentación
└── README.md
```

## 🛠️ Instalación y Desarrollo

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/ivanbj96/biblia.git
   cd biblia/bible-pwa
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   pnpm dev
   ```

4. **Construir para producción**:
   ```bash
   pnpm build
   pnpm preview
   ```

## 📱 Instalación como PWA

1. Abre la aplicación en tu navegador
2. Busca el ícono de "Instalar" en la barra de direcciones
3. Haz clic en "Instalar" para agregar a tu dispositivo
4. ¡Disfruta de la experiencia nativa!

## 🎯 Funcionalidades

### ✅ Implementadas
- [x] Lectura de la Biblia por capítulos
- [x] Búsqueda de versículos
- [x] Navegación entre libros y capítulos
- [x] Configuración de lectura (tamaño de fuente)
- [x] Tema claro/oscuro
- [x] PWA con funcionamiento offline
- [x] Interfaz responsive

### 🔄 En desarrollo
- [ ] Múltiples versiones de la Biblia
- [ ] Notas personales por versículo
- [ ] Marcadores y favoritos
- [ ] Plan de lectura personalizado
- [ ] Compartir versículos
- [ ] Historial de lectura

## 📄 Documentación

- [Mejoras de Interfaz](./mejoras_interfaz_resumen.md)
- [Análisis de UI](./ui_analysis.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Ivan BJ** - [GitHub](https://github.com/ivanbj96)

---

*"Lámpara es a mis pies tu palabra, y lumbrera a mi camino." - Salmos 119:105*
