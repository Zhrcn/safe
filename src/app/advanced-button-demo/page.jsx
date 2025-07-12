'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AdvancedButton } from '@/components/ui/AdvancedButton';
import { 
  Heart, 
  Star, 
  Zap, 
  Sparkles, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Play,
  Pause,
  Settings,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Minus,
  Search,
  Bell,
  Mail,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  MousePointer,
  Clock,
  Target,
  Zap as ZapIcon,
  Palette,
  Layers,
  Code,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const AdvancedButtonDemo = () => {
  const [loading, setLoading] = useState(false);
  const [rippleEnabled, setRippleEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleAsyncAction = async () => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Async action completed!');
  };

  const handleLongPress = () => {
    console.log('Long press detected!');
  };

  const handleConfirm = () => {
    console.log('Action confirmed!');
  };

  const handleCancel = () => {
    console.log('Action cancelled!');
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-background via-muted/20 to-background min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Advanced Button Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Next-generation buttons with advanced interactions, animations, and effects
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => setRippleEnabled(!rippleEnabled)}
          icon={rippleEnabled ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
        >
          Ripple: {rippleEnabled ? 'ON' : 'OFF'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setSoundEnabled(!soundEnabled)}
          icon={soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        >
          Sound: {soundEnabled ? 'ON' : 'OFF'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setHapticEnabled(!hapticEnabled)}
          icon={<Smartphone className="w-4 h-4" />}
        >
          Haptic: {hapticEnabled ? 'ON' : 'OFF'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
          icon={<Target className="w-4 h-4" />}
        >
          Analytics: {analyticsEnabled ? 'ON' : 'OFF'}
        </Button>
      </div>

      {/* Advanced Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Advanced Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AdvancedButton 
            variant="holographic" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Holographic
          </AdvancedButton>
          <AdvancedButton 
            variant="cyber" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<ZapIcon className="w-4 h-4" />}
          >
            Cyber
          </AdvancedButton>
          <AdvancedButton 
            variant="organic" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<Heart className="w-4 h-4" />}
          >
            Organic
          </AdvancedButton>
          <AdvancedButton 
            variant="glass" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<Layers className="w-4 h-4" />}
          >
            Glass
          </AdvancedButton>
        </div>
      </section>

      {/* Animation Effects */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Animation Effects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AdvancedButton 
            animation="float" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<Star className="w-4 h-4" />}
          >
            Float
          </AdvancedButton>
          <AdvancedButton 
            animation="glow" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<Zap className="w-4 h-4" />}
          >
            Glow
          </AdvancedButton>
          <AdvancedButton 
            animation="shimmer" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Shimmer
          </AdvancedButton>
          <AdvancedButton 
            animation="bounce-gentle" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<Heart className="w-4 h-4" />}
          >
            Bounce
          </AdvancedButton>
        </div>
      </section>

      {/* Hover Effects */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Hover Effects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AdvancedButton 
            effect="lift" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<MousePointer className="w-4 h-4" />}
          >
            Lift
          </AdvancedButton>
          <AdvancedButton 
            effect="glow" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<Zap className="w-4 h-4" />}
          >
            Glow
          </AdvancedButton>
          <AdvancedButton 
            effect="shine" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Shine
          </AdvancedButton>
          <AdvancedButton 
            effect="particles" 
            ripple={rippleEnabled} 
            sound={soundEnabled}
            hapticFeedback={hapticEnabled}
            analytics={analyticsEnabled}
            icon={<Star className="w-4 h-4" />}
          >
            Particles
          </AdvancedButton>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Advanced Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Async Actions */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Async Actions
            </h3>
            <div className="space-y-2">
              <AdvancedButton 
                asyncAction={handleAsyncAction}
                loadingText="Processing..."
                ripple={rippleEnabled} 
                sound={soundEnabled}
                hapticFeedback={hapticEnabled}
                analytics={analyticsEnabled}
                className="w-full"
              >
                Async Action
              </AdvancedButton>
            </div>
          </div>

          {/* Long Press */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Long Press
            </h3>
            <div className="space-y-2">
              <AdvancedButton 
                onLongPress={handleLongPress}
                longPressDelay={1000}
                ripple={rippleEnabled} 
                sound={soundEnabled}
                hapticFeedback={hapticEnabled}
                analytics={analyticsEnabled}
                className="w-full"
              >
                Hold for 1s
              </AdvancedButton>
            </div>
          </div>

          {/* Confirmation */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Confirmation
            </h3>
            <div className="space-y-2">
              <AdvancedButton 
                confirmation={true}
                confirmationText="Click again to confirm"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                ripple={rippleEnabled} 
                sound={soundEnabled}
                hapticFeedback={hapticEnabled}
                analytics={analyticsEnabled}
                className="w-full"
              >
                Delete Item
              </AdvancedButton>
            </div>
          </div>

          {/* Debounced Click */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Debounced Click
            </h3>
            <div className="space-y-2">
              <AdvancedButton 
                debounceMs={500}
                onClick={() => console.log('Debounced click!')}
                ripple={rippleEnabled} 
                sound={soundEnabled}
                hapticFeedback={hapticEnabled}
                analytics={analyticsEnabled}
                className="w-full"
              >
                Debounced (500ms)
              </AdvancedButton>
            </div>
          </div>

          {/* Throttled Click */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Throttled Click
            </h3>
            <div className="space-y-2">
              <AdvancedButton 
                throttleMs={1000}
                onClick={() => console.log('Throttled click!')}
                ripple={rippleEnabled} 
                sound={soundEnabled}
                hapticFeedback={hapticEnabled}
                analytics={analyticsEnabled}
                className="w-full"
              >
                Throttled (1s)
              </AdvancedButton>
            </div>
          </div>

          {/* All Features Combined */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Code className="w-5 h-5" />
              All Features
            </h3>
            <div className="space-y-2">
              <AdvancedButton 
                variant="holographic"
                animation="float"
                effect="lift"
                hapticFeedback={hapticEnabled}
                analytics={analyticsEnabled}
                ripple={rippleEnabled}
                sound={soundEnabled}
                className="w-full"
                icon={<Sparkles className="w-4 h-4" />}
              >
                Ultimate Button
              </AdvancedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Device Compatibility</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Mobile
            </h3>
            <p className="text-sm text-muted-foreground">
              Touch interactions, haptic feedback, and mobile-optimized animations
            </p>
            <AdvancedButton 
              variant="cyber"
              hapticFeedback={true}
              ripple={true}
              className="w-full"
            >
              Mobile Optimized
            </AdvancedButton>
          </div>

          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Desktop
            </h3>
            <p className="text-sm text-muted-foreground">
              Mouse interactions, hover effects, and keyboard shortcuts
            </p>
            <AdvancedButton 
              variant="organic"
              effect="shine"
              animation="glow"
              className="w-full"
            >
              Desktop Optimized
            </AdvancedButton>
          </div>

          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tablet className="w-5 h-5" />
              Tablet
            </h3>
            <p className="text-sm text-muted-foreground">
              Hybrid interactions with touch and pointer support
            </p>
            <AdvancedButton 
              variant="glass"
              animation="bounce-gentle"
              className="w-full"
            >
              Tablet Optimized
            </AdvancedButton>
          </div>
        </div>
      </section>

      {/* Performance Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Performance Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-card rounded-lg border border-border text-center">
            <h4 className="font-semibold mb-2">⚡ Debouncing</h4>
            <p className="text-sm text-muted-foreground">Prevents rapid-fire clicks</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border text-center">
            <h4 className="font-semibold mb-2">🎯 Throttling</h4>
            <p className="text-sm text-muted-foreground">Limits execution frequency</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border text-center">
            <h4 className="font-semibold mb-2">📊 Analytics</h4>
            <p className="text-sm text-muted-foreground">Track user interactions</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border text-center">
            <h4 className="font-semibold mb-2">🔧 Accessibility</h4>
            <p className="text-sm text-muted-foreground">Screen reader friendly</p>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Usage Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-card rounded-xl border border-border">
            <h3 className="text-lg font-semibold mb-4">Basic Usage</h3>
            <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
{`<AdvancedButton 
  variant="holographic"
  animation="float"
  effect="lift"
  hapticFeedback={true}
  analytics={true}
>
  Click Me
</AdvancedButton>`}
            </pre>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border">
            <h3 className="text-lg font-semibold mb-4">Advanced Usage</h3>
            <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
{`<AdvancedButton 
  asyncAction={handleAsyncAction}
  confirmation={true}
  onLongPress={handleLongPress}
  debounceMs={300}
  hapticFeedback={true}
>
  Advanced Button
</AdvancedButton>`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdvancedButtonDemo; 