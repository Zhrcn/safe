'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Pill, Search, Star, MapPin, Clock, MessageCircle, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
export default function PharmacistsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [pharmacists, setPharmacists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [specialty, setSpecialty] = useState('all');
    const [sortBy, setSortBy] = useState('rating');
    const specialties = [
        'All Specialties',
        'Clinical Pharmacy',
        'Community Pharmacy',
        'Hospital Pharmacy',
        'Industrial Pharmacy',
        'Nuclear Pharmacy',
        'Pharmaceutical Research',
        'Retail Pharmacy'
    ];
    useEffect(() => {
        const fetchPharmacists = async () => {
            try {
                const response = await fetch('/api/pharmacists');
                const data = await response.json();
                setPharmacists(data);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch pharmacists',
                    variant: 'destructive'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPharmacists();
    }, []);
    const filteredPharmacists = pharmacists
        .filter(pharmacist => {
            const matchesSearch = pharmacist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                pharmacist.specialty.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSpecialty = specialty === 'all' || pharmacist.specialty === specialty;
            return matchesSearch && matchesSpecialty;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'experience':
                    return b.experience - a.experience;
                default:
                    return 0;
            }
        });
    const handleBookConsultation = (pharmacistId) => {
        router.push(`/patient/consultations/new?pharmacistId=${pharmacistId}`);
    };
    const handleSendMessage = (pharmacistId) => {
        router.push(`/patient/messaging?recipient=${pharmacistId}`);
    };
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Find a Pharmacist</h1>
                <p className="text-muted-foreground">
                    Connect with pharmacists for medication management and advice
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="md:col-span-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search pharmacists by name or specialty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                            {specialty === 'all' ? 'All Specialties' : specialties.find(s => s.toLowerCase() === specialty) || 'Select Specialty'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {specialties.map(spec => (
                            <DropdownMenuItem key={spec} onClick={() => setSpecialty(spec.toLowerCase())}>
                                {spec}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                            {(() => {
                                switch (sortBy) {
                                    case 'rating': return 'Rating';
                                    case 'name': return 'Name';
                                    case 'experience': return 'Experience';
                                    default: return 'Sort by';
                                }
                            })()}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSortBy('rating')}>Rating</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('experience')}>Experience</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPharmacists.map((pharmacist) => (
                    <Card key={pharmacist.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={pharmacist.avatar} alt={pharmacist.name} />
                                        <AvatarFallback>{pharmacist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-xl">{pharmacist.name}</CardTitle>
                                        <p className="text-muted-foreground">{pharmacist.specialty}</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Star className="h-4 w-4" />
                                    {pharmacist.rating}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{pharmacist.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{pharmacist.experience} years experience</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1"
                                        onClick={() => handleBookConsultation(pharmacist.id)}
                                    >
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Book Consultation
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleSendMessage(pharmacist.id)}
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {filteredPharmacists.length === 0 && (
                <div className="text-center py-12">
                    <Pill className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No pharmacists found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search criteria
                    </p>
                </div>
            )}
        </div>
    );
} 