'use client';
import React, { useState, useEffect } from 'react';
import { mockPatientData } from '@/mockdata/patientData';
import PageHeader from '@/components/patient/PageHeader';
import {
    Clock,
    Plus,
    Check,
    X,
    Trash2,
    Edit,
    Calendar,
    MapPin,
    User,
    Search,
    AlertCircle,
    Video,
    MessageSquare,
    Send,
    Pill,
    Stethoscope,
    Briefcase,
    GraduationCap,
    Languages,
    Filter,
    ArrowUpDown,
    Star,
    ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { NotificationProvider, useNotification } from '@/components/ui/Notification';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/Select';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const ProviderCard = ({ provider, type, onOpenDialog }) => {
    const isDoctor = type === 'doctor';
    const avatarBg = isDoctor ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600';

    return (
        <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={provider.image || provider.profileImage} />
                            <AvatarFallback className={cn("text-xl font-semibold", avatarBg)}>
                                {provider.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground">{provider.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {isDoctor ? provider.specialization : provider.pharmacyName || provider.specialties?.join(', ')}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "h-4 w-4",
                                                i < Math.floor(provider.rating)
                                                    ? 'text-yellow-400'
                                                    : i < provider.rating
                                                    ? 'text-yellow-400/50'
                                                    : 'text-muted-foreground'
                                            )}
                                            fill={i < provider.rating ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">({provider.rating?.toFixed(1)})</span>
                            </div>
                        </div>
                    </div>
                    
                    <Separator className="my-4" />

                    <div className="space-y-3 text-sm text-muted-foreground">
                        {isDoctor && provider.hospital && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{provider.hospital}</span>
                            </div>
                        )}
                        {!isDoctor && provider.address && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{provider.address}</span>
                            </div>
                        )}
                        {provider.yearsExperience && (
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                <span>{provider.yearsExperience} years experience</span>
                            </div>
                        )}
                        {provider.education && provider.education.length > 0 && (
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                <span>
                                    {provider.education[provider.education.length - 1].degree} from {
                                        provider.education[provider.education.length - 1].institution
                                    }
                                </span>
                            </div>
                        )}
                        {provider.languages && provider.languages.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Languages className="h-4 w-4 text-primary" />
                                <span>{provider.languages.join(', ')}</span>
                            </div>
                        )}
                        {isDoctor && (
                             <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="font-medium text-sm text-foreground">Available for consultations</span>
                            </div>
                        )}
                        {!isDoctor && provider.availability && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="font-medium text-sm text-foreground">
                                    Working hours: {Object.entries(provider.availability)
                                        .map(([day, hours]) => `${day}: ${hours.join('-')}`)
                                        .join(', ')}
                                </span>
                            </div>
                        )}
                    </div>

                    {!isDoctor && provider.specialties && provider.specialties.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-foreground mb-2">Specialties:</h4>
                            <div className="flex flex-wrap gap-2">
                                {provider.specialties.map((specialty, index) => (
                                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                        {specialty}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col gap-3 mt-6">
                    {isDoctor ? (
                        <>
                            <Button
                                className="w-full"
                                onClick={() => onOpenDialog(provider, 'appointment')}
                            >
                                <Calendar className="h-4 w-4 mr-2" />
                                Book Appointment
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => onOpenDialog(provider, 'message')}
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className="w-full"
                                onClick={() => onOpenDialog(provider, 'medicine')}
                            >
                                <Pill className="h-4 w-4 mr-2" />
                                Check Medicine
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => onOpenDialog(provider, 'message')}
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const ProvidersPageContent = () => {
    const router = useRouter();
    const { addNotification } = useNotification();

    const [activeTab, setActiveTab] = useState('doctors');
    const [searchQuery, setSearchQuery] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [sortBy, setSortBy] = useState('rating'); // New state for sorting
    const [sortOrder, setSortOrder] = useState('desc'); // New state for sort order (asc/desc)

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogProvider, setDialogProvider] = useState(null);
    const [dialogType, setDialogType] = useState('');
    const [messageContent, setMessageContent] = useState('');

    // Mock Data - Replace with actual API data
    const allDoctors = [
        {
            id: 'doc1',
            name: 'Dr. Sarah Johnson',
            specialization: 'Cardiologist',
            hospital: 'City General Hospital',
            rating: 4.9,
            yearsExperience: 15,
            education: [{ degree: 'MD', institution: 'Harvard Medical School' }],
            languages: ['English', 'Spanish'],
            profileImage: 'https://randomuser.me/api/portraits/women/1.jpg'
        },
        {
            id: 'doc2',
            name: 'Dr. Michael Chen',
            specialization: 'Pediatrician',
            hospital: "Children's Health Center",
            rating: 4.7,
            yearsExperience: 10,
            education: [{ degree: 'MD', institution: 'Stanford University' }],
            languages: ['English', 'Mandarin'],
            profileImage: 'https://randomuser.me/api/portraits/men/2.jpg'
        },
        {
            id: 'doc3',
            name: 'Dr. Emily White',
            specialization: 'Dermatologist',
            hospital: 'Dermacare Clinic',
            rating: 4.5,
            yearsExperience: 8,
            education: [{ degree: 'MD', institution: 'Yale School of Medicine' }],
            languages: ['English'],
            profileImage: 'https://randomuser.me/api/portraits/women/3.jpg'
        },
        {
            id: 'doc4',
            name: 'Dr. David Lee',
            specialization: 'Orthopedic Surgeon',
            hospital: 'Sports Injury Clinic',
            rating: 4.8,
            yearsExperience: 12,
            education: [{ degree: 'MD', institution: 'Johns Hopkins University' }],
            languages: ['English', 'Korean'],
            profileImage: 'https://randomuser.me/api/portraits/men/4.jpg'
        },
        {
            id: 'doc5',
            name: 'Dr. Olivia Smith',
            specialization: 'Family Medicine',
            hospital: 'Community Health Clinic',
            rating: 4.6,
            yearsExperience: 7,
            education: [{ degree: 'MD', institution: 'University of California, San Francisco' }],
            languages: ['English', 'French'],
            profileImage: 'https://randomuser.me/api/portraits/women/5.jpg'
        },
    ];

    const allPharmacies = [
        {
            id: 'pharm1',
            name: 'City Central Pharmacy',
            pharmacyName: 'City Central Pharmacy',
            address: '123 Main St, Anytown',
            rating: 4.8,
            specialties: ['Prescription Refills', 'Vaccinations', 'Compounding'],
            availability: { Mon: ['9AM', '6PM'], Tue: ['9AM', '6PM'], Wed: ['9AM', '6PM'], Thu: ['9AM', '6PM'], Fri: ['9AM', '6PM'] },
        },
        {
            id: 'pharm2',
            name: 'Health & Wellness Pharmacy',
            pharmacyName: 'Health & Wellness Pharmacy',
            address: '456 Oak Ave, Anytown',
            rating: 4.5,
            specialties: ['Medication Therapy Management', 'Diabetic Supplies'],
            availability: { Mon: ['8AM', '5PM'], Tue: ['8AM', '5PM'], Wed: ['8AM', '5PM'], Thu: ['8AM', '5PM'], Fri: ['8AM', '5PM'] },
        },
    ];

    const uniqueSpecialties = Array.from(new Set(allDoctors.map(doc => doc.specialization)))
        .sort();
    const uniqueLocations = Array.from(new Set(allDoctors.map(doc => doc.hospital)))
        .sort();

    const handleTabChange = (value) => {
        setActiveTab(value);
        setSearchQuery('');
        setSpecialtyFilter('all');
        setLocationFilter('all');
        setSortBy('rating');
        setSortOrder('desc');
    };

    const handleOpenDialog = (provider, type) => {
        setDialogProvider(provider);
        setDialogType(type);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setDialogProvider(null);
        setDialogType('');
        setMessageContent('');
    };

    const handleSendMessage = () => {
        addNotification({
            title: 'Message Sent!',
            description: `Your message to ${dialogProvider.name} has been sent.`, 
            type: 'success'
        });
        handleCloseDialog();
    };

    const renderEmptyState = (type) => (
        <div className="text-center py-12 bg-card rounded-lg shadow-sm col-span-full">
            <AlertCircle className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-3">No {type} Found</h3>
            <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find a {type === 'doctors' ? 'doctor' : 'pharmacy'}.
            </p>
            {type === 'doctors' && (
                <Button asChild>
                    <Link href="/patient/appointments/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Book New Appointment
                    </Link>
                </Button>
            )}
        </div>
    );

    const isDoctor = (provider) => activeTab === 'doctors';

    const renderContent = () => {
        let filteredProviders = activeTab === 'doctors' ? allDoctors : allPharmacies;

        // Apply search query
        if (searchQuery) {
            filteredProviders = filteredProviders.filter(provider => 
                provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (isDoctor(provider) && provider.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (!isDoctor(provider) && provider.pharmacyName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (!isDoctor(provider) && provider.address?.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Apply specialty filter (for doctors)
        if (activeTab === 'doctors' && specialtyFilter !== 'all') {
            filteredProviders = filteredProviders.filter(provider => 
                provider.specialization === specialtyFilter
            );
        }

        // Apply location filter (for doctors)
        if (activeTab === 'doctors' && locationFilter !== 'all') {
            filteredProviders = filteredProviders.filter(provider => 
                provider.hospital === locationFilter
            );
        }

        // Apply sorting
        filteredProviders.sort((a, b) => {
            let compareA, compareB;
            if (sortBy === 'name') {
                compareA = a.name.toLowerCase();
                compareB = b.name.toLowerCase();
            } else if (sortBy === 'rating') {
                compareA = a.rating || 0;
                compareB = b.rating || 0;
            } else if (sortBy === 'experience' && isDoctor(a) && isDoctor(b)) {
                compareA = a.yearsExperience || 0;
                compareB = b.yearsExperience || 0;
            } else {
                return 0; // No valid sorting key
            }

            if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
            if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map(provider => (
                    <ProviderCard 
                        key={provider.id} 
                        provider={provider} 
                        type={activeTab === 'doctors' ? 'doctor' : 'pharmacy'} 
                        onOpenDialog={handleOpenDialog}
                    />
                ))}
            </div>
        ) : (
            renderEmptyState(activeTab)
        );
    };

    return (
        <div className="flex flex-col space-y-6">
            <PageHeader
                title="Providers"
                description="Find and connect with healthcare professionals and pharmacies."
                breadcrumbs={[
                    { label: 'Patient', href: '/patient/dashboard' },
                    { label: 'Providers', href: '/patient/providers' }
                ]}
            />

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-4 w-full md:w-auto flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    {activeTab === 'doctors' && (
                        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Specialty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Specialties</SelectItem>
                                {uniqueSpecialties.map(specialty => (
                                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {activeTab === 'doctors' && (
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {uniqueLocations.map(location => (
                                    <SelectItem key={location} value={location}>{location}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                            {activeTab === 'doctors' && <SelectItem value="experience">Experience</SelectItem>}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        <ArrowUpDown className={cn("h-4 w-4", sortOrder === 'desc' ? 'rotate-180' : '')} />
                    </Button>
                </div>
            </div>

            <Separator />

            <Tabs defaultValue="doctors" className="w-full" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="doctors">Doctors</TabsTrigger>
                    <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
                </TabsList>
                <TabsContent value="doctors" className="mt-6">
                    {renderContent()}
                </TabsContent>
                <TabsContent value="pharmacies" className="mt-6">
                    {renderContent()}
                </TabsContent>
            </Tabs>

            {/* Dialog for Message/Appointment/Medicine Check */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {dialogType === 'message' ? `Message ${dialogProvider?.name}` : 
                             dialogType === 'appointment' ? `Book Appointment with ${dialogProvider?.name}` : 
                             `Check Medicine with ${dialogProvider?.name}`}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {dialogType === 'message' ? (
                            <div className="grid gap-2">
                                <Label htmlFor="message">Your Message</Label>
                                <Input
                                    id="message"
                                    placeholder="Type your message here."
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    className="min-h-[80px]"
                                />
                            </div>
                        ) : dialogType === 'appointment' ? (
                            <p className="text-muted-foreground">You will be redirected to the appointment scheduling page.</p>
                        ) : (
                            <p className="text-muted-foreground">You will be redirected to the medicine check page.</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                        {dialogType === 'message' ? (
                            <Button onClick={handleSendMessage}>Send Message</Button>
                        ) : dialogType === 'appointment' ? (
                            <Button onClick={() => {
                                handleCloseDialog();
                                router.push('/patient/appointments/new');
                            }}>Proceed to Book</Button>
                        ) : (
                            <Button onClick={() => {
                                handleCloseDialog();
                                // Assuming a medicine check page exists
                                // router.push('/patient/medications/check'); 
                            }}>Proceed</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default function ProvidersPage() {
    return (
        <NotificationProvider>
            <ProvidersPageContent />
        </NotificationProvider>
    );
} 