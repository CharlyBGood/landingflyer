import React, { useState } from 'react';
import './ManualForm.css';

const ManualForm = ({ onSubmit, isLoading, onClose }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'restaurante',
    description: '',
    style: 'moderno',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    contact: {
      phone: '',
      email: '',
      address: '',
      website: ''
    },
    services: [
      { name: '', description: '', price: '' }
    ]
  });

  const businessTypes = [
    'restaurante', 'servicios', 'productos', 'tecnología', 
    'salud', 'belleza', 'educación', 'entretenimiento', 'otro'
  ];

  const styles = [
    'moderno', 'elegante', 'juvenil', 'profesional', 'minimalista'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index][field] = value;
    setFormData(prev => ({
      ...prev,
      services: newServices
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', description: '', price: '' }]
    }));
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (onClose) onClose(); // Cerrar modal después de enviar
  };

  return (
    <div className="manual-form-container">
      <form onSubmit={handleSubmit} className="manual-form">
        {/* Información Básica */}
        <div className="form-section">
          <h3>📋 Información Básica</h3>
          
          <div className="form-group">
            <label htmlFor="businessName">Nombre de la Empresa *</label>
            <input
              type="text"
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Ej: Restaurante La Bella Vista"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="businessType">Tipo de Negocio *</label>
              <select
                id="businessType"
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                required
              >
                {businessTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="style">Estilo Preferido</label>
              <select
                id="style"
                value={formData.style}
                onChange={(e) => handleInputChange('style', e.target.value)}
              >
                {styles.map(style => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción Breve *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe tu negocio en pocas palabras..."
              maxLength="200"
              required
            />
            <small>{formData.description.length}/200 caracteres</small>
          </div>
        </div>

        {/* Colores */}
        <div className="form-section">
          <h3>🎨 Paleta de Colores</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="primaryColor">Color Principal *</label>
              <div className="color-input-group">
                <input
                  type="color"
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="secondaryColor">Color Secundario</label>
              <div className="color-input-group">
                <input
                  type="color"
                  id="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  placeholder="#8B5CF6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="form-section">
          <h3>📞 Información de Contacto</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                value={formData.contact.phone}
                onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <small>Se convertirá automáticamente en enlace de WhatsApp</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.contact.email}
                onChange={(e) => handleInputChange('contact.email', e.target.value)}
                placeholder="info@tunegocio.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              type="text"
              id="address"
              value={formData.contact.address}
              onChange={(e) => handleInputChange('contact.address', e.target.value)}
              placeholder="123 Main St, Ciudad, Estado"
            />
            <small>Se convertirá automáticamente en enlace de Google Maps</small>
          </div>

          <div className="form-group">
            <label htmlFor="website">Website/Redes Sociales</label>
            <input
              type="url"
              id="website"
              value={formData.contact.website}
              onChange={(e) => handleInputChange('contact.website', e.target.value)}
              placeholder="https://www.tunegocio.com"
            />
          </div>
        </div>

        {/* Servicios/Productos */}
        <div className="form-section">
          <h3>🛍️ Productos/Servicios</h3>
          
          {formData.services.map((service, index) => (
            <div key={index} className="service-item">
              <div className="service-header">
                <h4>Servicio/Producto {index + 1}</h4>
                {formData.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="remove-service-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                    placeholder="Ej: Pizza Margherita"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Precio (opcional)</label>
                  <input
                    type="text"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                    placeholder="$19.99"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                  placeholder="Breve descripción del producto/servicio"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addService}
            className="add-service-btn"
            disabled={formData.services.length >= 6}
          >
            + Agregar Producto/Servicio
          </button>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button
            type="submit"
            className="generate-btn"
            disabled={isLoading || !formData.businessName || !formData.description}
          >
            {isLoading ? 'Generando...' : 'Generar Landing Page'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualForm;
