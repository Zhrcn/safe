import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import LanguageSwitcher from './LanguageSwitcher';
import LanguageSwitcherToggle from './LanguageSwitcherToggle';
import LanguageSwitcherSegmented from './LanguageSwitcherSegmented';

const variants = [
  {
    id: 'dropdown',
    name: 'Dropdown Menu',
    description: 'Modern dropdown with flags and native names',
    component: LanguageSwitcher,
    features: ['Accessible', 'Multiple languages support', 'Visual feedback', 'Responsive']
  },
  {
    id: 'toggle',
    name: 'Toggle Button',
    description: 'Animated toggle with smooth transitions',
    component: LanguageSwitcherToggle,
    features: ['Smooth animations', 'Visual feedback', 'Compact design', 'Hover effects']
  },
  {
    id: 'segmented',
    name: 'Segmented Control',
    description: 'iOS-style segmented control with sliding indicator',
    component: LanguageSwitcherSegmented,
    features: ['Modern design', 'Sliding animation', 'Active indicators', 'Compact']
  }
];

export default function LanguageSwitcherDemo() {
  const [selectedVariant, setSelectedVariant] = useState('dropdown');

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Language Switcher Variants</h1>
        <p className="text-muted-foreground">
          Choose your preferred language switcher design
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => setSelectedVariant(variant.id)}
            className={`
              px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200
              ${selectedVariant === variant.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            {variant.name}
          </button>
        ))}
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {variants.find(v => v.id === selectedVariant)?.name}
            <Badge variant="secondary">Active</Badge>
          </CardTitle>
          <CardDescription>
            {variants.find(v => v.id === selectedVariant)?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {(() => {
            const VariantComponent = variants.find(v => v.id === selectedVariant)?.component;
            return VariantComponent ? <VariantComponent /> : null;
          })()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {variants.find(v => v.id === selectedVariant)?.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="justify-center">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {variants.map((variant) => (
          <Card key={variant.id} className={selectedVariant === variant.id ? 'ring-2 ring-primary' : ''}>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">{variant.name}</CardTitle>
              <CardDescription>{variant.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {(() => {
                const VariantComponent = variant.component;
                return <VariantComponent />;
              })()}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 