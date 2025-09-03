import { Eye } from 'lucide-react';


const TemplateGallery = ({ templates, onTemplateClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className="group relative bg-white/80 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
          onClick={() => onTemplateClick(template)}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-linear-to-br ${template.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-portfolio-text/90 backdrop-blur-xs rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Eye className="w-8 h-8 text-gray-700" />
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-portfolio-text bg-linear-to-r ${template.color} mb-3`}>
              Vista previa
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
              {template.name}
            </h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
              {template.description}
            </p>
          </div>
          <div className={`h-1 bg-linear-to-r ${template.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
        </div>
      ))}
    </div>
  );
};

export default TemplateGallery;
