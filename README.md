# 💧 Sistema de Gestión de Pagos - ADACECAM

> Sistema integral de gestión y pago de recibos de agua para la cooperativa ADACECAM de San Pedro Perulapán, Cuscatlán, El Salvador.

## 📋 Descripción del Proyecto

Sistema web moderno diseñado para digitalizar y automatizar el proceso de gestión de recibos de agua potable. Transforma un proceso completamente manual en una experiencia digital fluida, eliminando la necesidad de desplazamientos físicos y pagos en efectivo.

### Problema a Resolver

- Los usuarios deben desplazarse hasta Cojutepeque para pagar en efectivo
- No existe registro digital de consumos ni pagos
- El proceso es lento y propenso a errores
- No hay opciones de pago electrónico

### Solución Propuesta

- Consulta de recibos en línea
- Pagos electrónicos seguros
- Generación automática de comprobantes PDF
- Panel administrativo para contadores
- Historial completo de pagos y consumos

## ✨ Características Principales

### Para Usuarios
- Autenticación segura (Email/Password y Google)
- Pagos en línea con tarjeta
- Descarga de comprobantes PDF
- Historial completo de pagos
- Diseño responsive

### Para Administradores
- Gestión de usuarios
- Generación de recibos con IA
- Reportes de pagos y consumos
- Panel administrativo completo

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15.3, React 18.3, Tailwind CSS 3.4
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Firebase Auth, Firestore
- **IA**: Google Gemini 2.5 Flash (via Genkit)
- **PDF**: jsPDF
- **Language**: TypeScript 5.0

## 📦 Requisitos Previos

- Node.js v20.x o superior
- npm v9.x o superior
- Cuenta de Firebase
- API Key de Google AI

## 🚀 Instalación
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/adacecam-water-system.git
cd adacecam-water-system

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con las siguientes variables:
# NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
# NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
# GOOGLE_GENAI_API_KEY=tu_google_ai_api_key

# Ejecutar en modo desarrollo
npm run dev

# La aplicación estará en http://localhost:9002
```

## 📖 Uso del Sistema

### Para Usuarios

1. **Registro/Login**: Accede a `/login` o `/signup`
2. **Consultar Recibo**: Ve a `/payment`, ingresa tu número de cuenta y período
3. **Realizar Pago**: Ingresa datos de tarjeta y confirma
4. **Ver Historial**: Accede a `/account-statement`

### Para Contadores

1. **Panel**: Ve a `/accountant`
2. **Gestionar Clientes**: Visualiza usuarios y sus recibos
3. **Generar Recibos**: Crea nuevos recibos con generación IA de texto legal

## 📂 Estructura del Proyecto
```
adacecam-water-system/
├── src/
│   ├── app/                    # Rutas Next.js
│   ├── components/             # Componentes React
│   ├── firebase/               # Configuración Firebase
│   ├── ai/                     # Integración IA
│   ├── lib/                    # Utilidades
│   └── hooks/                  # Custom Hooks
├── public/                     # Archivos estáticos
├── docs/                       # Documentación
├── firestore.rules            # Reglas de seguridad
├── firebase.json              # Config Firebase
├── next.config.ts             # Config Next.js
└── package.json               # Dependencias
```

## 👥 Equipo de Desarrollo

**Universidad Don Bosco - Administración de Proyectos**

- **Fabricio Antonio Castro Martínez** - CM240137 (PM / Analista UX)
- **José Alonso Aguirre Márquez** - AM241838 (Backend + DevOps)
- **Ángel Marcelo Delgado Estrada** - DE241507 (QA / Operaciones)
- **Miguel Eduardo Vallejos Linares** - VL131638 (Frontend)
- **Mateo Alejandro Ledesma Mendoza** - LM222046 (Documentación)

## 🔐 Seguridad

- Autenticación Firebase
- Reglas de seguridad Firestore
- Custom Claims para roles
- Validación con Zod
- HTTPS obligatorio
- Sin almacenamiento de datos de tarjetas

## 📊 Estado del Proyecto

**Fase 1 - MVP Completado**

✅ Autenticación de usuarios  
✅ Consulta de recibos  
✅ Pagos en línea (simulados)  
✅ Generación de PDF  
✅ Panel de contador  
✅ Generación IA de recibos  
✅ Historial de pagos  

**Próximas Fases:**
- Integración con pasarela real
- Webhooks automáticos
- Notificaciones email/WhatsApp
- Reportes avanzados
- App móvil

## 📝 Licencia

Proyecto académico - Universidad Don Bosco, El Salvador © 2025

---

**🌊 ADACECAM - Modernizando la gestión del agua potable**
