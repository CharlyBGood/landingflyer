import TechTemplate from "../templates/TechTemplate";
import AgencyTemplate from "../templates/AgencyTemplate";
import EcommerceTemplate from "../templates/EcommerceTemplate";
import PortfolioTemplate from "../templates/PortfolioTemplate";
import RestaurantTemplate from "../templates/RestaurantTemplate";
import FitnessTemplate from "../templates/FitnessTemplate";
import TemplateSelectorButton from "../components/template_utilities/TemplateSelectorButton";

export const templatesArray = [
  {
    id: "saas",
    name: "Plataforma Tech",
    description: "Empresa de tecnología.",
    component: TechTemplate,
    select: TemplateSelectorButton,
    thumbnail:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-blue-600 to-purple-600",
  },
  {
    id: "agency",
    name: "Agencia Creativa",
    description: "Estudio creativo",
    component: AgencyTemplate,
    select: TemplateSelectorButton,
    thumbnail:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "ecommerce",
    name: "Tienda Online",
    description: "Comercio online",
    component: EcommerceTemplate,
    select: TemplateSelectorButton,
    thumbnail:
      "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-green-500 to-teal-500",
  },
  {
    id: "portfolio",
    name: "Portafolio Personal",
    description: "Minimalist professional showcase",
    component: PortfolioTemplate,
    select: TemplateSelectorButton,
    thumbnail:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-gray-600 to-gray-800",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Tienda de comidas",
    component: RestaurantTemplate,
    select: TemplateSelectorButton,
    thumbnail:
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-yellow-600 to-orange-600",
  },
  {
    id: "fitness",
    name: "Fitness",
    description: "Gimnasio y entrenamiento",
    component: FitnessTemplate,
    select: TemplateSelectorButton,
    thumbnail:
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-purple-600 to-pink-600",
  },
];
