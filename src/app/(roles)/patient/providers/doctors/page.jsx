'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Stethoscope, Search, Star, MapPin, Clock, MessageCircle, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
export default function DoctorsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [specialty, setSpecialty] = useState('all');
    const [sortBy, setSortBy] = useState('rating');
    const specialties = [
        'All Specialties',
        'Cardiology',
        'Dermatology',
        'Endocrinology',
        'Gastroenterology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
        'Urology'
    ];
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('/api/doctors');
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch doctors',
                    variant: 'danger'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);
    const filteredDoctors = doctors
        .filter(doctor => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSpecialty = specialty === 'all' || doctor.specialty === specialty;
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
    const handleBookAppointment = (doctorId) => {
        router.push(`/patient/appointments/new?doctorId=${doctorId}`);
    };
    const handleSendMessage = (doctorId) => {
        router.push(`/patient/messaging?recipient=${doctorId}`);
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
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Find a Doctor</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Search and connect with healthcare professionals
                </p>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-4 gap-y-4 gap-x-4 mb-8">
                <div className="md:col-span-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search doctors by name or specialty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="w-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                {specialty === 'all' ? 'All Specialties' : specialties.find(s => s.toLowerCase() === specialty) || 'Select Specialty'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full min-w-[180px]">
                            {specialties.map(spec => (
                                <DropdownMenuItem key={spec} onClick={() => setSpecialty(spec.toLowerCase())}>
                                    {spec}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="w-full">
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
                        <DropdownMenuContent className="w-full min-w-[140px]">
                            <DropdownMenuItem onClick={() => setSortBy('rating')}>Rating</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('experience')}>Experience</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className="hover:shadow-lg transition-shadow min-w-0">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                    <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
                                        <AvatarImage src={doctor.avatar} alt={doctor.name} />
                                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <CardTitle className="text-lg sm:text-xl truncate">{doctor.name}</CardTitle>
                                        <p className="text-muted-foreground text-sm truncate">{doctor.specialty}</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Star className="h-4 w-4" />
                                    {doctor.rating}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <MapPin className="h-4 w-4" />
                                    <span className="truncate">{doctor.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Clock className="h-4 w-4" />
                                    <span>{doctor.experience} years experience</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                        className="w-full sm:w-auto flex-1"
                                        onClick={() => handleBookAppointment(doctor.id)}
                                    >
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Book Appointment
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                        onClick={() => handleSendMessage(doctor.id)}
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {filteredDoctors.length === 0 && (
                <div className="text-center py-12">
                    <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search criteria
                    </p>
                </div>
            )}
        </div>
    );
} 