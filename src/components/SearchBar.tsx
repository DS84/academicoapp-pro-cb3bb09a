import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface SearchBarProps {
  language: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ language, onSearch, placeholder }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const translations = {
    pt: {
      placeholder: 'Buscar cursos, professores, profissionais...'
    },
    en: {
      placeholder: 'Search courses, teachers, professionals...'
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder || t.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-10"
        />
      </div>
      <Button type="submit" size="sm" className="h-10 px-3">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;