'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
    FileText, Download, Eye, Search, Filter, 
    Plus, FileUp, Calendar as CalendarIcon,
    FileType, FileArchive, FileImage
} from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { Separator } from '@/components/ui/Separator';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMedicalRecords } from '@/store/slices/patient/medical-recordsSlice';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useTranslation } from 'react-i18next';

const RecordCard = ({ record, onView, onDownload }) => {
    const { t } = useTranslation('common');
    const getTypeIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'lab result':
                return <FileType className="h-4 w-4" />;
            case 'prescription':
                return <FileArchive className="h-4 w-4" />;
            case 'imaging':
                return <FileImage className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type.toLowerCase()) {
            case 'lab result':
                return 'bg-info/10 text-info border-info';
            case 'prescription':
                return 'bg-success/10 text-success border-success';
            case 'imaging':
                return 'bg-warning/10 text-warning border-warning';
            case 'note':
                return 'bg-secondary/10 text-secondary border-secondary';
            default:
                return 'bg-secondary/10 text-secondary border-secondary';
        }
    };

    return (
        <Card className="transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            {getTypeIcon(record.type)}
                            <h3 className="text-lg font-bold text-foreground">{record.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('patient.medicalRecords.addedBy')} <span className="font-semibold">{t('doctorWithName', { name: record.provider })}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4 text-primary" />
                                <span>{format(new Date(record.date), 'PPP')}</span>
                            </div>
                            {record.attachments?.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span>{record.attachments.length} {t('patient.medicalRecords.attachments')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-3">
                        <Badge className={getTypeColor(record.type)}>
                            {t(record.type.replace(/ /g, ''))}
                        </Badge>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onView(record)}
                                className="flex items-center gap-2"
                            >
                                <Link href={`/patient/medical-records/${record.id}`}>
                                    <span className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        {t('patient.medicalRecords.view')}
                                    </span>
                                </Link>
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onDownload(record)}
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                {t('patient.medicalRecords.download')}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const MedicalRecordsPage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const { t, i18n } = useTranslation('common');
    const isRtl = i18n.language === 'ar';
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchMedicalRecords());
    }, [dispatch]);
    const { medicalRecords, loading: isLoading, error } = useSelector(state => state.medicalRecords);

    const handleViewRecord = (record) => {
        router.push(`/patient/medical-records/${record.id}`);
    };

    const handleDownloadRecord = (record) => {
        console.log('Downloading record:', record);
    };

    const filteredRecords = medicalRecords.filter(record => {
        const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.provider.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || record.type.toLowerCase() === typeFilter.toLowerCase();
        const matchesDate = dateFilter === 'all' || record.date.includes(dateFilter);
        const matchesTab = activeTab === 'all' || record.type.toLowerCase() === activeTab.toLowerCase();
        return matchesSearch && matchesType && matchesDate && matchesTab;
    });

    return (
        <div className="flex flex-col space-y-6">
            <PageHeader
                title={t('patient.medicalRecords.title', 'Medical Records')}
                description={t('patient.medicalRecords.accessAndManageYourMedicalHistoryAndDocuments')}
                breadcrumbs={[
                    { label: t('patient.dashboard.breadcrumb'), href: '/patient/dashboard' },
                    { label: t('patient.medicalRecords.title', 'Medical Records'), href: '/patient/medical-records' }
                ]}
            />

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-4 w-full md:w-auto flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={t('patient.medicalRecords.searchPlaceholder', 'Search records by title or provider')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 border-border focus:border-primary focus:ring-primary/20"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger >
                            <Button variant="outline" className="w-[180px] justify-between">
                                <span>
                                    {(() => {
                                        switch (typeFilter) {
                                            case 'lab result': return t('patient.medicalRecords.labResults');
                                            case 'prescription': return t('patient.medicalRecords.prescriptions');
                                            case 'imaging': return t('patient.medicalRecords.imaging');
                                            case 'note': return t('patient.medicalRecords.notes');
                                            default: return t('patient.medicalRecords.allTypes');
                                        }
                                    })()}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setTypeFilter('all')}>{t('patient.medicalRecords.allTypes')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeFilter('lab result')}>{t('patient.medicalRecords.labResults')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeFilter('prescription')}>{t('patient.medicalRecords.prescriptions')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeFilter('imaging')}>{t('patient.medicalRecords.imaging')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeFilter('note')}>{t('patient.medicalRecords.notes')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger >
                            <Button variant="outline" className="w-[180px] justify-between">
                                <span>
                                    {dateFilter === 'all' ? t('patient.medicalRecords.allTime') : dateFilter}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setDateFilter('all')}>{t('patient.medicalRecords.allTime')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDateFilter('2024')}>2024</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDateFilter('2023')}>2023</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDateFilter('2022')}>2022</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button  className="w-full md:w-auto">
                    <Link href="/patient/medical-records/upload">
                        <span className="flex items-center gap-2">
                            <Plus className="h-4 w-4 mr-2" />
                            {t('patient.medicalRecords.upload', 'Upload New Record')}
                        </span>
                    </Link>
                </Button>
            </div>


            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">{t('patient.medicalRecords.allRecords', 'All Records')}</TabsTrigger>
                    <TabsTrigger value="lab result">{t('patient.medicalRecords.labResults', 'Lab Results')}</TabsTrigger>
                    <TabsTrigger value="prescription">{t('patient.medicalRecords.prescriptions', 'Prescriptions')}</TabsTrigger>
                    <TabsTrigger value="imaging">{t('patient.medicalRecords.imaging', 'Imaging')}</TabsTrigger>
                    <TabsTrigger value="note">{t('patient.medicalRecords.notes', 'Notes')}</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6">
                    <div>
                        <div className="grid gap-4">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((record) => (
                                    <RecordCard
                                        key={record.id}
                                        record={record}
                                        onView={handleViewRecord}
                                        onDownload={handleDownloadRecord}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 bg-card rounded-2xl shadow-sm">
                                    <FileText className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-3 text-foreground">{t('patient.medicalRecords.noRecordsFound', 'No Medical Records Found')}</h3>
                                    <p className="text-muted-foreground mb-6">
                                        {searchQuery || typeFilter !== 'all' || dateFilter !== 'all'
                                            ? t('patient.medicalRecords.tryAdjusting', 'Try adjusting your search or filters to find records.')
                                            : t('patient.medicalRecords.noRecordsYet', "You don't have any medical records here yet. Upload your first document!")}
                                    </p>
                                    <Button >
                                        <Link href="/patient/medical-records/upload">
                                            <span className="flex items-center gap-2">
                                                <Plus className="h-4 w-4 mr-2" />
                                                {t('patient.medicalRecords.upload', 'Upload New Record')}
                                            </span>
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MedicalRecordsPage;