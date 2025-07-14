'use client';
import React, { useState } from 'react';
import { Button } from './Button';
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
  VolumeX
} from 'lucide-react';

const ButtonDemo = () => {
  const [loading, setLoading] = useState(false);
  const [rippleEnabled, setRippleEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-background via-muted/20 to-background min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Advanced Button Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Modern, animated buttons with advanced interactions and effects
        </p>
      </div>

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
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Basic Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Button variant="default" ripple={rippleEnabled} sound={soundEnabled}>
            Default
          </Button>
          <Button variant="secondary" ripple={rippleEnabled} sound={soundEnabled}>
            Secondary
          </Button>
          <Button variant="outline" ripple={rippleEnabled} sound={soundEnabled}>
            Outline
          </Button>
          <Button variant="ghost" ripple={rippleEnabled} sound={soundEnabled}>
            Ghost
          </Button>
          <Button variant="destructive" ripple={rippleEnabled} sound={soundEnabled}>
            Destructive
          </Button>
          <Button variant="success" ripple={rippleEnabled} sound={soundEnabled}>
            Success
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Advanced Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button variant="premium" ripple={rippleEnabled} sound={soundEnabled} icon={<Sparkles className="w-4 h-4" />}>
            Premium
          </Button>
          <Button variant="glass" ripple={rippleEnabled} sound={soundEnabled} icon={<Zap className="w-4 h-4" />}>
            Glass
          </Button>
          <Button variant="neon" ripple={rippleEnabled} sound={soundEnabled} icon={<Star className="w-4 h-4" />}>
            Neon
          </Button>
          <Button variant="gradient" ripple={rippleEnabled} sound={soundEnabled} icon={<Heart className="w-4 h-4" />}>
            Gradient
          </Button>
          <Button variant="metallic" ripple={rippleEnabled} sound={soundEnabled} icon={<Shield className="w-4 h-4" />}>
            Metallic
          </Button>
          <Button variant="warning" ripple={rippleEnabled} sound={soundEnabled} icon={<AlertTriangle className="w-4 h-4" />}>
            Warning
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Sizes</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="sm" ripple={rippleEnabled} sound={soundEnabled} icon={<Plus className="w-3 h-3" />}>
            Small
          </Button>
          <Button size="default" ripple={rippleEnabled} sound={soundEnabled} icon={<Plus className="w-4 h-4" />}>
            Default
          </Button>
          <Button size="lg" ripple={rippleEnabled} sound={soundEnabled} icon={<Plus className="w-5 h-5" />}>
            Large
          </Button>
          <Button size="xl" ripple={rippleEnabled} sound={soundEnabled} icon={<Plus className="w-6 h-6" />}>
            Extra Large
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Icon Buttons</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="icon-sm" variant="outline" ripple={rippleEnabled} sound={soundEnabled}>
            <Search className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="default" ripple={rippleEnabled} sound={soundEnabled}>
            <Bell className="w-5 h-5" />
          </Button>
          <Button size="icon-lg" variant="premium" ripple={rippleEnabled} sound={soundEnabled}>
            <Mail className="w-6 h-6" />
          </Button>
          <Button size="icon" variant="destructive" ripple={rippleEnabled} sound={soundEnabled}>
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="success" ripple={rippleEnabled} sound={soundEnabled}>
            <CheckCircle className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="glass" ripple={rippleEnabled} sound={soundEnabled}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Rounded Variants</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button rounded="none" ripple={rippleEnabled} sound={soundEnabled}>
            None
          </Button>
          <Button rounded="sm" ripple={rippleEnabled} sound={soundEnabled}>
            Small
          </Button>
          <Button rounded="default" ripple={rippleEnabled} sound={soundEnabled}>
            Default
          </Button>
          <Button rounded="lg" ripple={rippleEnabled} sound={soundEnabled}>
            Large
          </Button>
          <Button rounded="full" ripple={rippleEnabled} sound={soundEnabled}>
            Full
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Animation Variants</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button animation="bounce" ripple={rippleEnabled} sound={soundEnabled}>
            Bounce
          </Button>
          <Button animation="pulse" ripple={rippleEnabled} sound={soundEnabled}>
            Pulse
          </Button>
          <Button animation="spin" ripple={rippleEnabled} sound={soundEnabled}>
            Spin
          </Button>
          <Button animation="ping" ripple={rippleEnabled} sound={soundEnabled}>
            Ping
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Loading States</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button loading={loading} onClick={handleLoadingClick} ripple={rippleEnabled} sound={soundEnabled}>
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
          <Button variant="premium" loading={loading} onClick={handleLoadingClick} ripple={rippleEnabled} sound={soundEnabled}>
            {loading ? 'Processing...' : 'Premium Load'}
          </Button>
          <Button variant="glass" loading={loading} onClick={handleLoadingClick} ripple={rippleEnabled} sound={soundEnabled}>
            {loading ? 'Working...' : 'Glass Load'}
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Icon Positions</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button icon={<Download className="w-4 h-4" />} iconPosition="left" ripple={rippleEnabled} sound={soundEnabled}>
            Download
          </Button>
          <Button icon={<Upload className="w-4 h-4" />} iconPosition="right" ripple={rippleEnabled} sound={soundEnabled}>
            Upload
          </Button>
          <Button icon={<Edit className="w-4 h-4" />} iconPosition="left" variant="outline" ripple={rippleEnabled} sound={soundEnabled}>
            Edit
          </Button>
          <Button icon={<Play className="w-4 h-4" />} iconPosition="right" variant="success" ripple={rippleEnabled} sound={soundEnabled}>
            Play
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Interactive Demo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold">Action Buttons</h3>
            <div className="space-y-2">
              <Button variant="default" ripple={rippleEnabled} sound={soundEnabled} className="w-full">
                Primary Action
              </Button>
              <Button variant="outline" ripple={rippleEnabled} sound={soundEnabled} className="w-full">
                Secondary Action
              </Button>
              <Button variant="ghost" ripple={rippleEnabled} sound={soundEnabled} className="w-full">
                Tertiary Action
              </Button>
            </div>
          </div>

          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold">Status Buttons</h3>
            <div className="space-y-2">
              <Button variant="success" ripple={rippleEnabled} sound={soundEnabled} className="w-full" icon={<CheckCircle className="w-4 h-4" />}>
                Success
              </Button>
              <Button variant="warning" ripple={rippleEnabled} sound={soundEnabled} className="w-full" icon={<AlertTriangle className="w-4 h-4" />}>
                Warning
              </Button>
              <Button variant="destructive" ripple={rippleEnabled} sound={soundEnabled} className="w-full" icon={<Trash2 className="w-4 h-4" />}>
                Delete
              </Button>
            </div>
          </div>

          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h3 className="text-lg font-semibold">Special Effects</h3>
            <div className="space-y-2">
              <Button variant="premium" ripple={rippleEnabled} sound={soundEnabled} className="w-full" icon={<Sparkles className="w-4 h-4" />}>
                Premium
              </Button>
              <Button variant="glass" ripple={rippleEnabled} sound={soundEnabled} className="w-full" icon={<Zap className="w-4 h-4" />}>
                Glass Effect
              </Button>
              <Button variant="neon" ripple={rippleEnabled} sound={soundEnabled} className="w-full" icon={<Star className="w-4 h-4" />}>
                Neon Glow
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Advanced Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold mb-2">✨ Ripple Effects</h4>
            <p className="text-sm text-muted-foreground">Material Design-inspired ripple animations on click</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold mb-2">🎵 Sound Effects</h4>
            <p className="text-sm text-muted-foreground">Optional audio feedback for interactions</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold mb-2">🎨 Multiple Variants</h4>
            <p className="text-sm text-muted-foreground">12+ beautiful variants including glass, neon, and metallic</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold mb-2">⚡ Smooth Animations</h4>
            <p className="text-sm text-muted-foreground">Framer Motion powered animations and transitions</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold mb-2">🎯 Micro-interactions</h4>
            <p className="text-sm text-muted-foreground">Hover, press, and focus states with subtle animations</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold mb-2">🎪 Icon Animations</h4>
            <p className="text-sm text-muted-foreground">Icons animate on hover with scale and rotation effects</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ButtonDemo; 