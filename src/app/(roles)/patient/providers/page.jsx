'use client';
import React, { useState, useEffect } from 'react';
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
    ChevronRight,
    Heart,
    Phone,
    Mail,
    Globe,
    Award,
    Clock4,
    Shield,
    Zap,
    TrendingUp,
    Eye,
    BookOpen,
    Users,
    Building2
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProviders } from '@/store/slices/patient/providersSlice';

const ProviderCardSkeleton = () => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 animate-pulse">
        <CardContent className="p-6 pb-6">
            <div className="flex items-start gap-6">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-800 shadow-lg"></div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            ))}
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                </div>
            </div>
            <div className="px-6 pb-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
            <div className="px-6 pb-6">
                <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const pepImages = [
  '/img/pep/dfasdf.jpg',
  '/img/pep/adfasdf.jpg',
  '/img/pep/imag2es.jpg',
  '/img/pep/sadasd.webp',
  '/img/pep/aadsfadsf.jpg',
  '/img/pep/patient-1.jpg',
  '/img/pep/patient-2.jpg',
  '/img/pep/istockphoto-1437816897-612x612.jpg',
  '/img/pep/360_F_608557356_ELcD2pwQO9pduTRL30umabzgJoQn5fnd.jpg',
  '/img/pep/asdasdjpg.jpg',
];

const ProviderCard = ({ provider, type, onOpenDialog, t, index }) => {
    const isDoctor = type === 'doctor';
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const getAvailabilityStatus = () => {
        if (isDoctor) {
            return { status: 'available', text: t('availableForConsultations'), color: 'text-green-600 dark:text-green-400' };
        }
        if (provider.availability) {
            const now = new Date();
            const day = now.toLocaleDateString('en-US', { weekday: 'short' });
            const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            
            if (provider.availability[day]) {
                const [open, close] = provider.availability[day];
                const isOpen = time >= open && time <= close;
                return {
                    status: isOpen ? 'open' : 'closed',
                    text: isOpen ? t('openNow') : t('closed'),
                    color: isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                };
            }
        }
        return { status: 'unknown', text: t('contactForHours'), color: 'text-muted-foreground' };
    };

    const availability = getAvailabilityStatus();

    return (
        <Card 
            className={cn(
                "group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border-0",
                "bg-card hover:bg-card/80 dark:bg-card dark:hover:bg-card/80",
                "hover:ring-2 hover:ring-primary/20"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/30 to-primary/10 rounded-full translate-y-8 -translate-x-8"></div>
            </div>

            <div className="absolute top-3 right-3 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-8 w-8 rounded-full transition-all duration-300",
                        "bg-background/90 backdrop-blur-sm hover:bg-background border border-border",
                        "hover:scale-110 shadow-sm"
                    )}
                    onClick={() => setIsFavorite(!isFavorite)}
                >
                    <Heart 
                        className={cn(
                            "h-4 w-4 transition-all duration-300",
                            isFavorite 
                                ? "fill-red-500 text-red-500 scale-110" 
                                : "text-muted-foreground hover:text-red-500"
                        )} 
                    />
                </Button>
            </div>

            <div className="absolute top-3 left-3 z-10">
                <Badge 
                    variant="secondary" 
                    className={cn(
                        "px-2 py-1 text-xs font-medium backdrop-blur-sm",
                        availability.color,
                        availability.status === 'open' ? "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800" : 
                        availability.status === 'closed' ? "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800" : 
                        "bg-muted border-border"
                    )}
                >
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full mr-1.5",
                        availability.status === 'open' ? "bg-green-500" : 
                        availability.status === 'closed' ? "bg-red-500" : 
                        "bg-muted-foreground"
                    )}></div>
                    {availability.text}
                </Badge>
            </div>
            
            <CardContent className="p-6 relative z-10">
                <div className="p-6 pb-6">
                    <div className="flex items-start gap-6">
                        <div className="relative">
                            <Avatar className={cn(
                                "h-20 w-20 ring-2 ring-border transition-all duration-300 shadow-sm",
                                isHovered && "scale-110 ring-primary/30"
                            )}>
                                <AvatarImage src={pepImages[index % pepImages.length]} />
                            </Avatar>
                            <div className={cn(
                                "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border border-background flex items-center justify-center transition-all duration-300",
                                isDoctor ? "bg-blue-500" : "bg-green-500",
                                isHovered && "scale-110"
                            )}>
                                {isDoctor ? (
                                    <Stethoscope className="h-2 w-2 text-white" />
                                ) : (
                                    <Pill className="h-2 w-2 text-white" />
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-foreground mb-1 line-clamp-1 transition-colors duration-300 group-hover:text-primary">
                                {provider.name}
                            </h3>
                            <p className="text-xs font-medium text-primary mb-2">
                                {isDoctor ? provider.specialization : provider.pharmacyName || provider.specialties?.join(', ')}
                            </p>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "h-3 w-3 transition-all duration-200",
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
                                <span className="text-xs font-medium text-foreground">
                                    {provider.rating?.toFixed(1)}
                                </span>
                                <Badge variant="secondary" className="ml-1 text-xs bg-primary/10 text-primary border-primary/20">
                                    {isDoctor ? (
                                        <>
                                            <Shield className="h-2.5 w-2.5 mr-1" />
                                            {t('verified')}
                                        </>
                                    ) : (
                                        <>
                                            <Award className="h-2.5 w-2.5 mr-1" />
                                            {t('licensed')}
                                        </>
                                    )}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <div className="space-y-2">
                        {isDoctor && provider.hospital && (
                            <div className="flex items-center gap-2 text-xs group/item">
                                <MapPin className="h-3 w-3 text-primary flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
                                <span className="text-muted-foreground truncate">{provider.hospital}</span>
                            </div>
                        )}
                        {!isDoctor && provider.address && (
                            <div className="flex items-center gap-2 text-xs group/item">
                                <MapPin className="h-3 w-3 text-primary flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
                                <span className="text-muted-foreground truncate">{provider.address}</span>
                            </div>
                        )}
                        {provider.yearsExperience && (
                            <div className="flex items-center gap-2 text-xs group/item">
                                <Briefcase className="h-3 w-3 text-primary flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
                                <span className="text-muted-foreground">
                                    {provider.yearsExperience} {t('yearsExperience')}
                                </span>
                            </div>
                        )}
                        {provider.education && provider.education.length > 0 && (
                            <div className="flex items-center gap-2 text-xs group/item">
                                <GraduationCap className="h-3 w-3 text-primary flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
                                <span className="text-muted-foreground truncate">
                                    {provider.education[provider.education.length - 1].degree} {t('from')} {
                                        provider.education[provider.education.length - 1].institution
                                    }
                                </span>
                            </div>
                        )}
                        {provider.languages && provider.languages.length > 0 && (
                            <div className="flex items-center gap-2 text-xs group/item">
                                <Languages className="h-3 w-3 text-primary flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
                                <span className="text-muted-foreground truncate">{provider.languages.join(', ')}</span>
                            </div>
                        )}
                    </div>

                    {!isDoctor && provider.specialties && provider.specialties.length > 0 && (
                        <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                                {provider.specialties.slice(0, 2).map((specialty, index) => (
                                    <Badge key={index} variant="outline" className="text-xs transition-all duration-200 hover:bg-primary/5 hover:border-primary/30">
                                        {specialty}
                                    </Badge>
                                ))}
                                {provider.specialties.length > 2 && (
                                    <Badge variant="outline" className="text-xs transition-all duration-200 hover:bg-primary/5 hover:border-primary/30">
                                        +{provider.specialties.length - 2} {t('more')}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6">
                    <div className="flex gap-2">
                        {isDoctor ? (
                            <>
                                <Button
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 text-xs h-8"
                                    onClick={() => onOpenDialog(provider, 'appointment')}
                                >
                                    <Calendar className="h-3 w-3 mr-1.5" />
                                    {t('bookAppointment')}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="flex-shrink-0 border border-primary text-primary hover:bg-primary hover:text-primary-foreground h-8 w-8"
                                    onClick={() => onOpenDialog(provider, 'message')}
                                >
                                    <MessageSquare className="h-3 w-3" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 text-xs h-8"
                                    onClick={() => onOpenDialog(provider, 'medicine')}
                                >
                                    <Pill className="h-3 w-3 mr-1.5" />
                                    {t('checkMedicine')}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="flex-shrink-0 border border-primary text-primary hover:bg-primary hover:text-primary-foreground h-8 w-8"
                                    onClick={() => onOpenDialog(provider, 'message')}
                                >
                                    <MessageSquare className="h-3 w-3" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const ProvidersPageContent = () => {
    const router = useRouter();
    const { addNotification } = useNotification();
    const { t, i18n } = useTranslation('common');
    const isRtl = i18n.language === 'ar';

    const [activeTab, setActiveTab] = useState('doctors');
    const [searchQuery, setSearchQuery] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [sortBy, setSortBy] = useState('rating');
    const [sortOrder, setSortOrder] = useState('desc'); 
    const [isLoading, setIsLoading] = useState(false);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogProvider, setDialogProvider] = useState(null);
    const [dialogType, setDialogType] = useState('');
    const [messageContent, setMessageContent] = useState('');

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchProviders());
    }, [dispatch]);
    const { providers, loading, error } = useSelector(state => state.providers);

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

    const searchSuggestions = [
        ...allDoctors.map(doc => ({ type: 'doctor', name: doc.name, specialization: doc.specialization })),
        ...allPharmacies.map(pharm => ({ type: 'pharmacy', name: pharm.name, specialization: pharm.pharmacyName }))
    ].filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

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
            title: t('messageSent') || 'Message Sent!',
            description: t('yourMessageTo', { name: dialogProvider.name }) || `Your message to ${dialogProvider.name} has been sent.`, 
            type: 'success'
        });
        handleCloseDialog();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setShowSearchSuggestions(e.target.value.length > 0);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.name);
        setShowSearchSuggestions(false);
    };

    const renderEmptyState = (type) => (
        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600 col-span-full">
            <div className="max-w-md mx-auto">
                <div className="relative mb-8">
                    <div className="h-24 w-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center animate-pulse">
                        <AlertCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                        <Search className="h-4 w-4 text-white" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">{t('noProvidersFound')}</h3>
                <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                    {t('tryAdjustingSearchOrFilters')}
                </p>
                {type === 'doctors' && (
                    <Button asChild className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg px-8 py-3 text-lg">
                        <Link href="/patient/appointments/new">
                            <span className="flex items-center gap-3">
                                <Plus className="h-6 w-6" />
                                <span>{t('bookNewAppointment')}</span>
                            </span>
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );

    const isDoctor = (provider) => activeTab === 'doctors';

    const renderContent = () => {
        let filteredProviders = activeTab === 'doctors' ? allDoctors : allPharmacies;

        if (searchQuery) {
            filteredProviders = filteredProviders.filter(provider => 
                provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (isDoctor(provider) && provider.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (!isDoctor(provider) && provider.pharmacyName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (!isDoctor(provider) && provider.address?.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (activeTab === 'doctors' && specialtyFilter !== 'all') {
            filteredProviders = filteredProviders.filter(provider => 
                provider.specialization === specialtyFilter
            );
        }

        if (activeTab === 'doctors' && locationFilter !== 'all') {
            filteredProviders = filteredProviders.filter(provider => 
                provider.hospital === locationFilter
            );
        }

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
                return 0; 
            }

            if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
            if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <ProviderCardSkeleton key={i} />
                    ))}
                </div>
            );
        }

        return filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProviders.map((provider, index) => (
                    <ProviderCard 
                        key={provider.id} 
                        provider={provider} 
                        type={activeTab === 'doctors' ? 'doctor' : 'pharmacy'} 
                        onOpenDialog={handleOpenDialog}
                        t={t}
                        index={index}
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
                title={t('providers')}
                description={t('findAndConnectWithHealthcareProfessionalsAndPharmacies')}
                breadcrumbs={[
                    { label: t('patient.dashboard.breadcrumb'), href: '/patient/dashboard' },
                    { label: t('sidebar.providers'), href: '/patient/providers' }
                ]}
            />

            <Card className="border border-border bg-card shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        <div className="flex flex-1 gap-4 w-full lg:w-auto flex-wrap">
                            <div className="relative flex-1 min-w-[250px] max-w-sm">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={`${t('search')} ${activeTab}...`}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                                    className="pl-10 h-10 text-sm border border-input focus:border-primary bg-background"
                                />
                                
                                {showSearchSuggestions && searchSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto">
                                        {searchSuggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors duration-200 border-b border-border last:border-b-0"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                <div className={cn(
                                                    "h-6 w-6 rounded-full flex items-center justify-center",
                                                    suggestion.type === 'doctor' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                                )}>
                                                    {suggestion.type === 'doctor' ? (
                                                        <Stethoscope className="h-3 w-3" />
                                                    ) : (
                                                        <Pill className="h-3 w-3" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-foreground truncate text-sm">{suggestion.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{suggestion.specialization}</p>
                                                </div>
                                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {activeTab === 'doctors' && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="h-10 px-4 justify-between min-w-[180px] border border-primary bg-background hover:bg-primary/5 text-primary">
                                            <Filter className="h-4 w-4 mr-2 text-primary" />
                                            {specialtyFilter === 'all' ? t('allSpecialties') : specialtyFilter}
                                            <ChevronRight className="h-4 w-4 ml-2 text-primary" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[180px] bg-background border border-border">
                                        <DropdownMenuItem onClick={() => setSpecialtyFilter('all')}>
                                            {t('allSpecialties')}
                                        </DropdownMenuItem>
                                        {uniqueSpecialties.map(specialty => (
                                            <DropdownMenuItem key={specialty} onClick={() => setSpecialtyFilter(specialty)}>
                                                {specialty}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            
                            {activeTab === 'doctors' && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="h-10 px-4 justify-between min-w-[180px] border border-primary bg-background hover:bg-primary/5 text-primary">
                                            <Building2 className="h-4 w-4 mr-2 text-primary" />
                                            {locationFilter === 'all' ? t('allLocations') : locationFilter}
                                            <ChevronRight className="h-4 w-4 ml-2 text-primary" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[180px] bg-background border border-border">
                                        <DropdownMenuItem onClick={() => setLocationFilter('all')}>
                                            {t('allLocations')}
                                        </DropdownMenuItem>
                                        {uniqueLocations.map(location => (
                                            <DropdownMenuItem key={location} onClick={() => setLocationFilter(location)}>
                                                {location}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-10 px-4 justify-between min-w-[160px] border border-primary bg-background hover:bg-primary/5 text-primary">
                                        <ArrowUpDown className="h-4 w-4 mr-2 text-primary" />
                                        {(() => {
                                            switch (sortBy) {
                                                case 'rating': return t('rating');
                                                case 'name': return t('name');
                                                case 'experience': return t('experience');
                                                default: return t('sortBy');
                                            }
                                        })()}
                                        <ChevronRight className="h-4 w-4 ml-2 text-primary" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[160px] bg-background border border-primary">
                                    <DropdownMenuItem onClick={() => setSortBy('rating')}>
                                        <Star className="h-4 w-4 mr-2" />
                                        {t('rating')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('name')}>
                                        <User className="h-4 w-4 mr-2" />
                                        {t('name')}
                                    </DropdownMenuItem>
                                    {activeTab === 'doctors' && (
                                        <DropdownMenuItem onClick={() => setSortBy('experience')}>
                                            <Briefcase className="h-4 w-4 mr-2" />
                                            {t('experience')}
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-10 w-10 border border-primary bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90"
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            >
                                <ArrowUpDown className={cn("h-4 w-4 transition-transform duration-300", sortOrder === 'desc' ? 'rotate-180' : '')} />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-border bg-card shadow-sm">
                <CardContent className="p-6">
                    <Tabs defaultValue="doctors" className="w-full" onValueChange={handleTabChange}>
                        <TabsList className="grid w-full grid-cols-2 h-12 bg-muted p-1">
                            <TabsTrigger 
                                value="doctors" 
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-300"
                            >
                                <Stethoscope className="h-4 w-4 mr-2" />
                                {t('doctors')}
                            </TabsTrigger>
                            <TabsTrigger 
                                value="pharmacies"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-300"
                            >
                                <Pill className="h-4 w-4 mr-2" />
                                {t('pharmacies')}
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="doctors" className="mt-6">
                            <main className={isRtl ? 'rtl' : 'ltr'}>
                                {renderContent()}
                            </main>
                        </TabsContent>
                        <TabsContent value="pharmacies" className="mt-6">
                            <main className={isRtl ? 'rtl' : 'ltr'}>
                                {renderContent()}
                            </main>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-background border border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
                            {dialogType === 'message' ? (
                                <>
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    {t('message')} {dialogProvider?.name}
                                </>
                            ) : dialogType === 'appointment' ? (
                                <>
                                    <Calendar className="h-5 w-5 text-primary" />
                                    {t('bookAppointmentWith')} {dialogProvider?.name}
                                </>
                            ) : (
                                <>
                                    <Pill className="h-5 w-5 text-primary" />
                                    {t('checkMedicineWith')} {dialogProvider?.name}
                                </>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        {dialogType === 'message' ? (
                            <div className="grid gap-4">
                                <Label htmlFor="message" className="text-base font-semibold text-foreground">{t('yourMessage')}</Label>
                                <Input
                                    id="message"
                                    placeholder={t('typeYourMessageHere')}
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    className="min-h-[100px] text-base border border-input focus:border-primary bg-background"
                                />
                            </div>
                        ) : dialogType === 'appointment' ? (
                            <div className="text-center py-8">
                                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Calendar className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-muted-foreground text-lg">{t('youWillBeRedirectedToAppointmentSchedulingPage')}</p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Pill className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-muted-foreground text-lg">{t('youWillBeRedirectedToMedicineCheckPage')}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={handleCloseDialog} className="px-6 border border-input bg-background text-foreground hover:bg-muted">
                            {t('cancel')}
                        </Button>
                        {dialogType === 'message' ? (
                            <Button 
                                onClick={handleSendMessage} 
                                variant="outline"
                                className="px-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                {t('sendMessage')}
                            </Button>
                        ) : dialogType === 'appointment' ? (
                            <Button 
                                onClick={() => {
                                    handleCloseDialog();
                                    router.push('/patient/appointments/new');
                                }}
                                className="px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                            >
                                <Calendar className="h-4 w-4 mr-2" />
                                {t('proceedToBook')}
                            </Button>
                        ) : (
                            <Button 
                                onClick={() => {
                                    handleCloseDialog();
                                }}
                                className="px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                            >
                                <Pill className="h-4 w-4 mr-2" />
                                {t('proceed')}
                            </Button>
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