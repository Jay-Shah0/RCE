
interface Template {
	id: number;
	name: string;
	details: string;
}

interface TemplateListProps {
	templates: Template[];
	onSelectTemplate: (template: Template) => void;
}

const SearchResultTemplates: React.FC<TemplateListProps> = ({ templates, onSelectTemplate }) => {
  return (
    <div>
      {templates.map((template) => (
        <button
          key={template.id}
          className="text-2xl p-2 w-full text-left bg-custom-dark hover:bg-gray-600"
          onClick={() => onSelectTemplate(template)}
        >
          {template.name}
        </button>
      ))}
    </div>
  );
};

const Templates: React.FC<TemplateListProps> = ({ templates, onSelectTemplate }) => {
  return (
		<div>
			{templates.map((template) => (
				<button
					key={template.id}
					className="text-2xl p-2 w-full text-left bg-custom-dark hover:bg-gray-600"
					onClick={() => onSelectTemplate(template)}
				>
					{template.name}
				</button>
			))}
		</div>
	);
};

export { Templates, SearchResultTemplates };
