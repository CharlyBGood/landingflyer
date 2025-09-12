// Default content for EditableAgencyTemplate
export const defaultAgencyContent = {
  texts: [
    { id: 'tagline', content: 'AGENCIA CREATIVA', type: 'label' },
    { id: 'heroTitle', content: 'Transformamos ideas en', type: 'heading' },
    { id: 'heroHighlight', content: 'experiencias', type: 'heading' },
    { id: 'heroSubtitle', content: 'digitales', type: 'heading' },
    { id: 'heroDescription', content: 'Creamos soluciones digitales innovadoras que conectan con tu audiencia y generan resultados extraordinarios para tu negocio.', type: 'paragraph' },
    { id: 'primaryButton', content: 'Comenzar Proyecto', type: 'button' },
    { id: 'servicesTitle', content: 'Nuestros Servicios', type: 'heading' },
    { id: 'servicesDescription', content: 'Ofrecemos soluciones completas para impulsar tu presencia digital', type: 'paragraph' },
    { id: 'service1Title', content: 'Diseño Web', type: 'heading' },
    { id: 'service1Description', content: 'Creamos sitios web modernos y responsive que destacan tu marca', type: 'paragraph' },
    { id: 'service2Title', content: 'Marketing Digital', type: 'heading' },
    { id: 'service2Description', content: 'Estrategias de marketing que generan tráfico y conversiones', type: 'paragraph' },
    { id: 'service3Title', content: 'Branding', type: 'heading' },
    { id: 'service3Description', content: 'Desarrollamos identidades visuales únicas y memorables', type: 'paragraph' },
    { id: 'ctaTitle', content: '¿Listo para comenzar?', type: 'heading' },
    { id: 'ctaDescription', content: 'Contáctanos hoy y llevemos tu proyecto al siguiente nivel', type: 'paragraph' },
    { id: 'ctaButton', content: 'Contactar Ahora', type: 'button' }
  ],
  images: [
    { id: 'heroImage', src: '/api/image/unsplash?term=creative+agency+team', alt: 'Equipo creativo trabajando' }
  ],
  colors: [
    { id: 'primary', value: '#6366f1', name: 'Color Primario', type: 'primary' },
    { id: 'secondary', value: '#8b5cf6', name: 'Color Secundario', type: 'secondary' },
    { id: 'accent', value: '#f59e0b', name: 'Color Acento', type: 'accent' },
    { id: 'background', value: '#0f172a', name: 'Fondo', type: 'background' }
  ]
};